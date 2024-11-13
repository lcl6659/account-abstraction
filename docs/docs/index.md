# Overview
通过此文档，您将知道什么是Account Abstraction，以及如何基于ERC-4337实现Account Abstraction。

## 架构设计
1. 用户使用EOA钱包或者社交账号（twitter、telegram、line等）登录
2. 为用户创建一个`AA 钱包`（创建智能合约账户）。
3. `Paymater` 合约，让用户可以使用`ERC20 token`，支付交易过程中的`Gas费`。

![overview](../public/images/overview.png)
## 参考
- https://www.erc4337.io/docs
- https://eips.ethereum.org/EIPS/eip-4337#paymasters
- https://docs.stackup.sh/docs/erc-4337-guides
- https://docs.alchemy.com/docs/account-abstraction-overview
- https://github.com/eth-infinitism/account-abstraction



