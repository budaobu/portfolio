export default defineEventHandler((event) => {
  // 设置缓存
  setResponseHeader(event, 'Cache-Control', 'public, max-age=3600, s-maxage=3600')
  
  // 直接对所有数据应用处理逻辑
  return projects.map(processProject)
})