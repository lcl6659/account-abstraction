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
    nav: [
      { text: 'Home', link: '/', activeMatch: '/' },
    ],

    sidebar: {
      '/docs/': [
        {
          text: 'Overview',
          link: '/docs/',
        },
        {
          text: 'UXLINK AA Wallet',
          link: '/docs/UXLINK/introduction.md',
          collapsed: false,
          items: [
            { text: 'AA Wallet', link: '/docs/UXLINK/AAWallet.md' },
            { text: 'Paymaster', link: '/docs/UXLINK/paymaster.md' },
            { text: 'Cross-Chain', link: '/docs/UXLINK/crossChain.md' },
          ]
        },
        // {
        //   text: 'ERC-4337 Guides',
        //   link: '/docs/account-abstraction/introduction',
        //   collapsed: false,
        //   items: [
        //     { text: 'Introduction', link: '/docs/account-abstraction/introduction.md' },
        //     { text: 'UserOperations', link: '/docs/account-abstraction/userOperations.md' },
        //     { text: 'Bundler', link: '/docs/account-abstraction/bundler.md' },
        //     { text: 'EntryPoint', link: '/docs/account-abstraction/entryPoint.md' },
        //   ]
        // },
      ],
    },
    // socialLinks: [
    //   { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    // ],
  }
})
