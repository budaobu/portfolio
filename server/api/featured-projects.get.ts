export default defineEventHandler((event) => {
  // 设置缓存
  setResponseHeader(event, 'Cache-Control', 'public, max-age=3600, s-maxage=3600')
  
  // 1. 获取所有项目 (Nitro 自动导入 server/utils/projectData.ts)
  // 2. 过滤出 featured 为 true 的项目
  // 3. 使用 processProject 进行数据加工 (Nitro 自动导入 server/utils/projectProcess.ts)
  return projects
    .filter(p => p.featured === true)
    .map(processProject)
})