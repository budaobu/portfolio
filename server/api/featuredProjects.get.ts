export default defineEventHandler((event) => {
  // 设置缓存
  setResponseHeader(event, 'Cache-Control', 'public, max-age=3600, s-maxage=3600')
  
  // 优化后：projects 已经是有序的了
  // 1. 过滤出 featured 为 true 的项目
  // 2. 限制最多显示 6 个
  // 3. 数据加工
  return projects
    .filter(p => p.featured === true)
    // .sort((a, b) => b.id - a.id) // <--- 这行已不再需要
    .slice(0, 6)
    .map(processProject)
})