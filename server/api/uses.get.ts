export default defineEventHandler((event) => {
  // 设置缓存，1小时内无需重复计算
  setResponseHeader(event, 'Cache-Control', 'public, max-age=3600, s-maxage=3600')
  
  // 1. 获取查询参数
  const query = getQuery(event)
  const page = Math.max(1, Number(query.page) || 1)
  const limit = Math.max(1, Number(query.limit) || 9) // 默认每页 9 个

  // 2. 按照 ID 降序排列 (可选，通常新物品排前面)
  const sortedUses = [...uses].sort((a, b) => b.id - a.id)

  // 3. 计算切片位置
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit

  // 4. 切片数据
  const paginatedItems = sortedUses.slice(startIndex, endIndex)

  // 5. 返回包含元数据的结构
  return {
    items: paginatedItems,
    hasMore: endIndex < sortedUses.length,
    total: sortedUses.length
  }
})