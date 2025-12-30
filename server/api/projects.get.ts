export default defineEventHandler((event) => {
  // 设置缓存
  setResponseHeader(event, 'Cache-Control', 'public, max-age=3600, s-maxage=3600')

  // 1. 获取查询参数
  const query = getQuery(event)
  const page = Math.max(1, Number(query.page) || 1)
  const limit = Math.max(1, Number(query.limit) || 9)

  // 2. 计算切片位置
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit

  // 3. 切片并处理数据
  // 此时 projects 已经是有序的，slice(0, 9) 拿到的就是 ID 最大的前 9 个
  const paginatedItems = projects.slice(startIndex, endIndex).map(processProject)

  // 4. 返回包含元数据的结构
  return {
    items: paginatedItems,
    hasMore: endIndex < projects.length,
    total: projects.length
  }
})