// 移除 import 语句，Nitro 会自动导入 server/utils 中的 projects
// import { projects } from '~/server/utils/projectData' <--- 删除这行

export default defineEventHandler((event) => {
  // 可以在这里添加缓存逻辑 (Cache-Control) 以提升性能
  setResponseHeader(event, 'Cache-Control', 'public, max-age=3600, s-maxage=3600')
  
  // 直接使用 projects 变量
  return projects
})