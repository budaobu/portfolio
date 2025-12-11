export interface Good {
  id: number
  brand: string // 品牌
  name: string // 名称
  category: string // 类别：数码、生活、书籍等
  description: string // 推荐语
  imageUrl: string // 图片路径
  linkUrl: string // 购买链接
  isAffiliate: boolean // 是否恰饭
}

export const goods: Good[] = [
  {
    id: 5,
    brand: 'Dler Cloud',
    name: 'Pass Gold套餐',
    category: '机场',
    description: '使用了5年的机场，稳定高速，支持多种协议',
    imageUrl: '',
    linkUrl: 'https://dlercloud.com/auth/register?affid=39909',
    isAffiliate: true
  },
  {
    id: 4,
    brand: 'Logitech',
    name: 'MX Keys Mini',
    category: '数码外设',
    description: '我最喜欢的矮轴无线键盘，手感极佳，支持多设备无缝切换，Mac 用户首选。',
    // 示例：使用外部占位图，实际项目中请替换为 public/goods/ 下的图片
    imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b91a603?q=80&w=400&auto=format&fit=crop',
    linkUrl: 'https://item.jd.com/100026206666.html',
    isAffiliate: true
  },
  {
    id: 3,
    brand: 'Herman Miller',
    name: 'Aeron Chair',
    category: '办公生活',
    description: '人体工学椅的终点。虽然价格昂贵，但考虑到每天要坐8小时以上，这是对腰椎最好的投资。',
    imageUrl: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?q=80&w=400&auto=format&fit=crop',
    linkUrl: 'https://www.hermanmiller.com/',
    isAffiliate: false
  },
  {
    id: 2,
    brand: 'Sony',
    name: 'WH-1000XM5',
    category: '音频设备',
    description: '降噪效果非常惊艳，戴上它整个世界都安静了，非常适合在嘈杂的咖啡厅写代码。',
    imageUrl: 'https://images.unsplash.com/photo-1610398000004-927503f132e6?q=80&w=400&auto=format&fit=crop',
    linkUrl: 'https://www.sony.com.cn/',
    isAffiliate: true
  },
  {
    id: 1,
    brand: 'OReilly',
    name: 'Designing Data-Intensive Applications',
    category: '书籍',
    description: '后端工程师必读神书（DDIA），深入浅出地讲解了分布式系统的核心原理。',
    imageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=400&auto=format&fit=crop',
    linkUrl: 'https://book.douban.com/subject/26961191/',
    isAffiliate: false
  }
]