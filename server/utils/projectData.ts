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
    title: 'Video to GIF',
    description: 'In browser converter, process locally, no server upload required.',
    icon: '🎥',
    demoUrl: '/video2gif',
    githubUrl: 'https://github.com/budaobu/video2gif',
    date: '2025-12-01',
    featured: true
  },
  {
    id: 6,
    title: 'Portfolio',
    description: 'Personal Homepage。',
    icon: '/avatar.webp',
    demoUrl: '/',
    githubUrl: 'https://github.com/budaobu/portfolio',
    date: '2025-12-01',
    featured: true
  },
  {
    id: 5,
    title: 'Tinypic',
    description: 'In browser compression, process images locally without uploading.',
    icon: '🖼',
    demoUrl: '/tinypic',
    githubUrl: 'https://github.com/budaobu/tinypic',
    date: '2025-11-29',
    featured: true
  },
  {
    id: 4,
    title: 'Meme Slicer',
    description: 'In browser meme tool, auto-slice images into custom grids (e.g., 6x4, 7x4) and generate GIFs.',
    icon: 'i-heroicons-squares-2x2',
    demoUrl: '/meme-slicer',
    githubUrl: 'https://github.com/budaobu/meme-slicer',
    date: '2025-11-28',
    featured: true
  },
  {
    id: 3,
    title: 'ID Photo Watermarker',
    description: 'In browser watermarker, add text watermarks to ID photos. Customize position, opacity, and size for professional results.',
    icon: '💻',
    demoUrl: '/image-watermark',
    githubUrl: 'https://github.com/budaobu/image-watermark',
    date: '2025-01-05',
    featured: true
  },
  {
    id: 2,
    title: 'EV vs. Gas Calculator',
    description: 'Scientifically analyze the best choice based on annual mileage, charging access, and driving habits.',
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