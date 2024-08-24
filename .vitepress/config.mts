import { defineConfig } from 'vitepress'
import { set_sidebar } from './utils/auto_sidebar.mjs'

export default defineConfig({
  base: '/hub-boke-vue/',
  head: [["link", { rel: "icon", href: "/logo.png" }]],
  title: "熊猫侠阿宝",
  description: "个人编程博客",
  themeConfig: {
    outlineTitle: "目录",
    outline: [2, 6],
    logo: '/logo.png',
    nav: [
      { text: '首页', link: '/' },
    ],
    docFooter: {
      prev: '上一页',
      next: '下一页'
    },
    sidebarMenuLabel: '菜单',
    darkModeSwitchLabel: '夜间模式',
    returnToTopLabel: '返回第一段',
    lightModeSwitchTitle: '切换日间模式',
    darkModeSwitchTitle: '切换夜间模式',
    externalLinkIcon: true,

    sidebar: {
      "/boke/vue": set_sidebar("/boke/vue"),
      "/boke/java": set_sidebar("/boke/java"),
      "/boke/php": set_sidebar("/boke/php"),
      "/boke/c++": set_sidebar("/boke/c++"),
      "/boke/mid": set_sidebar("/boke/mid"),
      "/boke/tools": set_sidebar("/boke/tools"),
      "/boke/project": set_sidebar("/boke/project"),
      "/boke/video": set_sidebar("/boke/video"),
    },

    // 设置搜索框的样式
    search: {
      provider: "local",
      options: {
        translations: {
          button: {
            buttonText: "搜索文档",
            buttonAriaLabel: "搜索文档",
          },
          modal: {
            noResultsText: "无法找到相关结果",
            resetButtonTitle: "清除查询条件",
            footer: {
              selectText: "选择",
              navigateText: "切换",
            },
          },
        },
      },
    },

    socialLinks: [
      {
        icon: { svg: '<svg t="1713519449769" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4421" width="128" height="128"><path d="M512 1024C229.2224 1024 0 794.7776 0 512S229.2224 0 512 0s512 229.2224 512 512-229.2224 512-512 512z m259.1488-568.8832H480.4096a25.2928 25.2928 0 0 0-25.2928 25.2928l-0.0256 63.2064c0 13.952 11.3152 25.2928 25.2672 25.2928h177.024c13.9776 0 25.2928 11.3152 25.2928 25.2672v12.6464a75.8528 75.8528 0 0 1-75.8528 75.8528H366.592a25.2928 25.2928 0 0 1-25.2672-25.2928v-240.1792a75.8528 75.8528 0 0 1 75.8272-75.8528h353.9456a25.2928 25.2928 0 0 0 25.2672-25.2928l0.0768-63.2064a25.2928 25.2928 0 0 0-25.2672-25.2928H417.152a189.6192 189.6192 0 0 0-189.6192 189.6448v353.9456c0 13.9776 11.3152 25.2928 25.2928 25.2928h372.9408a170.6496 170.6496 0 0 0 170.6496-170.6496v-145.408a25.2928 25.2928 0 0 0-25.2928-25.2672z" fill="#C71D23" p-id="4422"></path></svg>' },
        link: 'https://gitee.com/overrideHub'
      }
    ],

    footer: {
      message: '<a href="https://beian.miit.gov.cn/">湘ICP备2024058114号-1</a>',
      copyright: "Copyright @ 2024-present Hub"
    }
  }
})
