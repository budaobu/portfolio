import { defineContentConfig, defineCollection, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    blog: defineCollection({
      type: 'page',
      source: 'blog/*.md', // 扫描 content/blog 目录
      schema: z.object({
        title: z.string(),
        date: z.string(),
        description: z.string(),
        category: z.string(),
        // 允许可选字段
        cover: z.string().optional(),
        image: z.string().optional() 
      })
    })
  }
})