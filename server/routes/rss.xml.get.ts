// 移除 import 语句
// import { projects } from '~/server/utils/projectData' <--- 删除这行

export default defineEventHandler((event) => {
  // 设置网站的基础 URL
  const config = useRuntimeConfig()
  const siteUrl = (config.public?.siteUrl as string) || 'https://budaobu.pages.dev'

  // 构建 RSS XML
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Budaobu Portfolio - 作品更新</title>
    <link>${siteUrl}</link>
    <description>Budaobu 的个人作品集更新与发布。</description>
    <language>zh-CN</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml" />
`

  // 直接遍历 projects (Nitro 自动导入)
  projects.forEach((project) => {
    // 优先使用 demo 链接，其次是 github 链接，最后回退到首页
    const link = project.demoUrl || project.githubUrl || siteUrl
    const pubDate = project.date ? new Date(project.date).toUTCString() : new Date().toUTCString()

    xml += `    <item>
      <title><![CDATA[${project.title}]]></title>
      <link>${link}</link>
      <guid>${link}</guid>
      <description><![CDATA[${project.icon} ${project.description}]]></description>
      <pubDate>${pubDate}</pubDate>
    </item>
`
  })

  xml += `  </channel>
</rss>`

  // 设置正确的 Content-Type
  setResponseHeader(event, 'Content-Type', 'application/xml')
  
  return xml
})