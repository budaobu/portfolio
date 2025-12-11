export interface Good {
  id: number
  brand: string // 品牌
  name: string // 名称
  category: string // 类别：数码、生活、书籍等
  description: string // 推荐语
  imageUrl?: string // 图片路径
  linkUrl: string // 购买链接
  isAffiliate: boolean // 是否恰饭
}

export const goods: Good[] = [
  {
    id: 3,
    brand: 'Wise',
    name: 'Wise (TransferWise)',
    category: '金融服务',
    description: '跨境汇款与多币种账户服务的首选。提供真实的中间市场汇率，费用透明低廉，是数字游民和跨境工作者的必备工具。',
    imageUrl: '',
    linkUrl: 'https://wise.com/',
    isAffiliate: false
  },
  {
    id: 2,
    brand: '达尔优',
    name: 'EK87 Pro 机械键盘',
    category: '数码配件',
    description: '87键机械键盘，带RGB背光，静音设计，适合长时间使用。',
    imageUrl: '/goods/DAREU-EK87Pro-Keyboard.png',
    linkUrl: 'https://item.jd.com/10101796526513.html',
    isAffiliate: false
  },
  {
    id: 1,
    brand: 'Dler Cloud',
    name: 'Pass Gold套餐',
    category: '机场',
    description: '使用了5年的机场，稳定高速，支持多种协议',
    imageUrl: '',
    linkUrl: 'https://dlercloud.com/auth/register?affid=39909',
    isAffiliate: true
  }
]