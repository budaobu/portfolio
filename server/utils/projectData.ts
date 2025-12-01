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
    title: '图片压缩助手',
    description: '图片压缩工具，支持 PNG, JPG, JPEG, WebP, AVIF 格式。浏览器本地压缩，无需上传服务器。',
    icon: '🤖',
    demoUrl: 'https://tinypic.lizhaoshui.workers.dev/',
    githubUrl: 'https://github.com/budaobu/tinypic',
    date: '2025-11-29'
  },
  {
    id: 2,
    title: '表情包切片工具',
    description: '表情包制作工具，提供图片网格自动裁剪（支持6x4, 7x4等自定义布局）与GIF动图合成功能',
    icon: '📝',
    demoUrl: 'https://slice-meme.lizhaoshui.workers.dev/',
    githubUrl: 'https://github.com/budaobu/slice-meme-image',
    date: '2025-11-28'
  },
  {
    id: 3,
    title: '图片加水印',
    description: '证件照加水印工具，支持文字水印。可自定义位置、透明度和大小，操作简单，效果专业。',
    icon: '💻',
    demoUrl: 'https://image-watermark-at5.pages.dev/',
    githubUrl: 'https://github.com/budaobu/image-watermark',
    date: '2025-01-05'
  },
  {
    id: 4,
    title: '买电车还是油车？',
    description: '通过年行驶里程、充电条件、使用场景等多个维度，科学计算是否适合购买电动汽车或燃油车。',
    icon: '🖼️',
    demoUrl: 'https://car-calculator.pages.dev/',
    githubUrl: 'https://github.com/budaobu/car-calculator',
    date: '2024-11-27'
  }
]