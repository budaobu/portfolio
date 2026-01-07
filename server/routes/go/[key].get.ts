import { projects } from '../../utils/projectData'

export default defineEventHandler(async (event) => {
  // 1. 获取 URL 中的 key (例如 /go/github 中的 "github")
  const key = getRouterParam(event, 'key')?.toLowerCase()

  if (!key) {
    return sendRedirect(event, '/')
  }

  // 2. 定义静态短链接映射 (优先级最高)
  // 这里集中管理所有的外部跳转链接
  const staticLinks: Record<string, string> = {
    // --- 社交媒体 ---
    'github': 'https://github.com/budaobu',
    'twitter': 'https://x.com/lizhaoshui',
    'x': 'https://x.com/lizhaoshui',
    'telegram': 'https://t.me/joeyhuey',
    'whatsapp': 'https://wa.me/你的号码', // 请替换
    'discord': '#', // 请替换真实链接
    'instagram': '#', // 请替换真实链接
    'youtube': '#', // 请替换真实链接
    
    // --- 音乐服务 ---
    'spotify': '#', // 请替换真实链接
    'applemusic': '#', // 请替换真实链接

    // --- 站内功能快捷方式 ---
    'mail': '/connect',
    'contact': '/connect',
    'sponsor': '/sponsor',
    'rss': '/rss.xml',
    
    // --- 特定资源 ---
    'source': 'https://github.com/budaobu/portfolio', // 本站源码
    'coffee': 'https://buymeacoffee.com/lizhaoshui',
    
    // 默认回首页
    'home': '/'
  }

  // 检查静态映射
  if (staticLinks[key]) {
    // 注意：如果是 '#' 占位符，说明还没配置，暂时跳回首页避免报错
    if (staticLinks[key] === '#') {
      return sendRedirect(event, '/')
    }
    return sendRedirect(event, staticLinks[key], 302)
  }

  // 3. 智能查找项目 (Dynamic Project Mapping)
  // 自动将项目标题转换为 kebab-case 进行匹配
  // 例如: "Video to GIF" -> "video-to-gif"
  // 访问 /go/video-to-gif 将自动跳转到该项目的 demoUrl 或 githubUrl
  const project = projects.find(p => {
    const slug = p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    return slug === key || slug === `project-${key}`
  })

  if (project) {
    // 优先跳转到 Demo，没有 Demo 则跳转到 GitHub
    const targetUrl = project.demoUrl || project.githubUrl
    if (targetUrl) {
      // 如果是站内链接 (如 /projects/xxx)，直接跳转
      // 如果是站外链接 (http)，也直接跳转
      return sendRedirect(event, targetUrl, 302)
    }
  }

  // 4. 如果都找不到，跳转到 404 或首页
  throw createError({
    statusCode: 404,
    statusMessage: `Link '/go/${key}' not found`
  })
})