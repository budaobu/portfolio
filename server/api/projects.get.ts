export default defineEventHandler((event) => {
  // 设置缓存，避免频繁计算
  setResponseHeader(event, 'Cache-Control', 'public, max-age=3600, s-maxage=3600')
  
  // Nitro 会自动导入 server/utils/projectData.ts 中的 projects
  // 我们对数据进行 map 处理，根据逻辑动态替换 icon
  return projects.map((project) => {
    // 浅拷贝对象，避免污染原始数据
    const item = { ...project }

    // 逻辑 1: 只要 icon 有值 (无论是 Emoji, Iconify Class, 还是自定义 URL)，直接使用，不做任何处理
    if (item.icon) {
      return item
    }

    // 逻辑 2: icon 为空，尝试通过 demoUrl 获取 Google Favicon
    if (item.demoUrl) {
      try {
        const hostname = new URL(item.demoUrl).hostname
        // sz=128 获取较高清图标
        item.icon = `https://www.google.com/s2/favicons?domain=${hostname}&sz=128`
        return item
      } catch (e) {
        // URL 解析失败，继续走后续逻辑
      }
    }

    // 逻辑 3: icon 和 demoUrl 都为空 (或解析失败)，但有 githubUrl，使用 GitHub 官方图标
    if (item.githubUrl) {
      item.icon = 'https://github.com/favicon.ico'
      return item
    }

    // 逻辑 4: 什么都没有，返回原样 (此时 icon 应该是 undefined 或空字符串)
    return item
  })
})