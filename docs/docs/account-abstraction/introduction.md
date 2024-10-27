# Introduction

## 1、背景介绍
Ethereum 中有两种帐户
- `CA（Contract Accounts）`：合约账户是部署到网络中的智能合约，可以自定义账户的执行逻辑，比如多签、批量交易等等。
- `EOA（Externally Owned Account）帐户`：使用MetaMask生成的账户就是EOA账户，使用 MPC 生成的也是 EOA。

这看似用户有两种选择，但实际上，普通用户只有一种选择，因为合约账户想要与其他合约交互，必须由一个EOA账户调用，也就是说，合约账户并没有独立发起交易的能力。

![EOA_transition](/images/eoa.webp)

## 2、EOA的限制
EOA账户有着很多的限制：
1. 助记词/私钥：这个是创建EOA账户的生成的，需要由用户自行保管，丢失就等于失去了账户里的资产，无法找回。
2. EOA账户无法定义执行逻辑（比如设置黑名单、交易限额等），缺乏灵活性，无法充分满足用户的多样化需求。
3. 用户只能使用 ETH 支付gas费，而无法使用其他ERC-20的代币。
4. 使用起来也很不方法，每次交易都要用户签名，这让交易的流程很不顺畅。
4. 不支持原生的多签钱包，要透过智能合约去实现。

## 3、需要有更好的钱包
就是因为EOA账户，有着以上的诸多限制，于是大家就想，是否可以一种账户，可以拥有这些功能呢？
1. 不要助记词，账户可以通过一些方法进行恢复（如比使用社交账号找回）。
2. 可以使用其他ERC-20的代币，支付gas费。
3. 可自定义账户的执行逻辑。

等等...

## 4、ERC-4337
协议地址：https://eips.ethereum.org/EIPS/eip-4337

为了解决EOA钱包的诸多问题，以太坊社区长期以来一直在研究实现账户抽象的方式。
- 2021年，由以太坊联合创始人Vitalik Buterin和其他开发人员提出`ERC-4337`。
- 2023年3月，ERC-4337部署到以太坊主网。

![ERC-4337](/images/erc-4337.webp)

以太坊账户抽象旨在将协议现有两类账户（即外部拥有账户(EOA)和智能合约账户）的功能合二为一。最终要实现的目标是单一合约账户与代币交易并同时创建合约。这一变化使创新型钱包设计成为可能，如社交恢复、定制执行逻辑和可升级性等。

换个角度看，ERC-4337为单一账户中的钱包带来了智能合约功能。这样一来，多重身份验证和自动支付等服务将更易于设置。


### 4.1、ERC-4337 实现  Account Abstraction 的基本原理
在ERC-4337之前，社区提出过另一个旨在实现账户抽象的提案，称为“EIP-2938”。EIP-2938与ERC-4337类似，但需要更改共识层，ERC-4337则规避了这一点。

ERC-4337通过引入称为“`UserOperation`”的更高层伪交易对象来实现账户抽象，用户将`UserOperation`对象发送到单独的内存池（`User Operation mempool`）中，然后`Bundler`将一些UserOperation打包一笔交易发到链上。

![ERC-4337](/images/4337-flow.png)

### 4.2 ERC-4337 有以下几个重要组成部分

1. `User Operations`：描述了用户的操作等信息。它由 App 创建并提交给 Bundler。
2. `Bundler`：接收用户提交的 User Operation，把它放到 User Operation Mempool 中；监控 User Operation Mempool 中内容，把 User Operation 打包上链。
3. `EntryPoint` 合约：User Operation 的入口合约， 用于验证User Operation的合法性等功能。EntryPoint 不需要开发者实现，目前社区已经部署上线了
    - EntryPoint 0.6版本地址：0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789
    - EntryPoint 0.7版本地址：0x0000000071727De22E5E9d8BAf0edAc6f37da032
4. `Account` 合约：实现 validateUserOp （EntryPoint 合约的 handleOps 方法会调用它）来校验 User Operation 的合法性。Account 合约是 AccountFactory 合约通过 create2 创建
5. `Paymaster` 合约：实现使用其它代币支付 Gas 等功能。
6. `Aggregator` 合约：实现签名聚合。

![ERC-4337](/images/4337component.webp)

### 4.3 实现 ERC-4337 的合约
合约地址： https://github.com/eth-infinitism/account-abstraction

该合约是由 Ethereum Foundation 支持的开源项目，当前主要有0.6和0.7两个版本。
- `0.6版本`： https://github.com/eth-infinitism/account-abstraction/blob/v0.6.0/eip/EIPS/eip-4337.md
- `0.7版本`：https://github.com/eth-infinitism/account-abstraction/blob/v0.7.0/erc/ERCS/erc-4337.md

