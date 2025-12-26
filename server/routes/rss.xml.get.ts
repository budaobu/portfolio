export default defineEventHandler(async (event) => {
  // 设置网站的基础 URL
  const config = useRuntimeConfig()
  // 确保 siteUrl 不以 / 结尾，方便后续拼接
  let siteUrl = (config.public?.siteUrl as string) || 'https://portfolio-2d2.pages.dev'
  if (siteUrl.endsWith('/')) {
    siteUrl = siteUrl.slice(0, -1)
  }

  // 1. 获取博客文章 (Content v3)
  // 使用 queryCollection 获取 'blog' 集合的所有文章
  const blogPosts = await queryCollection(event, 'blog')
    .order('date', 'DESC')
    .all()

  // 2. 过滤掉 Example.md 并格式化为统一结构
  const formattedPosts = blogPosts
    .filter(post => !post.path.includes('Example') && post.title !== 'Example')
    .map(post => ({
      title: post.title,
      link: `${siteUrl}${post.path}`,
      description: post.description,
      pubDate: new Date(post.date).toUTCString(),
      guid: `${siteUrl}${post.path}`
    }))

  // 3. 格式化项目数据
  // 注意：这里直接使用全局的 projects 变量，Nitro 会自动从 server/utils/projectData.ts 导入
  const formattedProjects = projects
    // 过滤掉 featured 为 false 的项目 (可选，或者包含所有项目)
    .map(project => {
      // 优先使用 demo 链接，其次是 github 链接，最后回退到首页
      let link = project.demoUrl || project.githubUrl || siteUrl
      
      // 修复：如果是相对路径（以 / 开头），自动补全为绝对 URL
      if (link.startsWith('/')) {
        link = `${siteUrl}${link}`
      }

      const pubDate = project.date ? new Date(project.date).toUTCString() : new Date().toUTCString()
      
      // 确保 guid 也是绝对路径
      const guid = link

      return {
        title: `[Project] ${project.title}`, // 加个前缀区分
        link: link,
        description: `${project.icon} ${project.description}`,
        pubDate: pubDate,
        guid: guid
      }
    })

  // 4. 合并并按时间倒序排序
  const allItems = [...formattedPosts, ...formattedProjects].sort((a, b) => {
    return new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
  })

  // 5. 构建 RSS XML
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Budaobu Portfolio</title>
    <link>${siteUrl}</link>
    <description>Not a developer, just vibe code to stitch cool stuff together.</description>
    <language>zh-CN</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml" />
`

  allItems.forEach((item) => {
    xml += `    <item>
      <title><![CDATA[${item.title}]]></title>
      <link>${item.link}</link>
      <guid>${item.guid}</guid>
      <description><![CDATA[${item.description}]]></description>
      <pubDate>${item.pubDate}</pubDate>
    </item>
`
  })

  xml += `  </channel>
</rss>`

  // 设置正确的 Content-Type
  setResponseHeader(event, 'Content-Type', 'application/xml')
  
  return xml
})