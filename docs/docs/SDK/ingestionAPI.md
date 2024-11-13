# Ingestion API

## 1. 发起交易订单

api： /aaWallet/v1/sendExecuteData

入参：
```js
{
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

## 2. Approve
api: /aaWallet/v1/approve

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

## 3. 查询订单状态
api: /aaWallet/v1/getTransactionResult

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


## 4. 查询账户余额
api: /aaWallet/v1/getAccountBalance

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
