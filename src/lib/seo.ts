const SITE_URL = 'https://porfo.io'
const SITE_NAME = 'Porfo'
const DEFAULT_OG_IMAGE = '/og-image.png'

interface SeoOptions {
  title: string
  description: string
  path: string
  image?: string
  type?: string
}

export function createSeoMeta({ title, description, path, image, type }: SeoOptions) {
  const url = `${SITE_URL}${path}`
  const imageUrl = `${SITE_URL}${image ?? DEFAULT_OG_IMAGE}`

  return [
    { title },
    { name: 'description', content: description },
    { name: 'theme-color', content: '#0f172a' },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:url', content: url },
    { property: 'og:image', content: imageUrl },
    { property: 'og:type', content: type ?? 'website' },
    { property: 'og:site_name', content: SITE_NAME },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: imageUrl },
  ]
}

export function createCanonicalLink(path: string) {
  return { rel: 'canonical', href: `${SITE_URL}${path}` }
}
