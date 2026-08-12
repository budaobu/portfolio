import type { PaginatedResponse, Project } from '~/app/utils/types'

// 显式声明返回类型为 PaginatedResponse<Project>
export default defineEventHandler(async (event): Promise<PaginatedResponse<Project>> => {
  // 设置缓存
  setResponseHeader(event, 'Cache-Control', 'public, max-age=3600, s-maxage=3600')

  // 1. 获取查询参数
  const query = getQuery(event)
  const archivedOnly = query.archived === '1' || query.archived === 'true'

  // 已归档项目不进入主列表；archived=1 时仅返回归档项（不分页）
  if (archivedOnly) {
    const archivedItems = projects.filter(p => p.archived === true).map(processProject)
    return {
      items: archivedItems,
      hasMore: false,
      total: archivedItems.length
    }
  }

  const activeProjects = projects.filter(p => p.archived !== true)

  const page = Math.max(1, Number(query.page) || 1)
  const limit = Math.max(1, Number(query.limit) || 9)

  // 2. 计算切片位置
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit

  // 3. 切片并处理数据
  const paginatedItems = activeProjects.slice(startIndex, endIndex).map(processProject)

  // 4. 返回包含元数据的结构
  // TypeScript 现在会确保这里的结构符合 PaginatedResponse
  return {
    items: paginatedItems,
    hasMore: endIndex < activeProjects.length,
    total: activeProjects.length,
    // page: page // 如果以后加上这个字段，TS 会提示
  }
})