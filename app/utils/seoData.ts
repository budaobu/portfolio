// 定义 SEO 数据结构
export interface PageSeoConfig {
  title: string
  description: string
  ogTitle?: string
  ogDescription?: string
}

export const SEO_DATA = {
  home: {
    title: 'Budaobu\'s Vibe Coding Portfolio',
    description: 'Non-developer building things through vibe coding. A collection of experiments and creations born from curiosity and intuition.',
    ogTitle: 'Budaobu\'s Vibe Coding Portfolio',
    ogDescription: 'Non-dev, just vibe coding to stitch stuff together.',
  },
  projects: {
    title: 'Projects, The AI-Stitched Collection, Vibe Coding',
    description: 'Meet the "Stitched Ones"—a collection of projects entirely stitched together by AI. My philosophy is Vibe Coding: I don\'t care how the code looks; the most important thing is that it runs.',
    ogTitle: 'Budaobu\'s Projects - The Stitched Collection',
    ogDescription: 'Pure Vibe Coding. It might be messy under the hood, but hey, it runs. Come see the chaos.',
  },
  uses: {
    title: 'Uses, Goods, Stuff I Paid For',
    description: 'Everything here is something I actually paid for. Welcome to my personal \'Buy\' list. Note: Links marked with AFF are affiliate links; I may earn a small commission at no extra cost to you.',
    ogTitle: 'Budaobu\'s \'Buy\' List - Stuff I Paid For',
    ogDescription: 'My wallet suffered for this list. A collection of things I actually spent money on. (AFF links included at no extra cost)',
  },
  connect: {
    title: 'Connect',
    description: 'Whether for collaboration, tech talk, or just to say hi, feel free to reach out anytime.',
    ogTitle: 'Connect with me',
    ogDescription: 'Let\'s create something amazing together.',
  },
  sponsor: {
    title: 'Sponsor, Fuel the AI-Stitched Chaos, Donate',
    description: 'Support Budaobu\'s AI-stitched experiments. Stitching code together is exhausting work (even with AI). If it happens to be Thursday, please V me 50 for a KFC bucket.',
    ogTitle: 'Sponsor Budaobu - V me 50!',
    ogDescription: 'The AI writes the code, but I have to do the stitching. Feed the stitcher. V me 50 for KFC Crazy Thursday.',
  },
  blog: {
    title: 'Blog, No Tech, Just Talking Nonsense',
    description: 'No technical skills involved, just ramblings. This is a tech-free zone where I talk nonsense and share random thoughts without any professional filter.',
    ogTitle: 'Budaobu\'s Blog - No Tech, Just Nonsense',
    ogDescription: 'Warning: Contains zero technical content. Just me rambling about random stuff. No code, just vibes.',
  }
} as const

// 导出 Key 类型，供 Composable 使用
export type SeoPageKey = keyof typeof SEO_DATA