// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/ui',
    '@nuxtjs/sitemap',
    'nuxt-og-image',
    '@nuxt/content' // 新增 Content 模块
  ],
  
  css: ['~/assets/css/main.css'],
  
  devtools: { enabled: true },
  
  compatibilityDate: '2024-11-29',

  // ⚠️ 删除或注释掉这一行！
  // nitro: {
  //   preset: 'cloudflare-pages'
  // },
  // 如果你非常想保留，必须加判断，只在生产环境启用：
  // nitro: {
  //   preset: process.env.NODE_ENV === 'production' ? 'cloudflare-pages' : undefined
  // },

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

  routeRules: {
    '/': { prerender: true },
    '/sponsor': { prerender: true },
    '/goods': { prerender: true }, // 新增：预渲染好物推荐页面
    '/blog/**': { prerender: true } // 预渲染所有博客页面
  },

  ogImage: {
    prerender: true
  },

  // --- 新增 Content 配置 ---
  content: {
    highlight: {
      // 使用 Shiki 高亮，主题自动适配暗黑模式
      theme: {
        default: 'github-light',
        dark: 'github-dark'
      },
      preload: ['javascript', 'typescript', 'vue', 'bash', 'json', 'python', 'css', 'html']
    },
    // 启用 MDC (Markdown Components) 语法，用于支持 ::ImageGallery 这种写法
    markdown: {
      mdc: true
    }
  },

  app: {
    head: {
      htmlAttrs: {
        lang: 'zh-CN'
      },
      title: 'Budaobu',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Budaobu 的个人作品集 - vibe 开发者，分享有趣的项目和 AI 探索。' },
        { name: 'author', content: 'Budaobu' },
        { name: 'robots', content: 'index, follow' },
        { property: 'og:site_name', content: 'Budaobu Portfolio' },
        { property: 'og:type', content: 'website' }
      ],
      link: [
        { rel: 'icon', type: 'image/webp', href: '/avatar.webp' }, // 使用本地图片替换动态获取 /api/avatar.png
        { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/lxgw-wenkai-screen-webfont@1.7.0/style.min.css' }
      ]
    }
  }
})