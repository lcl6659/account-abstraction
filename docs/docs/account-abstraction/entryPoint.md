# EntryPoint 合约
[EntryPoint](https://github.com/eth-infinitism/account-abstraction/blob/develop/contracts/core/EntryPoint.sol)是实现ERC-4337非常重要的合约，它已经通过审计并部署在各个 EVM 兼容链上。

EntryPoint 不需要开发者实现，目前社区已经部署上线了，当前`EntryPoint`主要有2个版本，分别是：
- 0.6版本：
    - 合约地址：0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789
    - 源码地址：[EntryPoint.sol](https://github.com/eth-infinitism/account-abstraction/blob/releases/v0.6/contracts/core/EntryPoint.sol)
- 0.7版本：
    - 合约地址：0x0000000071727De22E5E9d8BAf0edAc6f37da032
    - 源码地址：[EntryPoint.sol](https://github.com/eth-infinitism/account-abstraction/blob/releases/v0.7/contracts/core/EntryPoint.sol)

审计报告：[Ethereum_Account_Abstraction_Incremental_Audit_Feb_2023](https://github.com/eth-infinitism/account-abstraction/blob/releases/v0.6/audits/EIP_4337_%E2%80%93_Ethereum_Account_Abstraction_Incremental_Audit_Feb_2023.pdf)

## 功能介绍
`ERC-4337` 将 一笔交易的验证和执行进行了分离，EntryPoint 主要执行的是验证部分的逻辑，保证用户提交的`UserOperation`完全安全合法后, 才能将数据传递给用户的`Account合约`，由`Account合约`去执行相应的业务逻辑。

这样的设计，让项目方可以自定义账户的一些执行逻辑，极大的提高了业务的想象力。

![userOperation](/images/ep.webp)

1. 会先去检查 `User Operation` 的 `AA Wallet` 是否存在，如果不存在且有提供 `initCode` 则部署一个新的。
2. 调用 `AA Wallet` 里面的函数来检查签名是否合法。
3. 检查指定的 `Paymaster` 是否有`抵押`，并且检查 `Paymaster` 的`存款`是否足够。
4. 调用 `Paymaster` 里面的函数来进行支付相关的检查（例如，AA Wallet 是否有在 Paymaster 存入足够的 ERC20 来抵用手续费）。
5. 执行 `User Operation` 中的主要逻辑（例如，Swap token）。
6. 偿还 `Paymaster` 帮忙代墊的手续费，还有给 `Bundler` 打包费用。

## EntryPoint Revert Codes

Bundler 错误代码通常伴随EntryPoint提供的附加代码，以提供额外指导。AAxx

| code | Description |
| - | - |
| AA1x | 错误代码与创建账户有关 |
| AA1x | 错误代码与创建账户有关 |
| AA2x | 错误代码与用户操作有关sender |
| AA3x | 错误代码与付款人有关 |
| AA4x | 错误代码通常与验证有关 |
| AA5x | 错误与用户操作执行后的操作有关 |

详细报错，可参考：
- https://docs.alchemy.com/reference/entrypoint-revert-codes
- https://docs.stackup.sh/docs/entrypoint-errors


