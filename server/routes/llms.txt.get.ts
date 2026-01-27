import { projects } from '../utils/projectData'
import { uses } from '../utils/usesData'

export default defineEventHandler(async (event) => {
  // 1. 设置响应头
  // 允许客户端缓存 1 小时，CDN 缓存 1 小时
  setResponseHeader(event, 'Content-Type', 'text/plain; charset=utf-8')
  setResponseHeader(event, 'Cache-Control', 'public, max-age=3600, s-maxage=3600')

  // 2. 获取基础配置
  const config = useRuntimeConfig()
  // 确保移除末尾斜杠
  const siteUrl = config.public.siteUrl?.replace(/\/$/, '')

  // 3. 获取博客文章 (复用 Content Collection)
  // 获取最近的 10 篇文章
  const articles = await queryCollection(event, 'blog')
    .order('date', 'DESC')
    .limit(10)
    .all()

  // 4. 构建内容块

  // --- Header ---
  const header = `# Budaobu Portfolio
> Non-dev, just vibe coding to stitch stuff together.
> Website: ${siteUrl}
> Author: Budaobu

I am a creator who stitches code together using AI prompt engineering and intuition. This is my personal playground.`

  // --- Projects Section ---
  const projectsSection = `## Featured Projects
Here are some of the tools and applications I've stitched together:

${projects
    .filter(p => p.featured)
    .map(p => {
      // 优先展示 Demo URL，其次 Github，最后是 path
      const link = p.demoUrl?.startsWith('http') ? p.demoUrl : (p.demoUrl ? `${siteUrl}${p.demoUrl}` : p.githubUrl)
      return `- **${p.title}**: ${p.description} (${link})`
    }).join('\n')}`

  // --- Blog Section ---
  const validArticles = articles.filter(post => 
    !post.path.toLowerCase().includes('example') && 
    post.title.toLowerCase() !== 'example'
  )

  const blogSection = `## Recent Articles
Thoughts and ramblings (No tech involved):

${validArticles.map(a => `- **${a.title}**: ${a.description} (${siteUrl}${a.path})`).join('\n')}`

  // --- Uses Section ---
  // 挑选一部分 Uses 展示，避免太长
  const usesSection = `## Uses / Gear
Tools and services I pay for and recommend:

${uses.slice(0, 10).map(u => `- **${u.name}** (${u.category}): ${u.description}`).join('\n')}`

  // --- Footer ---
  const footer = `## Connect
- **Project Repository**: https://github.com/budaobu/portfolio
- **Contact**: ${siteUrl}/connect
- **RSS**: ${siteUrl}/rss.xml`

  // 5. 组合并返回
  return [header, projectsSection, blogSection, usesSection, footer].join('\n\n')
})