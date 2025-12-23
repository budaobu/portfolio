export default defineEventHandler((event) => {
  // 设置缓存
  setResponseHeader(event, 'Cache-Control', 'public, max-age=3600, s-maxage=3600')

  // 1. 获取查询参数
  const query = getQuery(event)
  const page = Math.max(1, Number(query.page) || 1) // 默认为第 1 页
  const limit = Math.max(1, Number(query.limit) || 9) // 默认为 9 条

  // 2. 计算切片位置
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit

  // 3. 切片并处理数据
  // Nitro 自动导入 server/utils/projectData.ts 中的 projects
  // Nitro 自动导入 server/utils/projectProcess.ts 中的 processProject
  const paginatedItems = projects.slice(startIndex, endIndex).map(processProject)

  // 4. 返回包含元数据的结构
  return {
    items: paginatedItems,
    hasMore: endIndex < projects.length,
    total: projects.length
  }
})