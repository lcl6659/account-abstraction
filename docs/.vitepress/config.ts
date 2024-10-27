import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "UXLINK Account Abstraction",
  description: "UXLINK Account Abstraction, ERC-4337",
  lastUpdated: true,
  ignoreDeadLinks: true,
  lang: 'en-US',
  head: [
    ['link', { rel: 'icon', href: '/logo.png' }],
    ['link', { rel: 'stylesheet', href: '/custom.css' }],
    [
      'script',
      { async: '', src: '/_vercel/insights/script.js' }
    ],
    [
      'script',
      {},
      `window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };`
    ],
  ],
  base: "/",
  appearance: true,
  themeConfig: {
    logo: "/logo.png",
    logoLink: "/",
    // outline: {
    //   level: [2, 3],
    //   label: "本页导航",
    // },
    // lightModeSwitchTitle: "切换亮色模式",
    // darkModeSwitchTitle: "切换暗色模式",
    // returnToTopLabel: "返回顶部",
    // langMenuLabel: "菜单",
    // lastUpdated: {
    //   text: '最后更新时间：',
    //   formatOptions: {
    //     dateStyle: 'full',
    //     timeStyle: 'medium'
    //   }
    // },
    // search: {
    //   provider: 'local',
    //   options: {
    //     translations: {
    //       button: {
    //         buttonText: '搜索文档',
    //         buttonAriaLabel: '搜索文档',
    //       },
    //       modal: {
    //         noResultsText: '无法找到结果',
    //         resetButtonTitle: '清除查询条件',
    //         displayDetails: '显示列表详情',
    //         footer: {
    //           selectText: '选择',
    //           navigateText: '切换',
    //           closeText: '关闭',
    //         },
    //       },
    //     },
    //   }
    // },
    nav: [
      { text: 'Home', link: '/' },
      // { text: 'docs', link: '/docs/', activeMatch: '/docs/' },
      // { text: 'Cookdocs', link: '/cookdocs/', activeMatch: '/cookdocs/' },
      // { text: '参考', link: '/reference/', activeMatch: '/reference/' },
    ],

    sidebar: {
      '/docs/': [
        {
          text: 'Overview',
          link: '/docs/',
        },
        {
          text: 'UXLINK AA Wallet',
          link: '/docs/UXLINK/introduction',
          collapsed: false,
          items: [
            { text: 'Introduction', link: '/docs/UXLINK/introduction.md' },
            { text: 'UXWallet', link: '/docs/UXLINK/UXWallet.md' },
            { text: 'AA Wallet', link: '/docs/UXLINK/AAWallet.md' },
            { text: 'Paymaster', link: '/docs/UXLINK/paymaster.md' },
            { text: 'Cross-Chain', link: '/docs/UXLINK/crossChain.md' },
          ]
        },
        {
          text: 'ERC-4337 Guides',
          link: '/docs/account-abstraction/introduction',
          collapsed: false,
          items: [
            { text: 'Introduction', link: '/docs/account-abstraction/introduction.md' },
            { text: 'UserOperations', link: '/docs/account-abstraction/userOperations.md' },
            { text: 'Bundler', link: '/docs/account-abstraction/bundler.md' },
            { text: 'EntryPoint', link: '/docs/account-abstraction/entryPoint.md' },
            // { text: 'Account Contract', link: '/docs/account-abstraction/account-contract.md' },
            // { text: 'Paymaster', link: '/docs/account-abstraction/paymaster.md' },
          ]
        },
      ],
    },

    

    // socialLinks: [
    //   { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    // ],
    // docFooter: {
    //   prev: '上一页',
    //   next: '下一页'
    // }
  }
})
