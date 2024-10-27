# User Operations

描述代表用户发送的交易的结构。但这不是要真正发到链上的交易，只是一个“伪交易”。

![userOperation](/images/userOp.jpg)

用户将`UserOperation`对象发送到一个专用的用户操作内存池。他们不关心打包版本。
一类特殊的参与者称为**打包者**（要么是运行特殊代码的区块构建者，要么是可以将交易中继到区块构建者的用户，例如通过可以保证下一区块或永不包含的捆绑市场如Flashbots）监听用户操作内存池，并创建**捆绑交易**。一个捆绑交易将多个`UserOperation`对象打包成对预发布的全球**入口点合约**的单个`handleOps`调用。

为了防止重放攻击（包括跨链和多个`EntryPoint`实现），`signature`应该依赖于`chainid`和`EntryPoint`地址。

详细可查看：https://eips.ethereum.org/EIPS/eip-4337#useroperation

数据结构如下，分别列出0.6和0.7版本。

## 0.6版本

| Field | Type | Description
| - | - | - |
| `sender` | `address` | The account making the operation |
| `nonce` | `uint256` | Anti-replay parameter |
| `initCode` | `bytes` | The initCode of the account (needed if and only if the account is not yet on-chain and needs to be created) |
| `callData` | `bytes` | The data to pass to the `sender` during the main execution call |
| `callGasLimit` | `uint256` | The amount of gas to allocate the main execution call |
| `verificationGasLimit` | `uint256` | The amount of gas to allocate for the verification step |
| `preVerificationGas` | `uint256` | The amount of gas to pay for to compensate the bundler for pre-verification execution and calldata |
| `maxFeePerGas` | `uint256` | Maximum fee per gas (similar to [EIP-1559](https://eips.ethereum.org/EIPS/eip-1559) `max_fee_per_gas`) |
| `maxPriorityFeePerGas` | `uint256` | Maximum priority fee per gas (similar to EIP-1559 `max_priority_fee_per_gas`) |
| `paymasterAndData` | `bytes` | Address of paymaster sponsoring the transaction, followed by extra data to send to the paymaster (empty for self-sponsored transaction) |
| `signature` | `bytes` | Data passed into the account along with the nonce during the verification step |


这里提供一个前端生成UserOperation的方法。
``` ts
import { BigNumber, ethers } from "ethers";

const abi = {
  SimpleAccount: [....],
}
const baseChainData = {
  rpc: "";
  entryPoint: "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789";
  simpleAccountFactory: "0x9406Cc6185a346906296840746125a0E44976454";
  paymaster: "";
  bundlerUrl: "";
}
const aaAccountAddress = "0x....";
const generateUserOperation = async (executeData: any) => {
    try {
      const provider = new ethers.providers.JsonRpcProvider(baseChainData.rpc);
      const signer = new ethers.Wallet(privateKey.current, provider);
      const accountContract = new ethers.Contract(aaAccountAddress, abi.SimpleAccount, provider);
  
      const to = executeData.to;
      const value = executeData.value;
      const data = executeData.data;

      const nonce = await accountContract.getNonce();
      const callData = accountContract.interface.encodeFunctionData('execute', [to, value, data]);
  
      const chainId = await provider.getNetwork().then(net => net.chainId);
      const entryPointAddress = baseChainData.entryPoint;

      const userOperation: any = {
        sender: aaAccountAddress,
        nonce: nonce.toHexString(),
        initCode: '0x',
        callData,
        callGasLimit: ethers.utils.hexlify(200000),
        verificationGasLimit: ethers.utils.hexlify(5000000),
        preVerificationGas: ethers.utils.hexlify(56000),
        maxFeePerGas: ethers.utils.hexlify(3681004960),
        maxPriorityFeePerGas: ethers.utils.hexlify(3600000000),
        paymasterAndData: "0x",
        signature: '0x'
      };
  
      const userOpHash = ethers.utils.keccak256(
        ethers.utils.defaultAbiCoder.encode(
          ['address', 'uint256', 'bytes32', 'bytes32', 'uint256', 'uint256', 'uint256', 'uint256', 'uint256', 'bytes32'],
          [
            userOperation.sender,
            userOperation.nonce,
            ethers.utils.keccak256(userOperation.initCode),
            ethers.utils.keccak256(userOperation.callData),
            userOperation.callGasLimit,
            userOperation.verificationGasLimit,
            userOperation.preVerificationGas,
            userOperation.maxFeePerGas,
            userOperation.maxPriorityFeePerGas,
            ethers.utils.keccak256(userOperation.paymasterAndData)
          ]
        )
      );
  
      const finalUserOpHash = ethers.utils.keccak256(
        ethers.utils.defaultAbiCoder.encode(
          ['bytes32', 'address', 'uint256'],
          [userOpHash, entryPointAddress, chainId]
        )
      );
  
      const signature = await signer.signMessage(ethers.utils.arrayify(finalUserOpHash));
      userOperation.signature = signature;
  
      console.log("generated UserOperation:", userOperation);
  
      return userOperation;
    } catch (err) {
      console.error("generate UserOperation error:", err);
      throw err;
    }
  };
```


## 0.7 版本


| Field                           | Type      | Description                                                                    |
|---------------------------------|-----------|--------------------------------------------------------------------------------|
| `sender`                        | `address` | The account making the operation                                               |
| `nonce`                         | `uint256` | Anti-replay parameter (see "Semi-abstracted Nonce Support" )                   |
| `factory`                       | `address` | account factory, only for new accounts                                         |
| `factoryData`                   | `bytes`   | data for account factory (only if account factory exists)                      |
| `callData`                      | `bytes`   | The data to pass to the `sender` during the main execution call                |
| `callGasLimit`                  | `uint256` | The amount of gas to allocate the main execution call                          |
| `verificationGasLimit`          | `uint256` | The amount of gas to allocate for the verification step                        |
| `preVerificationGas`            | `uint256` | Extra gas to pay the bunder                                                    |
| `maxFeePerGas`                  | `uint256` | Maximum fee per gas (similar to [EIP-1559](https://eips.ethereum.org/EIPS/eip-1559) `max_fee_per_gas`)   |
| `maxPriorityFeePerGas`          | `uint256` | Maximum priority fee per gas (similar to EIP-1559 `max_priority_fee_per_gas`)  |
| `paymaster`                     | `address` | Address of paymaster contract, (or empty, if account pays for itself)          |
| `paymasterVerificationGasLimit` | `uint256` | The amount of gas to allocate for the paymaster validation code                |
| `paymasterPostOpGasLimit`       | `uint256` | The amount of gas to allocate for the paymaster post-operation code            |
| `paymasterData`                 | `bytes`   | Data for paymaster (only if paymaster exists)                                  |
| `signature`                     | `bytes`   | Data passed into the account to verify authorization                           |

这里提供前端生成UserOperation的方法：

``` ts
import { BigNumber, ethers } from "ethers";

const abi = {
  SimpleAccount: [....],
}
const baseChainData = {
  rpc: "";
  entryPoint: "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789";
  simpleAccountFactory: "0x9406Cc6185a346906296840746125a0E44976454";
  paymaster: "";
  bundlerUrl: "";
}
const aaAccountAddress = "0x....";
const generateUserOperationCustom_07 = async (executeData: any) => {
    try {
      const signer = new ethers.Wallet(privateKey.current, provider);
      const accountContract = new ethers.Contract(aaAccountAddress, abi.SimpleAccount, provider);
  
      const to = executeData.to;
      const value = executeData.value;
      const data = executeData.data;
  
      const nonce = await accountContract.getNonce();
      const callData = accountContract.interface.encodeFunctionData('execute', [to, value, data]);
  
      const chainId = await provider.getNetwork().then(net => net.chainId);
      const entryPointAddress = baseChainData.entryPoint;
      
      const userOperation: any = {
        sender: aaAccountAddress,
        nonce: nonce.toHexString(),
        factory: baseChainData.simpleAccountFactory,
        factoryData: '0x',
        callData,
        callGasLimit: ethers.utils.hexlify(200000),
        verificationGasLimit: ethers.utils.hexlify(150000),
        preVerificationGas: '0xb380',
        maxFeePerGas: ethers.utils.hexlify(1000000000),
        maxPriorityFeePerGas: ethers.utils.hexlify(1000000000),
        paymaster: ethers.constants.AddressZero,
        paymasterVerificationGasLimit: '0x0',
        paymasterPostOpGasLimit: '0x0',
        paymasterData: '0x',
        signature: '0x'
      };
  
      // encode UserOperation hash
      const userOpHash = ethers.utils.keccak256(
        ethers.utils.defaultAbiCoder.encode(
          ['address', 'uint256', 'bytes32', 'bytes32', 'uint256', 'uint256', 'uint256', 'uint256', 'uint256',
           'address', 'uint256', 'uint256',
            'bytes32'
          ],
          [
            userOperation.sender,
            userOperation.nonce,
            ethers.utils.keccak256(userOperation.factoryData),
            ethers.utils.keccak256(userOperation.callData),
            userOperation.callGasLimit,
            userOperation.verificationGasLimit,
            userOperation.preVerificationGas,
            userOperation.maxFeePerGas,
            userOperation.maxPriorityFeePerGas,
            userOperation.paymaster,
            userOperation.paymasterVerificationGasLimit,
            userOperation.paymasterPostOpGasLimit,
            ethers.utils.keccak256(userOperation.paymasterData)
          ]
        )
      );
  
      // encode UserOperation hash with chainId and entryPoint address
      const finalUserOpHash = ethers.utils.keccak256(
        ethers.utils.defaultAbiCoder.encode(
          ['bytes32', 'address', 'uint256'],
          [userOpHash, entryPointAddress, chainId]
        )
      );
  
      // sign final hash
      const signature = await signer.signMessage(ethers.utils.arrayify(finalUserOpHash));
      userOperation.signature = signature;
  
      console.log("generated UserOperation:", userOperation);
  
      return userOperation;
    } catch (err) {
      console.error("generate UserOperation error:", err);
      throw err;
    }
  };

```
