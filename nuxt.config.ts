import { resolve } from 'node:path'
import { readdirSync, existsSync } from 'node:fs'

export default defineNuxtConfig({
  compatibilityDate: '2025-12-26',
  
  devtools: { enabled: true },

  future: {
    compatibilityVersion: 4,
  },

  modules: [
    '@nuxt/ui',
    '@nuxt/content',
    '@nuxt/image',
    '@nuxtjs/seo', // 包含 sitemap, og-image 等
    '@nuxthub/core'
  ],

  css: ['~/assets/css/main.css'],

  // 1. 关键配置：指定 Cloudflare Pages preset 以支持后端 API
  // 必须保留此项，否则 API 路由不会生效
  nitro: {
    preset: 'cloudflare-pages',
    prerender: {
      crawlLinks: true,
      ignore: ['/connect'],
      routes: ['/', '/sitemap.xml', '/rss.xml']
    }
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

  // 用于扫描博客文章并添加到预渲染列表
  hooks: {
    async 'nitro:config'(nitroConfig) {
      const contentDir = resolve(process.cwd(), 'content/blog')
      
      if (!existsSync(contentDir)) {
        console.warn('⚠️  content/blog directory not found')
        return
      }
      
      const files = readdirSync(contentDir)
      const blogRoutes = files
        .filter(file => file.endsWith('.md'))
        .filter(file => file !== 'Example.md')
        .map(file => `/blog/${file.replace('.md', '')}`)
      
      nitroConfig.prerender = nitroConfig.prerender || {}
      nitroConfig.prerender.routes = nitroConfig.prerender.routes || []
      nitroConfig.prerender.routes.push(...blogRoutes)
      
      console.log('📝 Explicitly added', blogRoutes.length, 'blog routes')
      console.log('   Routes:', blogRoutes)
    }
  },

  sitemap: {
    exclude: [
      '/admin/**',
      '/blog/Example',
      '/blog/example'
    ],
    urls: [
      '/',
      '/projects',
      '/blog',
      '/uses',
      '/sponsor'
    ],
    sources: [
      '/api/sitemap_routes'
    ]
  },

  routeRules: {
    '/': { prerender: true },
    '/sponsor': { prerender: true },
    '/uses': { prerender: true },
    '/projects/**': { prerender: true },
    '/blog/**': { prerender: true },
    '/blog/Example': { prerender: false },
    // Cloudflare Pages Function 需要 SSR 处理 API 请求，
    // 在 cloudflare-pages preset 下，此配置应能正常工作。
    '/connect': { ssr: true, prerender: false }, 
    '/rss.xml': { prerender: true }
  },

  ogImage: {
    prerender: true
  },

  fonts: {
    families: [
      { name: 'LXGW WenKai Screen', provider: 'none' }
    ]
  },

  content: {
    build: {
      markdown: {
        highlight: {
          theme: {
            default: 'github-light',
            dark: 'github-dark'
          },
          preload: ['ts', 'js', 'css', 'json', 'vue', 'bash', 'python', 'html']
        }
      }
    }
  },

  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    layoutTransition: { name: 'layout', mode: 'out-in' },
    head: {
      htmlAttrs: {
        lang: 'zh-CN'
      },
      title: 'Budaobu',
      templateParams: {
        separator: '·'
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Non-dev, just vibe coding to stitch stuff together.' },
        { name: 'author', content: 'Budaobu' },
        { name: 'robots', content: 'index, follow' },
        { property: 'og:site_name', content: 'Budaobu Portfolio' },
        { property: 'og:type', content: 'website' }
      ],
      link: [
        { rel: 'icon', type: 'image/webp', href: '/avatar.webp' },
        { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/lxgw-wenkai-screen-webfont@1.7.0/style.min.css' },
        { rel: 'alternate', type: 'application/rss+xml', title: 'Budaobu RSS Feed', href: '/rss.xml' }
      ]
    }
  }
})