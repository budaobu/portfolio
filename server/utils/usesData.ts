export interface Use {
  id: number
  brand?: string // 品牌
  name: string // 名称
  category: string // 类别：数码、生活、书籍等
  description: string // 推荐语
  imageUrl?: string // 图片路径
  linkUrl: string // 购买链接
  isAffiliate: boolean // 是否恰饭
}

// 原始数据：顺序无所谓，后面会统一排
const rawUses: Use[] = [
  {
    id: 6,
    brand: 'DMIT',
    name: 'LAX.AS3.Pro.Tiny',
    category: 'VPS',
    description: 'DMIT 三网回程不分家，电信、联通、移动全部强制走 CN2 GIA (AS4809) 高阶精品线路直连回国。',
    imageUrl: '',
    linkUrl: 'https://www.dmit.io/aff.php?aff=24826',
    isAffiliate: true
  },
  {
    id: 5,
    brand: 'EVOXT',
    name: '马来西亚(优质网络+) VM-0.5',
    category: 'VPS',
    description: '可能是目前最便宜的亚太 VPS，电信走 CTG GIA 精品直连，联通走 AS9929 高阶直连，移动走 CMI 骨干。',
    imageUrl: '',
    linkUrl: 'https://console.evoxt.com/aff.php?aff=4733',
    isAffiliate: true
  },
  {
    id: 4,
    brand: 'DEDIROCK',
    name: 'Promo VPS Saver LA BF',
    category: 'VPS',
    description: '你就说是不是便宜的美西',
    imageUrl: '',
    linkUrl: 'https://billing.dedirock.com/aff.php?aff=794',
    isAffiliate: true
  },
  {
    id: 3,
    brand: 'Wise',
    name: 'Wise',
    category: 'Nomad',
    description: 'Wise is the service I use when I want international transfers to be simple, transparent, and predictable.',
    imageUrl: '',
    linkUrl: 'https://wise.com/',
    isAffiliate: false
  },
  {
    id: 2,
    brand: 'Giffgaff',
    name: 'Giffgaff SIM',
    category: 'Mobile Service',
    description: 'giffgaff is how I keep my number alive overseas. Free roaming SMS, no monthly cost.',
    imageUrl: '',
    linkUrl: 'https://giffgaff.com/orders/affiliate/aigua63?app=1',
    isAffiliate: true
  },
  {
    id: 1,
    brand: 'DAREU',
    name: 'EK87 Pro',
    category: 'Accessories',
    description: '87-Key Mechanical Keyboard: RGB Backlit, Comfortable for All-Day Use.',
    imageUrl: 'https://cloudflare-imgbed-88m.pages.dev/file/AgACAgEAAyEGAASJ9vGyAAMWaUpXuCHVEHGtJIYgB_XXJAbKEwwAAkcLaxvZZVBGSXU8KRoTkbcBAAMCAAN5AAM2BA.png',
    linkUrl: 'https://item.jd.com/10101796526513.html',
    isAffiliate: false
  }
]

// 核心优化：统一在此处按 ID 降序排列
// 导出后，整个应用拿到的 uses 都是有序的
export const uses = rawUses.sort((a, b) => b.id - a.id)
