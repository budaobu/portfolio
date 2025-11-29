// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/ui',
    '@nuxtjs/sitemap',
    'nuxt-og-image' // <--- 必须添加这个模块，否则 defineOgImageComponent 无法识别
  ],
  
  css: ['~/assets/css/main.css'],
  
  devtools: { enabled: true },
  
  compatibilityDate: '2024-11-29',

  // 显式指定部署目标为 Cloudflare Pages
  // 这确保了服务端 API (server/api/*) 和动态路由能正常工作
  nitro: {
    preset: 'cloudflare-pages'
  },

  // 配置网站基础 URL，用于生成 Sitemap 和 RSS 的绝对路径
  // 请替换为您实际部署的域名
  site: {
    url: 'https://budaobu.pages.dev',
    name: 'Budaobu Portfolio'
  },

  // 暴露 siteUrl 给服务端 API 使用 (用于 RSS)
  runtimeConfig: {
    public: {
      siteUrl: 'https://budaobu.pages.dev'
    }
  },

  // Sitemap 模块配置
  sitemap: {
    exclude: ['/admin/**'],
  },

  app: {
    head: {
      htmlAttrs: {
        lang: 'zh-CN'
      },
      title: 'Budaobu',
      titleTemplate: '%s - Budaobu',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Budaobu 的个人作品集 - 全栈开发者，分享有趣的项目和技术探索。' },
        { name: 'author', content: 'Budaobu' },
        { name: 'robots', content: 'index, follow' },
        { property: 'og:site_name', content: 'Budaobu Portfolio' },
        { property: 'og:type', content: 'website' }
      ]
    }
  }
})