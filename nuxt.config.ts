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
    '@nuxtjs/mdc',
    '@nuxt/image',
    '@nuxtjs/seo',
    '@nuxthub/core',
    '@vite-pwa/nuxt'
  ],

  css: ['~/assets/css/main.css'],

  // 1. 关键配置：指定 Cloudflare Pages preset 以支持后端 API
  nitro: {
    preset: 'cloudflare-pages',
    prerender: {
      crawlLinks: true,
      // 明确告诉预渲染器忽略动态路由，防止生成 404 或空文件
      ignore: ['/connect', '/__nuxt_content', (path) => path.startsWith('/__nuxt_content')],
      routes: ['/', '/sitemap.xml', '/rss.xml', '/llms.txt']
    }
  },

  linkChecker: {
    enabled: false
  },

  site: {
    url: process.env.NUXT_PUBLIC_SITE_URL || 'https://portfolio-2d2.pages.dev',
    name: 'Budaobu Portfolio',
    author: 'Budaobu',
    description: 'Non-dev, just vibe coding to stitch stuff together.'
  },

  runtimeConfig: {
    resendApiKey: '', 
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://portfolio-2d2.pages.dev',
      siteName: 'Budaobu Portfolio',
      siteAuthor: 'Budaobu',
      siteDescription: 'Non-dev, just vibe coding to stitch stuff together.'
    }
  },

  hooks: {
    async 'nitro:config'(nitroConfig) {
      const contentDir = resolve(process.cwd(), 'content/blog')
      
      if (!existsSync(contentDir)) return
      
      const files = readdirSync(contentDir)
      const blogRoutes = files
        .filter(file => file.endsWith('.md'))
        .filter(file => !['Example.md', 'example.md'].includes(file))
        .map(file => {
          // 移除 .md 后缀
          const slug = file.replace(/\.md$/, '')
          // 关键：对可能存在的中文或特殊字符文件名进行 URL 编码
          // 即使建议使用英文文件名，这层保护也能防止部署崩溃
          return `/blog/${encodeURI(slug)}`
        })
      
      nitroConfig.prerender = nitroConfig.prerender || {}
      nitroConfig.prerender.routes = nitroConfig.prerender.routes || []
      nitroConfig.prerender.routes.push(...blogRoutes)
      
      console.log('📝 Prerendering', blogRoutes.length, 'blog articles')
    }
  },

  sitemap: {
    exclude: ['/admin/**', '/blog/Example', '/blog/example', '/__nuxt_content/**'],
    urls: ['/', '/projects', '/blog', '/uses', '/sponsor'],
    sources: ['/api/sitemap_routes']
  },

  routeRules: {
    '/': { prerender: true },
    '/sponsor': { prerender: true },
    '/uses': { prerender: true },
    '/projects/**': { prerender: true },
    '/blog/**': { prerender: true },
    '/blog/Example': { prerender: false },
    '/connect': { ssr: true, prerender: false, ogImage: false }, 
    '/rss.xml': { prerender: true },
    '/llms.txt': { prerender: true, headers: { 'content-type': 'text/plain; charset=utf-8' } },
    '/__nuxt_content/**': { prerender: false }
  },

  ogImage: { prerender: true },

  /* fonts: {
    families: [{ name: 'LXGW WenKai Screen', provider: 'none' }]
  }, */

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
      htmlAttrs: { lang: 'en-US' },
      title: 'Budaobu',
      templateParams: { separator: '·' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Non-dev, just vibe coding to stitch stuff together.' },
        { name: 'author', content: 'Budaobu' },
        { name: 'robots', content: 'index, follow' },
        { property: 'og:site_name', content: 'Budaobu Portfolio' },
        { property: 'og:type', content: 'website' },
        { name: 'theme-color', content: '#FAF9F6' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' }
      ],
      link: [
        { rel: 'icon', type: 'image/webp', href: '/avatar.webp' },
        { rel: 'apple-touch-icon', href: '/avatar.webp' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&display=swap' },
        { rel: 'alternate', type: 'application/rss+xml', title: 'Budaobu RSS Feed', href: '/rss.xml' },
        { rel: 'help', href: '/llms.txt', title: 'LLM Context' }
      ]
    }
  },
  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'Budaobu Portfolio',
      short_name: 'Budaobu',
      description: 'Non-dev, just vibe coding to stitch stuff together.',
      theme_color: '#ffffff',
      background_color: '#ffffff',
      display: 'standalone',
      orientation: 'portrait',
      lang: 'en-US',
      start_url: '/',
      icons: [
        {
          src: '/pwa-192x192.webp',
          sizes: '192x192',
          type: 'image/webp'
        },
        {
          src: '/pwa-512x512.webp',
          sizes: '512x512',
          type: 'image/webp'
        },
        {
          src: '/pwa-512x512.webp',
          sizes: '512x512',
          type: 'image/webp',
          purpose: 'any maskable'
        }
      ]
    },
    workbox: {
      navigateFallbackDenylist: [
      /^\/api\/.*/,        // 排除所有 API 端点
      /^\/go\/.*/,         // 排除短链接重定向
      /^\/__nuxt_content.*/, // 排除内容查询
      /^\/rss\.xml/,       // 排除 RSS
      /^\/llms\.txt/,      // 排除 LLM 上下文
      /^\/sitemap\.xml/    // 排除站点地图
    ],
      globPatterns: ['**/*.{js,css,html,png,svg,ico,webp,woff2}'],
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/cdn\.jsdelivr\.net\/.*/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'cdn-fonts-cache',
            expiration: {
              maxEntries: 10,
              maxAgeSeconds: 60 * 60 * 24 * 365 // 1年
            },
            cacheableResponse: {
              statuses: [0, 200]
            }
          }
        },
        {
          urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'google-fonts-cache',
            expiration: {
              maxEntries: 10,
              maxAgeSeconds: 60 * 60 * 24 * 365
            }
          }
        },
        {
          urlPattern: /^https:\/\/(github\.com|avatars\.githubusercontent\.com)\/.*/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'external-images-cache',
            expiration: {
              maxEntries: 20,
              maxAgeSeconds: 60 * 60 * 24 * 7 // 7天
            }
          }
        }
      ]
    },
    client: {
      installPrompt: true,
    },
    devOptions: {
      enabled: true,
      suppressWarnings: true,
      navigateFallback: '/',
      type: 'module',
    },
  }
})