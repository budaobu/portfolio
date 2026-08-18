import { projects } from '../../utils/projectData'

export default defineEventHandler(async (event) => {
  // 1. 获取 URL 中的 key (例如 /go/github 中的 "github")
  const key = getRouterParam(event, 'key')?.toLowerCase()

  if (!key) {
    return sendRedirect(event, '/')
  }

  // 2. 定义静态短链接映射 (优先级最高)
  const staticLinks: Record<string, string> = {
    // --- 社交媒体 ---
    'github': 'https://github.com/budaobu',
    'twitter': 'https://x.com/lizhaoshui',
    'x': 'https://x.com/lizhaoshui',
    'telegram': 'https://t.me/joeyhuey',
    'whatsapp': 'https://wa.me/你的号码',
    'discord': '#',
    'instagram': '#',
    'youtube': '#',
    
    // --- 音乐服务 ---
    'spotify': '#',
    'applemusic': '#',

    // --- 站内功能快捷方式 ---
    'mail': '/connect',
    'contact': '/connect',
    'sponsor': '/sponsor',
    'rss': '/rss.xml',
    
    // --- 特定资源 ---
    'source': 'https://github.com/budaobu/portfolio',
    'coffee': 'https://buymeacoffee.com/lizhaoshui',
    
    // 默认回首页
    'home': '/',

    // 其他静态映射可继续添加
    'claude': 'https://claude.ai',
    'chatgpt': 'https://chat.openai.com/',
    'gemini': 'https://gemini.google.com/',
    'nuxtjs': 'https://nuxt.com',

    // uses链接
    'wise': 'https://wise.com/invite/ilpc/qiuyangh',
    'giffgaff': 'https://giffgaff.com/orders/affiliate/aigua63?app=1',
    'dmit': 'https://www.dmit.io/aff.php?aff=24826',
    'dedirock': 'https://billing.dedirock.com/aff.php?aff=794',
    'evoxt': 'https://billing.dedirock.com/aff.php?aff=794'
  }

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
