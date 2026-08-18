export interface SponsorMethod {
  id: number
  type: 'link' | 'address' | 'qrcode'
  title: string
  description: string
  icon?: string
  url?: string
  address?: string
  qrcode?: string
}

export const sponsorMethods: SponsorMethod[] = [
  {
    id: 1,
    type: 'link',
    title: 'Buy Me a Coffee',
    description: 'Support my work and keep the code flowing.',
    icon: '☕',
    // 关键修正：使用短链接，统一由服务端控制跳转
    // 对应 shared/utils/goLinks.ts 中的 'coffee'
    url: '/go/coffee'
  },
  /* // 暂时注释加密货币钱包
  {
    id: 2,
    type: 'address',
    title: 'Crypto Wallet',
    description: 'Crypto Support: Transfer USDT (TRC20) directly to the address below.',
    icon: '₿',
    address: 'TRC20_WALLET_ADDRESS_HERE'
  },
  */
  {
    id: 3,
    type: 'qrcode',
    title: 'Wechat Pay',
    description: 'Scan the QR code below with WeChat to support.',
    // 更新为 public 目录下的 wx-qr.JPG，直接使用绝对路径即可
    qrcode: '/wx-qr.JPG'
  }
]