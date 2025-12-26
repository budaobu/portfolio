export default defineEventHandler(async (event) => {
  // 获取 'blog' 集合中的所有页面
  const posts = await queryCollection(event, 'blog').all()

  // 过滤掉 Example 并映射为 Sitemap 所需的格式
  return posts
    .filter(post => !post.path.includes('Example') && post.title !== 'Example')
    .map(post => {
      return {
        loc: post.path, // 页面路径，例如 /blog/my-first-post
        lastmod: new Date(post.date).toISOString() // 最后修改时间
      }
    })
})