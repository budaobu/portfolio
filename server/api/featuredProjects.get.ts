export default defineEventHandler((event) => {
  // 设置缓存
  setResponseHeader(event, 'Cache-Control', 'public, max-age=3600, s-maxage=3600')
  
  // 1. 获取所有项目 (Nitro 自动导入 server/utils/projectData.ts)
  // 2. 过滤出 featured 为 true 的项目
  // 3. 按照 ID 降序排序 (b.id - a.id)，确保是 ID 最大的
  // 4. 限制最多显示 6 个 (.slice(0, 6))
  // 5. 使用 processProject 进行数据加工
  return projects
    .filter(p => p.featured === true)
    .sort((a, b) => b.id - a.id)
    .slice(0, 6)
    .map(processProject)
})