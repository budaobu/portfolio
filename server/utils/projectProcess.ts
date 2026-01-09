import type { Project } from './projectData'

export const processProject = (project: Project) => {
  const item = { ...project } as typeof project & { mainUrl: string }

  // --- 逻辑 A: 计算主链接 (Main Link) ---
  // 优先级调整: Demo > App Store > Google Play > GitHub
  item.mainUrl = item.demoUrl || item.appStoreUrl || item.googlePlayUrl || item.githubUrl || ''

  // --- 逻辑 B: 图标处理 ---
  if (item.icon) return item

  // 自动补全图标逻辑
  if (item.mainUrl) {
    try {
      const hostname = new URL(item.mainUrl).hostname
      item.icon = `https://www.google.com/s2/favicons?domain=${hostname}&sz=128`
      return item
    } catch (e) {}
  }

  if (item.githubUrl) {
    item.icon = 'https://github.com/favicon.ico'
    return item
  }

  return item
}