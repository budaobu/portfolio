// 定义作品数据类型
export interface Project {
  id: number
  title: string
  description: string
  icon: string
  demoUrl?: string
  githubUrl?: string
  date?: string // 可选：用于 RSS 的发布时间，如果不填则使用当前时间
}

// 单一数据源
export const projects: Project[] = [
  {
    id: 1,
    title: 'AI 聊天助手',
    description: '基于大语言模型的智能对话系统，支持多轮对话和上下文理解。采用流式响应提升用户体验。',
    icon: '🤖',
    demoUrl: 'https://demo.example.com',
    githubUrl: 'https://github.com/budaobu/project1',
    date: '2024-01-15'
  },
  {
    id: 2,
    title: '任务管理工具',
    description: '简洁高效的任务管理应用，支持项目分类、优先级设置和协作功能。数据本地存储，保护隐私。',
    icon: '📝',
    demoUrl: 'https://demo.example.com',
    githubUrl: 'https://github.com/budaobu/project2',
    date: '2024-02-20'
  },
  {
    id: 3,
    title: '代码片段收藏',
    description: '开发者的代码片段管理工具，支持语法高亮、标签分类和全文搜索。快速找到需要的代码。',
    icon: '💻',
    githubUrl: 'https://github.com/budaobu/project3',
    date: '2024-03-10'
  },
  {
    id: 4,
    title: '图片压缩工具',
    description: '浏览器端图片压缩，无需上传服务器。支持批量处理和自定义压缩质量，速度快且安全。',
    icon: '🖼️',
    demoUrl: 'https://demo.example.com',
    date: '2024-04-05'
  },
  {
    id: 5,
    title: '天气预报看板',
    description: '简洁美观的天气应用，展示实时天气和未来预报。支持多城市切换，数据来自权威气象接口。',
    icon: '🌤️',
    demoUrl: 'https://demo.example.com',
    githubUrl: 'https://github.com/budaobu/project5',
    date: '2024-05-01'
  },
  {
    id: 6,
    title: 'Markdown 编辑器',
    description: '实时预览的 Markdown 编辑器，支持快捷键操作和自定义主题。写作体验流畅，导出格式丰富。',
    icon: '✍️',
    demoUrl: 'https://demo.example.com',
    githubUrl: 'https://github.com/budaobu/project6',
    date: '2024-06-15'
  }
]