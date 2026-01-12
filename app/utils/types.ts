/**
 * 核心项目数据结构
 * 该类型对应 API /api/projects 返回的数据项
 */
export interface Project {
  id: number
  title: string
  description: string
  icon: string
  
  // 外部链接字段
  demoUrl?: string
  githubUrl?: string
  appStoreUrl?: string
  googlePlayUrl?: string
  
  // 服务端 processProject 处理后生成的统一主链接
  mainUrl?: string 
  
  // 元数据
  date?: string
  featured?: boolean
}