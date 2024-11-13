# Quick Start

## 发起交易
使用UXLINK Account，可以调用其他合约，执行自定义的业务逻辑。

发起交易的流程，如下：
1. 提交 Execute Data。
2. 跳转用户密码验证页面，用户输入密码，验证通过后发送交易上链。
3. 交易执行后，跳转到replaceUrl，通过查询订单的接口查询交易结果。

### 1. 提交订单
提交订单的接口如下：
`POST /aaWallet/v1/sendExecuteData`

入参：
```js
executeData: {
  to: "0x.....", // 需要调用的业务合约地址
  data: "...", // encode字符串，包含需要执行合约的函数名，以及传给此函数的参数。下面会给出创建executeData的方法。
},
```

返回：
```js
{
    orderId: "...", // 这笔交易的id，可用于查询交易结果。
}
```

#### 1.1 生成 executeData
由于创建executeData需要对应业务合约的ABI，这个文件太大，不方便接口传递，所以需要项目方生成，这里提供生成的函数：

```js
import { ethers } from "ethers";

const rpc = ""; // TODO 这里修改使用的rpc链接
const provider = new ethers.providers.JsonRpcProvider(rpc);

/**
 * @param contractAddress 合约地址
 * @param contractABI 合约的 ABI
 * @param executeFunctionName 要执行的函数名称
 * @param executeFunctionArgs 要传递给函数的参数
 */
createExecuteData(contractAddress: string, contractABI: any[], executeFunctionName: string, executeFunctionArgs: any[]) {
  const contract = new ethers.Contract(contractAddress, contractABI, provider);
  return {
    to: contractAddress,
    data: contract.interface.encodeFunctionData(executeFunctionName, executeFunctionArgs),
  };
}
```


### 2. 跳转用户密码验证页面
得到orderId后，跳转：
```
https://oneAccount.uxlink.io/confirmExecuteData?orderId=ORDER_ID&replaceUrl=YOUR_REDIRECT_URI
```
用户输入密码后，服务端验证密码无误，就会提交此orderId对应的交易交易数据到链上，执行相关的业务。

#### 3. 获取结果
在密码验证页面，用户输入密码后，交易发送并执行成功，会跳转replaceUrl，并携带orderId。

接收到地址上携带的orderId，可使用查询订单状态的接口，查询执行结果。

接口: `/aaWallet/v1/getTransactionResult`

入参： 
```js
{
    orderId: "...",
}
```

返回：
```js
// 成功：
{
    orderId: "",
    transactionHash: "",
}


// 失败
{
    orderId: "",
    error: "", // 错误信息
}
```

