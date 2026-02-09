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
    id: 7,
    brand: 'Google',
    name: 'Gemini Pro',
    category: 'AI',
    description: 'The brain behind this portfolio. I bring the vibe, Gemini stitches the code. My absolute daily driver.',
    imageUrl: '',
    linkUrl: 'https://gemini.google.com/',
    isAffiliate: false
  },
  {
    id: 6,
    brand: 'Spotify',
    name: 'Spotify Premium',
    category: 'Music Service',
    description: 'I use Spotify because it usually knows what I want to hear, even when I don’t.',
    imageUrl: '',
    linkUrl: 'https://open.spotify.com/',
    isAffiliate: false
  },
  {
    id: 5,
    brand: 'Wise',
    name: 'Wise',
    category: 'Nomad',
    description: 'Wise is the service I use when I want international transfers to be simple, transparent, and predictable.',
    imageUrl: '',
    linkUrl: 'https://wise.com/',
    isAffiliate: false
  },
  {
    id: 4,
    brand: 'Giffgaff',
    name: 'Giffgaff SIM',
    category: 'Mobile Service',
    description: 'giffgaff is how I keep my number alive overseas. Free roaming SMS, no monthly cost.',
    imageUrl: '',
    linkUrl: 'https://giffgaff.com/orders/affiliate/aigua63?app=1',
    isAffiliate: true
  },
  {
    id: 3,
    brand: 'DAREU',
    name: 'EK87 Pro',
    category: 'Accessories',
    description: '87-Key Mechanical Keyboard: RGB Backlit, Comfortable for All-Day Use.',
    imageUrl: 'https://cloudflare-imgbed-88m.pages.dev/file/AgACAgEAAyEGAASJ9vGyAAMWaUpXuCHVEHGtJIYgB_XXJAbKEwwAAkcLaxvZZVBGSXU8KRoTkbcBAAMCAAN5AAM2BA.png',
    linkUrl: 'https://item.jd.com/10101796526513.html',
    isAffiliate: false
  },
  {
    id: 2,
    brand: 'Surge',
    name: 'Surge',
    category: 'App',
    description: 'Advanced Network Toolbox for Mac & iOS',
    imageUrl: '',
    linkUrl: 'https://nssurge.com/',
    isAffiliate: false
  }/* ,
  {
    id: 1,
    brand: 'Dler Cloud',
    name: 'Proxy Provider',
    category: 'IPLC',
    description: 'Used for 5 Years: Stable, Fast, and Multi-Protocol Support.',
    imageUrl: '',
    linkUrl: 'https://dlercloud.com/auth/register?affid=39909',
    isAffiliate: true
  } */
]

// 核心优化：统一在此处按 ID 降序排列
// 导出后，整个应用拿到的 uses 都是有序的
export const uses = rawUses.sort((a, b) => b.id - a.id)