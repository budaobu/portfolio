export default defineEventHandler((event) => {
  // 设置缓存，避免频繁计算
  setResponseHeader(event, 'Cache-Control', 'public, max-age=3600, s-maxage=3600')
  
  // Nitro 会自动导入 server/utils/projectData.ts 中的 projects
  // 我们对数据进行 map 处理，根据逻辑动态替换 icon
  return projects.map((project) => {
    // 浅拷贝对象，避免污染原始数据
    const item = { ...project }

    // 辅助函数：判断字符串是否为图片 URL (简单的特征判断)
    const isUrl = (str: string) => /^(https?:\/\/|\/|data:image)/.test(str)

    // 逻辑 1: 如果 icon 键值本身就是图片 URL，直接使用
    if (isUrl(item.icon)) {
      return item
    }

    // 逻辑 2: 如果 icon 不是 URL，且 demoUrl 不为空，尝试自动获取 Favicon
    if (item.demoUrl) {
      try {
        const hostname = new URL(item.demoUrl).hostname
        // 使用 Google S2 Favicon API 自动获取该域名的图标
        // 这比后端去 fetch HTML 解析 <link> 标签要快得多，且自带 CDN 缓存
        // sz=128 获取较高清图标
        item.icon = `https://www.google.com/s2/favicons?domain=${hostname}&sz=128`
      } catch (e) {
        // 如果 URL 解析失败，不做处理，继续走下面的兜底逻辑
      }
    }

    // 逻辑 3: demoUrl 为空或获取失败，直接使用原始 icon (Emoji 或 Iconify class)
    return item
  })
})