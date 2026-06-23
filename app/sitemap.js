const BASE = 'https://docs.cronstream.xyz'

export default function sitemap() {
  const pages = [
    { slug: '',              priority: 1.0 },
    { slug: 'problem',       priority: 0.9 },
    { slug: 'how-it-works',  priority: 0.9 },
    { slug: 'architecture',  priority: 0.8 },
    { slug: 'economics',     priority: 0.8 },
    { slug: 'roadmap',       priority: 0.7 },
    { slug: 'faq',           priority: 0.7 },
  ]

  return pages.map(({ slug, priority }) => ({
    url: slug ? `${BASE}/${slug}` : BASE,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority,
  }))
}
