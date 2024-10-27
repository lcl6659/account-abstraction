# Paymaster
使用 `Paymaster`可以实现以下功能：
1. 让用户可以使用ERC-20代币，支付`Gas`费，而不是必须要`ETH`
2. 替用户支付`Gas`费。

eip-4337中的描述：https://eips.ethereum.org/EIPS/eip-4337#paymasters

## 执行流程
当 `User Operation` 的 `paymasterAndData` 字段不为空时，表示处理这个 `User Operation` 时使用 `Paymaster`，这样支付给 `Bundler` 的 `Gas` 不用 `Account 合约`出了。由 `Paymaster` 代付，

![Paymaster](/images/pm.jpg)

## Paymaster合约与Account、EntryPoint 合约

###  1. approve
`Account 合约` 需要 `approve` 给 `Paymaster` 一定数量的 `ERC-20代币` 的额度，让 `Paymaster` 可以提取相应的Gas.

![approve](/images/approve-pm.png)

### 2. deposit
在 `Paymaster` 合约中，用户通过 `deposit()` 方法存入的 `ETH` 实际上是存放在 `EntryPoint` 合约中的。这些存款用于支付交易的 `Gas 费用`。具体来说：
1. 存款到 `EntryPoint`：当用户调用 `deposit()` 方法并发送 `ETH` 时，这些 ETH 会被转移到 EntryPoint 合约中。这个合约负责管理和处理与支付相关的操作。
2. 支付 gas 费用：在用户的操作（例如，调用某个合约的函数）执行时，`Paymaster` 合约会使用存放在 `EntryPoint` 合约中的 `ETH` 来支付相应的 `Gas 费用`。

![deposit](/images/deposit.png)

### 3. addStake
`Paymaster` 合约需要在 `EntryPoint` 合约中，质押一定数量的 `ETH`。

质押是为了确保 paymaster 合约的安全性和可靠性。质押的 ETH 通常用于激励机制，确保合约的拥有者在合约的操作中承担一定的风险。如果合约的操作出现问题，质押的 ETH 可能会被用作赔偿或惩罚。

![addStake](/images/addStake.png)

## Paymaster 合约实现

这里提供一个的 `Paymaster` 合约，继承 `@account-abstraction/contracts`的 `BasePaymaster`合约。

安装依赖
``` shell
npm install @account-abstraction/contracts @openzeppelin/contracts
```

合约代码：Paymaster.sol
```Solidity
// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.12;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@account-abstraction/contracts/core/BasePaymaster.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";

contract UxPaymaster is BasePaymaster, ReentrancyGuard {
    using SafeERC20 for IERC20;

    IERC20 public token;
    uint256 public constant PRICE_DENOMINATOR = 1e6;
    uint256 public defaultTokenPricePerEth;
    uint256 public constant COST_OF_POST = 35000;

    event TokenPriceUpdated(uint256 newPrice);
    event TokenUpdated(address newToken);

    constructor(IEntryPoint _entryPoint, IERC20 _token, uint256 _defaultTokenPricePerEth) BasePaymaster(_entryPoint) {
        token = _token;
        defaultTokenPricePerEth = _defaultTokenPricePerEth;
    }

    function setDefaultTokenPricePerEth(uint256 _defaultTokenPricePerEth) external onlyOwner {
        defaultTokenPricePerEth = _defaultTokenPricePerEth;
        emit TokenPriceUpdated(_defaultTokenPricePerEth);
    }

    function setToken(IERC20 _newToken) external onlyOwner {
        token = _newToken;
        emit TokenUpdated(address(_newToken));
    }

    function withdrawToken(address to, uint256 amount) external onlyOwner {
        token.safeTransfer(to, amount);
    }

    function getTokenValueOfEth(uint256 ethAmount, uint256 tokenPrice) public pure returns (uint256) {
        return ethAmount * tokenPrice / PRICE_DENOMINATOR;
    }

    function extractPaymasterData(bytes calldata paymasterAndData) public pure returns (address paymasterAddress, uint256 tokenPrice) {
        paymasterAddress = address(bytes20(paymasterAndData[:20]));
        tokenPrice = abi.decode(paymasterAndData[20:], (uint256));
    }

    function _validatePaymasterUserOp(UserOperation calldata userOp, bytes32 userOpHash, uint256 maxCost)
    internal view override returns (bytes memory context, uint256 validationData) {
        (userOpHash);
        
        require(userOp.verificationGasLimit >= COST_OF_POST, "UxPaymaster: gas too low for postOp");

        uint256 tokenPrice = defaultTokenPricePerEth;
        uint256 tokenAmount = getTokenValueOfEth(maxCost, tokenPrice);
        require(token.balanceOf(userOp.sender) >= tokenAmount, "UxPaymaster: insufficient token balance");
        require(token.allowance(userOp.sender, address(this)) >= tokenAmount, "UxPaymaster: insufficient token allowance");

        return (abi.encode(userOp.sender, tokenAmount, tokenPrice), 0);
    }

    function _postOp(PostOpMode mode, bytes calldata context, uint256 actualGasCost) internal override nonReentrant {
        (address sender, uint256 preChargeTokenAmount, uint256 tokenPrice) = abi.decode(context, (address, uint256, uint256));
        uint256 actualTokenAmount = getTokenValueOfEth(actualGasCost, tokenPrice);

        if (mode != PostOpMode.postOpReverted) {
            uint256 totalCost = Math.min(preChargeTokenAmount, actualTokenAmount + getTokenValueOfEth(COST_OF_POST, tokenPrice));
            token.safeTransferFrom(sender, address(this), totalCost);
        } else {
            uint256 postOpCost = getTokenValueOfEth(COST_OF_POST, tokenPrice);
            token.safeTransferFrom(sender, address(this), postOpCost);
        }
    }
}


```

