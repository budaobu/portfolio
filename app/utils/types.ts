/**
 * 核心项目数据结构
 * 该类型对应 API /api/projects 返回的数据项
 */
export interface Project {
  id: number
  title: string
  description: string
  icon: string
  
  // 项目入口
  demoUrl: string
  
  // 元数据
  date?: string
  featured?: boolean
  archived?: boolean
}

/**
 * 通用分页响应契约
 * 用于 useInfiniteScroll 和所有列表类 API
 */
export interface PaginatedResponse<T> {
  items: T[]
  total: number
  hasMore: boolean
  page?: number 
}

/**
 * 通用 API 响应外壳 (可选)
 * 用于非资源类接口，如表单提交
 */
export interface ApiResponse<T = void> {
  success: boolean
  data?: T
  error?: string
  message?: string
  timestamp?: string
}
