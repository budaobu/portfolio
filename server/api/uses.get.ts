export default defineEventHandler((event) => {
  // 设置缓存，1小时内无需重复计算
  setResponseHeader(event, 'Cache-Control', 'public, max-age=3600, s-maxage=3600')
  
  // 1. 获取查询参数
  const query = getQuery(event)
  const page = Math.max(1, Number(query.page) || 1)
  const limit = Math.max(1, Number(query.limit) || 9) // 默认每页 9 个

  // 2. 优化：不再需要排序，直接使用有序的 uses
  // const sortedUses = [...uses].sort((a, b) => b.id - a.id) <--- 删除这行

  // 3. 计算切片位置
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit

  // 4. 切片数据
  // 直接对 uses 进行切片
  const paginatedItems = uses.slice(startIndex, endIndex)

  // 5. 返回包含元数据的结构
  return {
    items: paginatedItems,
    hasMore: endIndex < uses.length,
    total: uses.length
  }
})