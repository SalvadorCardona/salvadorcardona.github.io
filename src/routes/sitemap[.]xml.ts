import { createFileRoute } from '@tanstack/react-router'

import { SUBSCRIPTION_PATH } from '../content/agency'
import { sortedPosts } from '../content/posts'
import { servicePath, services } from '../content/services'
import { SITE_URL } from '../lib/seo'

/** Le jour du build, `AAAA-MM-JJ`, posé par `define` dans `vite.config.ts`. */
declare const __BUILD_DATE__: string

/**
 * Le sitemap, construit depuis le contenu à chaque requête.
 *
 * Plus rien n'est prérendu (voir `vite.config.ts`) : la liste suit donc les
 * données, pas un crawl du build. Une page ajoutée hors de `services.ts` et
 * des articles doit être ajoutée ici. `/agence`, `/projets`, `/rendez-vous`
 * et `/404` n'y figurent pas : ce sont des renvois, ou une page d'erreur.
 *
 * Chaque URL porte un `lastmod` : sa date pour un article, celle du dernier
 * article pour `/blog`, et le jour du build pour les autres pages, dont le
 * contenu est en dur et ne change qu'avec une nouvelle image.
 */
const pages = [
  '/',
  '/services',
  ...services.map((service) => servicePath(service.slug)),
  SUBSCRIPTION_PATH,
  '/creation-site-vitrine-lyon',
  '/notre-equipe',
  '/references',
  '/contact',
  '/mentions-legales',
  '/confidentialite',
]

function entry(path: string, lastmod: string) {
  return `  <url>\n    <loc>${SITE_URL}${path}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`
}

export const Route = createFileRoute('/sitemap.xml')({
  server: {
    handlers: {
      GET: () => {
        const urls = [
          ...pages.map((path) => entry(path, __BUILD_DATE__)),
          entry('/blog', sortedPosts[0]?.date ?? __BUILD_DATE__),
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
