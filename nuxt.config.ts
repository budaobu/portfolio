// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/ui',
    '@nuxtjs/sitemap',
    'nuxt-og-image'
  ],
  
  css: ['~/assets/css/main.css'],
  
  devtools: { enabled: true },
  
  compatibilityDate: '2024-11-29',

  nitro: {
    preset: 'cloudflare-pages'
  },

  site: {
    url: 'https://portfolio-2d2.pages.dev/',
    name: 'Budaobu Portfolio'
  },

  runtimeConfig: {
    public: {
      siteUrl: 'https://portfolio-2d2.pages.dev/'
    }
  },

  sitemap: {
    exclude: ['/admin/**'],
  },

  // --- 新增配置开始 ---
  // 1. 强制在构建阶段预渲染首页和 OG 图片
  // 这样 Cloudflare 只需要返回静态文件，不需要消耗 CPU 计算，完美解决 1102 错误
  routeRules: {
    '/': { prerender: true },
    '/sponsor': { prerender: true }
  },

  // 2. 确保 OG Image 模块开启预渲染
  ogImage: {
    prerender: true
  },
  // --- 新增配置结束 ---

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
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/api/avatar.png' }
      ]
    }
  }
})