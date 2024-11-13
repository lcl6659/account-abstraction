# AA 接口

## 1. 获取AA wallet Address
api: getAAWalletAddress

入参
```js
{
    userUid: "userUid", // 用户的user id
    chainName: "ArbitrumSepolia", // 链的枚举名称
}
```

返回
```js
{
    aaWalletAddress: "0x....."
}
```

## 2. Approve
api: sendApproveOrder

入参：
```js
无
```

返回：
```js
{
    orderId: "...", // 订单id
}
```


## 2. 发起交易订单

api： sendCommonOrder

入参：
```js
{
    userUid: "userUid", // 用户的user id
    chainName: "ArbitrumSepolia", // 链的枚举名称
    executeData: {
        to: "0x.....", // 需要调用的业务合约地址
        data: "...", // 调用合约的encode字符串，SDK会给出生成executeData的方法
    },
}
```

返回：
```js
{
    orderId: "...", // 订单id
}
```


## 2.1 过程：拿到订单后，跳转收银台，链接携带 orderId

## 3 输入密码，提交订单号，处理交易
api: sendAATransactionByOrderId

入参：
```js
{
    password: "******",
    orderId: "",
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

## 3.1 查询订单状态
api: getOrderResult

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


## 4. 查询用户AA账户余额
api: getWalletBalance

入参：
```js
{
    aaWalletAddress: "0x..."
}
```

返回:
```
{
    data: [
        {
            balance: "20.33",
            tokenName: "UXLINK",
            tokenContractAddress: "0x...."
        },
        ...
    ]
}
```

## 5. 获取 approve 剩余额度
api：getApproveBalanceToPaymaster

入参
```js
{
    aaWalletAddress: "0x..."
}
```

返回
```js
{
    balance: "2000.22", // 剩余的approve额度
}
```

## 6. 获取AA 账户合约，是否已经部署
api: getAaAccountContractIsDeployed

入参： 
```js
{
    aaWalletAddress: "0x..."
}
```

返回： 
```js
{
    data: true,
}

```

## 7. 获取预估的gas费
api: estimateGas

入参：
```js
{
    chainName: Network.ArbitrumSepolia,
    executeData: {
        to: "0x.....", // 需要调用的业务合约地址
        data: "...", // 调用合约的encode字符串，SDK会给出生成executeData的方法
    },
}
```

返回
```
{
    gasFee: "4.55",
    tokenName: "UXLINK", // gas的代币
}
```
