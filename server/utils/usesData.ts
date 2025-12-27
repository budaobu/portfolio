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

export const uses: Use[] = [
  {
    id: 6,
    brand: 'Spotify',
    name: 'Spotify Premium',
    category: 'Music Service',
    description: 'My Music Essential: Ad-free, Offline Listening, High Quality Audio.',
    imageUrl: '',
    linkUrl: 'https://open.spotify.com/',
    isAffiliate: false
  },
  {
    id: 5,
    brand: 'Wise',
    name: 'Wise',
    category: 'Nomad',
    description: 'My Go-To for Remittance: Transparent Pricing, Fast Transfers, Multi-Currency Support.',
    imageUrl: '',
    linkUrl: 'https://wise.com/',
    isAffiliate: false
  },
  {
    id: 4,
    brand: 'Giffgaff',
    name: 'Giffgaff SIM',
    category: 'Mobile Service',
    description: 'Receive SMS for free. No monthly fees, pay-as-you-go, keep number easily.',
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
  },
  {
    id: 1,
    brand: 'Dler Cloud',
    name: 'Proxy Provider',
    category: 'IPLC',
    description: 'Used for 5 Years: Stable, Fast, and Multi-Protocol Support.',
    imageUrl: '',
    linkUrl: 'https://dlercloud.com/auth/register?affid=39909',
    isAffiliate: true
  }
]
