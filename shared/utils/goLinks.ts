// /go/ 短链接映射，app 与 server 共用（server 端仍负责 302 跳转）
export const goLinks: Record<string, string> = {
  // --- 社交媒体 ---
  'github': 'https://github.com/budaobu',
  'twitter': 'https://x.com/lizhaoshui',
  'x': 'https://x.com/lizhaoshui',
  'telegram': 'https://t.me/joeyhuey',
  'whatsapp': 'https://wa.me/你的号码',
  'discord': '#',
  'instagram': '#',
  'youtube': '#',

  // --- 音乐服务 ---
  'spotify': '#',
  'applemusic': '#',

  // --- 站内功能快捷方式 ---
  'mail': '/connect',
  'contact': '/connect',
  'sponsor': '/sponsor',
  'rss': '/rss.xml',

  // --- 特定资源 ---
  'source': 'https://github.com/budaobu/portfolio',
  'coffee': 'https://buymeacoffee.com/lizhaoshui',

  // 默认回首页
  'home': '/',

  // 其他静态映射可继续添加
  'claude': 'https://claude.ai',
  'chatgpt': 'https://chat.openai.com/',
  'gemini': 'https://gemini.google.com/',
  'nuxtjs': 'https://nuxt.com',
  'kimi': 'https://www.kimi.com/code',
  'zhipu': 'https://www.bigmodel.cn/invite?icode=Ew3Q%2FbRU7hh50jn09dXVK1wpqjqOwPB5EXW6OL4DgqY%3D',

  // uses链接
  'wise': 'https://wise.com/invite/ilpc/qiuyangh',
  'giffgaff': 'https://giffgaff.com/orders/affiliate/aigua63?app=1',
  'dmit': 'https://www.dmit.io/aff.php?aff=24826',
  'dedirock': 'https://billing.dedirock.com/aff.php?aff=794',
  'evoxt': 'https://console.evoxt.com/aff.php?aff=4733'
}
