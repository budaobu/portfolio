export const socialLinks = [
  /* {
    name: 'X',
    icon: 'i-simple-icons-x',
    url: '/go/x',  // 使用短链接
    placement: ['home']
  }, */
  {
    name: 'Telegram',
    icon: 'i-simple-icons-telegram',
    // 原始: 'https://t.me/joeyhuey'
    // 修改为短链接，统一由服务端控制跳转
    url: '/go/telegram',
    placement: ['home']
  },
  /* {
    name: 'Discord',
    icon: 'i-simple-icons-discord',
    url: '/go/discord', // 预留
    placement: ['home', 'footer']
  },
  {
    name: 'Instagram',
    icon: 'i-simple-icons-instagram',
    url: '/go/instagram', // 预留
    placement: ['home', 'footer']
  },
  {
    name: 'WhatsApp',
    icon: 'i-simple-icons-whatsapp',
    url: '/go/whatsapp', 
    placement: ['home']
  },
  {
    name: 'YouTube',
    icon: 'i-simple-icons-youtube',
    url: '/go/youtube',
    placement: ['home', 'footer']
  },
  {
    name: 'Apple Music',
    icon: 'i-simple-icons-applemusic',
    url: '/go/applemusic',
    placement: ['home', 'footer']
  },
  {
    name: 'Spotify',
    icon: 'i-simple-icons-spotify',
    url: '/go/spotify',
    placement: ['home', 'footer']
  }, */
  {
    name: 'Source on GitHub',
    icon: 'i-simple-icons-github',
    // 原始: 'https://github.com/budaobu/portfolio'
    url: '/go/source', 
    placement: ['footer']
  },
  {
    name: 'RSS feed',
    icon: 'i-lucide-atom',
    url: '/rss.xml', // 站内资源保持原样
    placement: ['blog', 'footer']
  },
  {
    name: 'Sitemap',
    icon: 'i-lucide-network',
    url: '/sitemap.xml', // 站内资源保持原样
    placement: ['footer']
  },
  {
    name: 'Email',
    icon: 'i-lucide-mail',
    url: '/connect', 
    placement: ['footer']
  }
]