# Bundler

捆绑器是一个节点，它监控`UserOperation mempool`并将多个交易`UserOperation`捆绑在一起，作为单个`交易`转发到 `EntryPoint` 合约。

Bundler 是需要独立部署的程序，也可以使用第三方提供的`Bundler`服务。

用户通过 Bundler 的 RPC `eth_sendUserOperation`， 可以提交 `User Operation` 到 `User Operation Mempool` 中；

Bundler 调用 `EntryPoint` 合约的 `handleOps` 方法，可以把 `User Operation` 作为 `handleOps` 的参数提交上链。

![userOperation](/images/userOp.jpg)

## Bundler RPC methods

| method | Description |
| - | - |
| `eth_sendUserOperation` | send a user operation |
| `eth_estimateUserOperationGas` | estimate the gas required for a user operation |
| `eth_getUserOperationByHash` | fetch the user operation receipt and corresponding bundler transaction data |
| `eth_getUserOperationReceipt` | fetch the user operation receipt |
| `eth_supportedEntryPoints` | returns the EntryPoints supported by the bundler |

- 详细可可查看：https://eips.ethereum.org/EIPS/eip-4337#rpc-methods-eth-namespace
- 想要自己部署或者本地运行Bundler，可参考
    - https://github.com/eth-infinitism/bundler
    - https://github.com/stackup-wallet/stackup-bundler

## 错误码

所有 ERC-4337 错误响应都具有以下格式：
```ts
{
  "jsonrpc": "2.0",
  "id": 1
  "error": {
    code,
    message
  }
}
```

|Code	| Description |
| - | - |
| -32521 |	交易在执行阶段已撤销（或将撤销）。 |
| -32602 |	无效的 UserOperation 结构/字段。 |
| -32500 |	在创建或验证帐户期间，交易被 entryPoint 的 mockupValidation 拒绝。 |
| -32501 |	交易被付款人拒绝。validatePaymasterUserOp |
| -32502 |	由于操作码验证，交易被拒绝。 |
| -32503 |	用户操作超出时间范围：账户或付款人返回了一个时间范围，并且该时间范围已经过期（或即将过期）。 |
| -32504 |	由于付款人（或签名聚合器）受到限制/禁止，交易被拒绝。 |
| -32505 |	由于付款人（或签名聚合器）的质押或取消质押延迟太低，交易被拒绝。 |
| -32506 |	交易被拒绝，因为帐户指定了不受支持的签名聚合器。 |
| -32507 |	或者返回无效的签名检查。validateUserOpvalidatePaymasterUserOp |

参考：
- https://eips.ethereum.org/EIPS/eip-4337#return-value
- https://docs.alchemy.com/reference/bundler-api-errors

## 调用 Bundler method
使用 bundler method，以下提供前端调用的实现： 
``` ts
const baseChainData = {
  entryPoint: "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789";
  bundlerUrl: "";
}
const sendUserOperation = (userOperation: any) => {
  return new Promise(async (resolve, reject) => {
    const bundlerUrl = baseChainData.bundlerUrl;
    const params = {
      method: "eth_sendUserOperation",
      params: [userOperation, baseChainData.entryPoint],
      id: 1,
      jsonrpc: "2.0"
    };
    try {
      const response = await fetch(bundlerUrl, {
        method: "POST",
        headers: {
          accept: 'application/json',
          'content-type': 'application/json'
        },
        body: JSON.stringify(params),
      });
      const data = await response.json();
      console.log("response data:", data);
      if (data.error) {
        console.error("error:", data.error);
        reject(data.error);
      }
      if (data.result) {
        resolve(data);
      }
    } catch (error) {
      console.error("Error sending:", error);
      reject({ code: 500, message: "send error" });
    }
  })
}

// get gas price
const getEstimateUserOperationGas = (userOperation: any) => {
  return new Promise(async (resolve, reject) => {
    const bundlerUrl = baseChainData.bundlerUrl;
    const params = {
      method: "eth_estimateUserOperationGas",
      params: [userOperation, baseChainData.entryPoint],
      id: 1,
      jsonrpc: "2.0"
    };
    try {
      const response = await fetch(bundlerUrl, {
        method: "POST",
        headers: {
          accept: 'application/json',
          'content-type': 'application/json'
        },
        body: JSON.stringify(params),
      });
      const data = await response.json();
      console.log("response data:", data);
      if (data.error) {
        console.error("error:", data.error);
        reject(data.error);
      }
      if (data.result) {
        resolve(data);
      }
      return data;
    } catch (error) {
      console.error("Error sending:", error);
      reject({ code: 500, message: "send error" });
    }
  });
}

const getUserOperationByHash = async (hash: string) => {
  return new Promise(async (resolve, reject) => {
    const bundlerUrl = baseChainData.bundlerUrl;
    const params = {
      method: "eth_getUserOperationByHash",
      params: [hash],
      id: 1,
      jsonrpc: "2.0"
    };
    try {
      const response = await fetch(bundlerUrl, {
        method: "POST",
        headers: {
          accept: 'application/json',
          'content-type': 'application/json'
        },
        body: JSON.stringify(params),
      });
      const data = await response.json();
      if (data.error) {
        console.error("error:", data.error);
        reject(data.error);
      }
      if (data.result) {
        resolve(data);
      }
      return data;
    } catch (error) {
      console.error("Error sending:", error);
      reject({ code: 500, message: "send error" });
    }
  });
}

```

