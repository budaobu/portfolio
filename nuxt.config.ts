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
  
  compatibilityDate: '2025-12-26',

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
    // 排除不需要收录的页面
    exclude: [
      '/admin/**',
      '/blog/Example', // 显式排除 Example 路由
      '/blog/example'  // 以防万一大小写问题
    ],
    // 动态源：告诉 Sitemap 模块去哪里获取动态生成的博客路由
    sources: [
      '/api/sitemap_routes'
    ]
  },

  routeRules: {
    '/': { prerender: true },
    '/sponsor': { prerender: true },
    '/goods': { prerender: true },
    '/projects': { prerender: true }, // 确保项目列表页也被预渲染
    '/blog/**': { prerender: true },
    // 显式禁止预渲染 Example，防止生成静态文件
    '/blog/Example': { prerender: false },
    // --- 新增工具页面的预渲染配置 ---
    '/tinypic': { prerender: true },
    '/meme-slicer': { prerender: true },
    '/video2gif': { prerender: true },
    '/image-watermark': { prerender: true }
  },

  ogImage: {
    prerender: true,
    fonts: [
      'Noto Sans SC:400', 
      'Noto Sans SC:700'
    ]
  },

  // 配置 @nuxt/fonts 模块 (由 @nuxt/ui 引入)
  fonts: {
    // 禁用 google 字体提供商，防止它去请求 fonts.google.com
    /* providers: {
      google: false
    }, */
    // 显式告诉它霞鹜文楷不需要它管理 (虽然禁用 provider 已经足够，加这个更保险)
    families: [
      { name: 'LXGW WenKai Screen', provider: 'none' }
    ]
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
        { name: 'description', content: 'Budaobu\'s AI-Stitched Personal Homepage | Portfolio' },
        { name: 'author', content: 'Budaobu' },
        { name: 'robots', content: 'index, follow' },
        { property: 'og:site_name', content: 'Budaobu Portfolio' },
        { property: 'og:type', content: 'website' }
      ],
      link: [
        { rel: 'icon', type: 'image/webp', href: '/avatar.webp' }, // 使用本地图片替换动态获取 /api/avatar.png
        { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/lxgw-wenkai-screen-webfont@1.7.0/style.min.css' },
        // 自动发现 RSS
        { rel: 'alternate', type: 'application/rss+xml', title: 'Budaobu RSS Feed', href: '/rss.xml' }
      ]
    }
  }
})