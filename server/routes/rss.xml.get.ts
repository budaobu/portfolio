export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const siteUrl = config.public.siteUrl?.replace(/\/$/, '')

  const posts = await queryCollection(event, 'blog')
    .order('date', 'DESC')
    .all()

  const validPosts = posts.filter(post => 
    !post.path.toLowerCase().includes('example') && 
    post.title.toLowerCase() !== 'example'
  )

  const latestDate = validPosts[0]?.date || new Date().toISOString()
  const etag = `"rss-${new Date(latestDate).getTime()}"`
  
  const clientEtag = getRequestHeader(event, 'if-none-match')
  if (clientEtag === etag) {
    setResponseStatus(event, 304)
    return null
  }

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

  setResponseHeader(event, 'Content-Type', 'application/xml')
  setResponseHeader(event, 'ETag', etag)
  setResponseHeader(event, 'Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400')
  
  return rss
})