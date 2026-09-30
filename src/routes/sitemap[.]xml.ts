import { createFileRoute } from '@tanstack/react-router'

import { sortedPosts } from '../content/posts'
import { servicePath, services } from '../content/services'
import { SITE_URL } from '../lib/seo'

/**
 * Le sitemap, construit depuis le contenu à chaque requête.
 *
 * Plus rien n'est prérendu (voir `vite.config.ts`) : la liste suit donc les
 * données, pas un crawl du build. Une page ajoutée hors de `services.ts` et
 * des articles doit être ajoutée ici. `/agence`, `/projets`, `/rendez-vous`
 * et `/404` n'y figurent pas : ce sont des renvois, ou une page d'erreur.
 */
const pages = [
  '/',
  '/services',
  ...services.map((service) => servicePath(service.slug)),
  '/qui-suis-je',
  '/blog',
  '/contact',
]

function entry(path: string, lastmod?: string) {
  const date = lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ''
  return `  <url>\n    <loc>${SITE_URL}${path}</loc>${date}\n  </url>`
}

export const Route = createFileRoute('/sitemap.xml')({
  server: {
    handlers: {
      GET: () => {
        const urls = [
          ...pages.map((path) => entry(path)),
          ...sortedPosts.map((post) => entry(`/blog/${post.slug}`, post.date)),
        ]
        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>
`
        return new Response(xml, {
          headers: {
            'content-type': 'application/xml; charset=utf-8',
            'cache-control': 'public, max-age=3600',
          },
        })
      },
    },
  },
})
