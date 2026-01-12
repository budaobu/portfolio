import type { Project } from '~/app/utils/types'

// 显式声明返回类型为 Project[]
export default defineEventHandler(async (event): Promise<Project[]> => {
  // 设置缓存
  setResponseHeader(event, 'Cache-Control', 'public, max-age=3600, s-maxage=3600')
  
  // 优化后：projects 已经是有序的了
  // 1. 过滤出 featured 为 true 的项目
  // 2. 限制最多显示 3 个
  // 3. 数据加工
  return projects
    .filter(p => p.featured === true)
    .slice(0, 3)
    .map(processProject)
})