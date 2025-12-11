export default defineEventHandler((event) => {
  // 设置缓存，1小时内无需重复计算
  setResponseHeader(event, 'Cache-Control', 'public, max-age=3600, s-maxage=3600')
  
  // 返回 server/utils/goodsData.ts 中的数据
  return goods
})