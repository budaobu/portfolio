import { projects } from '../../utils/projectData'

export default defineEventHandler(async (event) => {
  // 1. 获取 URL 中的 key (例如 /go/github 中的 "github")
  const key = getRouterParam(event, 'key')?.toLowerCase()

  if (!key) {
    return sendRedirect(event, '/')
  }

  // 2. 静态短链接映射（优先级最高），与前端共用，见 shared/utils/goLinks.ts
  const staticLinks = goLinks

  // 检查静态映射
  if (staticLinks[key]) {
    if (staticLinks[key] === '#') {
      return sendRedirect(event, '/')
    }
    return sendRedirect(event, staticLinks[key], 302)
  }

  // 3. 智能查找项目 (Dynamic Project Mapping)
  // 自动将项目标题转换为 kebab-case 进行匹配
  // 例如: "Video to GIF" -> "video-to-gif"
  // 访问 /go/video-to-gif 将自动跳转到该项目的 demoUrl
  const project = projects.find(p => {
    const slug = p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    return slug === key || slug === `project-${key}`
  })

  if (project) {
    // 如果是站内链接 (如 /projects/xxx)，直接跳转
    // 如果是站外链接 (http)，也直接跳转
    return sendRedirect(event, project.demoUrl, 302)
  }

  // 4. 如果都找不到，跳转到 404 或首页
  throw createError({
    statusCode: 404,
    statusMessage: `Link '/go/${key}' not found`
  })
})
