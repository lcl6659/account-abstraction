import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Account Abstraction",
  description: "Account Abstraction, ERC-4337",
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
    logoLink: "/",
    nav: [
      { text: 'Home', link: '/', activeMatch: '/' },
    ],

    sidebar: {
      '/docs/': [
        // {
        //   text: 'Overview',
        //   link: '/docs/blog/aa-blog-en.md',
        // },
        // {
        //   text: 'UXLINK AA Wallet',
        //   link: '/docs/UXLINK/introduction.md',
        //   collapsed: false,
        //   items: [
        //     { text: 'AA Wallet', link: '/docs/UXLINK/AAWallet.md' },
        //     { text: 'Paymaster', link: '/docs/UXLINK/paymaster.md' },
        //     { text: 'Cross-Chain', link: '/docs/UXLINK/crossChain.md' },
        //   ]
        // },
        // {
        //   text: 'SDK',
        //   link: '/docs/SDK/quickStart',
        //   collapsed: false,
        //   items: [
        //     { text: 'quickStart', link: 'docs/SDK/quickStart.md' },
        //     { text: 'ingestionAPI', link: 'docs/SDK/ingestionAPI.md' },
        //   ]
        // },
        {
          text: 'ERC-4337 Guides',
          link: '/docs/account-abstraction/introduction.md',
          collapsed: false,
          items: [
            { text: 'Introduction', link: '/docs/account-abstraction/introduction.md' },
            { text: 'Account', link: '/docs/account-abstraction/account-contract.md' },
            { text: 'UserOperations', link: '/docs/account-abstraction/userOperations.md' },
            { text: 'Bundler', link: '/docs/account-abstraction/bundler.md' },
            { text: 'EntryPoint', link: '/docs/account-abstraction/entryPoint.md' },
            { text: 'Paymaster', link: '/docs/account-abstraction/paymaster.md' },
          ]
        },
        {
          text: 'Blog',
          link: '/docs/blog/UXLINK-Account-Demo.md',
          collapsed: false,
          items: [
            // { text: 'AA - EN', link: '/docs/blog/aa-blog-en.md' },
            // { text: 'AA - CN', link: '/docs/blog/aa-blog.md' },
            { text: 'UXLINK Account en', link: '/docs/blog/UXLINK-Account-Demo-en.md' },
            { text: 'UXLINK Account', link: '/docs/blog/UXLINK-Account-Demo.md' },
            { text: 'UXLINK Account CheckIn en', link: '/docs/blog/UXLINK-Account-Demo-CheckIn-en.md' },
            { text: 'UXLINK Account CheckIn', link: '/docs/blog/UXLINK-Account-Demo-CheckIn.md' },
            { text: 'UXLINK Account Cross Chian en', link: '/docs/blog/UXLINK-Account_Demo-CrossChian-en.md' },
            { text: 'UXLINK Account Cross Chian', link: '/docs/blog/UXLINK-Account_Demo-CrossChian.md' },
          ]
        },
      ],
    },
    // socialLinks: [
    //   { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    // ],
  }
})
