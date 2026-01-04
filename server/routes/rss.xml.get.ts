export default defineEventHandler(async (event) => {
  // 1. 获取站点配置
  const config = useRuntimeConfig()
  const siteUrl = config.public.siteUrl?.replace(/\/$/, '') || 'https://portfolio-2d2.pages.dev'

  // 2. 获取文章列表 (按时间倒序)
  const posts = await queryCollection(event, 'blog')
    .order('date', 'DESC')
    .all()

  // 3. 过滤文章 (忽略大小写)
  const validPosts = posts.filter(post => 
    !post.path.toLowerCase().includes('example') && 
    post.title.toLowerCase() !== 'example'
  )

  // 4. 构建 RSS Item 字符串
  const items = validPosts.map((post) => {
    const link = `${siteUrl}${post.path}`
    return `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${link}</link>
      <guid>${link}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <description><![CDATA[${post.description || ''}]]></description>
    </item>`
  }).join('')

  // 5. 构建完整的 RSS XML 字符串
  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>Budaobu Portfolio</title>
  <link>${siteUrl}</link>
  <description>Non-dev, just vibe coding to stitch stuff together.</description>
  <language>zh-CN</language>
  <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
  <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml" />
  ${items}
</channel>
</rss>`

  // 6. 关键：设置 Content-Type 为 XML
  setResponseHeader(event, 'Content-Type', 'application/xml')
  
  // 7. 返回 XML 字符串
  return rss
})