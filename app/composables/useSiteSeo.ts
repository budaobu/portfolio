import { SEO_DATA, type SeoPageKey } from '~/utils/seoData'

/**
 * 统一处理页面 SEO 的 Composable
 * @param pageKey - 对应 SEO_DATA 中的键值 (例如 'home', 'projects')
 */
export const useSiteSeo = (pageKey: SeoPageKey) => {
  const config = SEO_DATA[pageKey]
  const siteConfig = useSiteConfig()

  useSeoMeta({
    title: config.title,
    description: config.description,
    ogTitle: config.ogTitle || config.title,
    ogDescription: config.ogDescription || config.description,
    ogSiteName: siteConfig.name,
    twitterCard: 'summary_large_image',
  })

  defineOgImageComponent('NuxtSeo', {
    title: config.ogTitle || config.title,
    description: config.ogDescription || config.description,
    theme: '#3b82f6',
    colorMode: 'dark',
    siteLogo: 'https://github.com/budaobu.png'
  })
}