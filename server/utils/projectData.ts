// 定义作品数据类型
export interface Project {
  id: number
  title: string
  description: string
  icon: string
  demoUrl?: string
  githubUrl?: string
  appStoreUrl?: string
  googlePlayUrl?: string
  date?: string // 可选：用于 RSS 的发布时间，如果不填则使用当前时间
  featured?: boolean
}

// 单一数据源
export const projects: Project[] = [
  {
    id: 7,
    title: '视频转Gif',
    description: '在浏览器本地将视频转换为 GIF 动图，无需上传服务器。。',
    icon: '🎥',
    demoUrl: '/video2gif',
    githubUrl: 'https://github.com/budaobu/video2gif',
    date: '2025-12-01',
    featured: true
  },
  {
    id: 6,
    title: '作品集网站',
    description: '我的个人作品集网站，展示了我 vibe 的各种有趣项目和技术探索。',
    icon: '/avatar.webp',
    demoUrl: 'https://portfolio-2d2.pages.dev/',
    githubUrl: 'https://github.com/budaobu/portfolio',
    date: '2025-12-01',
    featured: true
  },
  {
    id: 5,
    title: '图片压缩助手',
    description: '图片压缩工具，支持 PNG, JPG, JPEG, WebP, AVIF 格式。浏览器本地压缩，无需上传服务器。',
    icon: '🖼',
    demoUrl: 'https://tinypic.lizhaoshui.workers.dev/',
    githubUrl: 'https://github.com/budaobu/tinypic',
    date: '2025-11-29',
    featured: true
  },
  {
    id: 4,
    title: '表情包切片工具',
    description: '表情包制作工具，提供图片网格自动裁剪（支持6x4, 7x4等自定义布局）与GIF动图合成功能',
    icon: '✂',
    demoUrl: 'https://slice-meme.lizhaoshui.workers.dev/',
    githubUrl: 'https://github.com/budaobu/slice-meme-image',
    date: '2025-11-28',
    featured: true
  },
  {
    id: 3,
    title: '证件照加水印',
    description: '证件照加水印工具，支持文字水印。可自定义位置、透明度和大小，操作简单，效果专业。',
    icon: '💻',
    demoUrl: 'https://image-watermark-at5.pages.dev/',
    githubUrl: 'https://github.com/budaobu/image-watermark',
    date: '2025-01-05',
    featured: true
  },
  {
    id: 2,
    title: '买电车还是油车？',
    description: '通过年行驶里程、充电条件、使用场景等多个维度，科学计算是否适合购买电动汽车或燃油车。',
    icon: '🚗',
    demoUrl: 'https://car-calculator.pages.dev/',
    githubUrl: 'https://github.com/budaobu/car-calculator',
    date: '2024-11-27'
  },
  {
    id: 1,
    title: 'ASN CN',
    description: 'Fetch ASN CN data from bgp.he.net and whois.ipip.net daily.',
    icon: '🌐',
    demoUrl: '',
    githubUrl: 'https://github.com/budaobu/rules/blob/main/py/cn-asn-scraper.py',
    date: '2024-09-10',
    featured: true
  }
]