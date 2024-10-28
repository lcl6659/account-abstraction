# introduction
为了让用户更方便的创建`web3钱包`，`UXLINK`构建了自己的`Account Abstraction`，基于`AA 钱包`的基础功能，用户不仅可以使用`UXLINK token` 支付gas费，更是可以无缝的跨链交互，而无需费时、费力去swap、去购买ETH。

## 架构设计
1. 用户使用EOA钱包或者社交账号（twitter、telegram、line等）登录我们的DAPP后，系统会为用户创建一个MPC钱包，称之为 `UXWallet`。
2. 基于 `UXWallet`，`UXLINK`会为用户创建一个`AA 钱包`（创建智能合约账户）。
3. `UXLINK Paymater` 合约，让用户可以使用`UXLINK token`，支付交易过程中的`Gas费`。
4. 支持跨链，基于Unichain的技术支持，实现token和交易的跨链支持，让用户不必在各个链上浪费时间和精力，我们提供无感的跨链支持。


![UXLINK_AA2](../../public/images/UXLINK_AA2.png)