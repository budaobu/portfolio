import type { Project } from './projectData'

/**
 * 处理单个项目数据：
 * 1. 计算 mainUrl 优先级
 * 2. 自动补全 Icon (如果没有提供)
 */
export const processProject = (project: Project) => {
  // 浅拷贝对象，避免污染原始数据
  // 使用 & { mainUrl: string } 来扩展类型
  const item = { ...project } as typeof project & { mainUrl: string }

  // --- 逻辑 A: 计算主链接 (Main Link) ---
  // 优先级: Web > GitHub > App Store > Google Play
  item.mainUrl = item.demoUrl || item.githubUrl || item.appStoreUrl || item.googlePlayUrl || ''

  // --- 逻辑 B: 图标处理 (Icon) ---
  // 1. 只要 icon 有值，直接使用
  if (item.icon) {
    return item
  }

  // 2. icon 为空，尝试通过可用的 URL 获取 Google Favicon
  // 优先使用 mainUrl 的域名
  if (item.mainUrl) {
    try {
      const hostname = new URL(item.mainUrl).hostname
      // sz=128 获取较高清图标
      item.icon = `https://www.google.com/s2/favicons?domain=${hostname}&sz=128`
      return item
    } catch (e) {
      // URL 解析失败，继续走后续逻辑
    }
  }

  // 3. 上述都无效，但有 githubUrl
  if (item.githubUrl) {
    item.icon = 'https://github.com/favicon.ico'
    return item
  }

  return item
}