/**
 * SEO composable for managing page meta tags
 */

export interface SeoOptions {
  title: string
  description: string
  ogImage?: string
  ogType?: 'website' | 'article'
  keywords?: string
  author?: string
  canonical?: string
}

export const useSeo = (options: SeoOptions) => {
  const siteName = 'CarLogs - Cộng Đồng Lỗi Xe'
  const siteUrl = 'https://carlogs.vn' // Update with actual domain
  
  const fullTitle = options.title ? `${options.title} | ${siteName}` : siteName
  const canonical = options.canonical || useRoute().path
  
  useHead({
    title: fullTitle,
    meta: [
      { name: 'description', content: options.description },
      { name: 'keywords', content: options.keywords || 'lỗi xe, OBD-II, sửa xe, chẩn đoán xe, cộng đồng ô tô' },
      { name: 'author', content: options.author || 'CarLogs' },
      
      // Open Graph
      { property: 'og:title', content: fullTitle },
      { property: 'og:description', content: options.description },
      { property: 'og:type', content: options.ogType || 'website' },
      { property: 'og:url', content: `${siteUrl}${canonical}` },
      { property: 'og:site_name', content: siteName },
      { property: 'og:locale', content: 'vi_VN' },
      
      // Twitter Card
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: fullTitle },
      { name: 'twitter:description', content: options.description },
      
      // Additional meta tags
      { name: 'robots', content: 'index, follow' },
      { name: 'language', content: 'Vietnamese' },
      { name: 'revisit-after', content: '7 days' },
      { name: 'distribution', content: 'global' },
    ],
    link: [
      { rel: 'canonical', href: `${siteUrl}${canonical}` }
    ]
  })
  
  // Add og:image if provided
  if (options.ogImage) {
    useHead({
      meta: [
        { property: 'og:image', content: options.ogImage },
        { name: 'twitter:image', content: options.ogImage }
      ]
    })
  }
}
