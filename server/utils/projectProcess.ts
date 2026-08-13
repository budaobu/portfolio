import type { Project } from './projectData'

export const processProject = (project: Project) => {
  const item = { ...project }

  // 自动补全外部 demo 的 favicon
  if (item.icon) return item

  if (item.demoUrl.startsWith('http')) {
    try {
      const hostname = new URL(item.demoUrl).hostname
      item.icon = `https://www.google.com/s2/favicons?domain=${hostname}&sz=128`
      return item
    } catch (e) {}
  }

  return item
}
