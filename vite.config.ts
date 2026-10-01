import { readdirSync } from 'node:fs'
import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { nitro } from 'nitro/vite'

/**
 * Build serveur pour Dokploy : Nitro, preset `node-server`.
 *
 * `vite build` écrit `.output/` : `server/index.mjs`, le serveur Node qui rend
 * chaque page à la requête et répond aux server functions, et `public/`, les
 * fichiers statiques qu'il sert tels quels. C'est tout ce que copie l'image
 * Docker (voir le Dockerfile).
 *
 * Rien n'est prérendu. Nitro dresse la liste des fichiers qu'il sert avant que
 * le prérendu de Start n'écrive les siens : les pages et le sitemap prérendus
 * resteraient sur le disque sans jamais être servis. Le sitemap est donc une
 * route (`routes/sitemap[.]xml.ts`), et `scripts/postbuild.mjs` démarre le
 * serveur construit pour vérifier chaque page, à la place du `failOnError`
 * du prérendu.
 *
 * Le mode SPA reste désactivé : activé, il remplace la page d'accueil par une
 * coquille vide (`_shell.html`).
 *
 * Le `base` reste `/` : le site est servi à la racine de `cardona.digital`.
 *
 * Compression : Nitro écrit une version `.br` et `.gz` de chaque fichier
 * statique compressible (JS, CSS, SVG…) et la sert selon `Accept-Encoding`.
 * Les pages, rendues à la requête, sont compressées par Traefik (middleware
 * `compress@file`, `deploy/traefik/compress.yml`).
 *
 * Cache : les fichiers de `/assets/` sont hachés et déjà servis `immutable` ;
 * les autres gardent leur nom d'une version à l'autre, d'où une durée bornée,
 * plus courte pour ceux qui ne sont pas rangés par dossier. `/blog/` partage
 * son préfixe avec les pages d'articles, que `/blog/**` mettrait aussi en
 * cache : on y vise chaque illustration par son nom.
 */
const ONE_DAY = 60 * 60 * 24
const cacheFor = (seconds: number) => ({
  headers: { 'cache-control': `public, max-age=${seconds}` },
})
const blogImages = Object.fromEntries(
  readdirSync('public/blog').map((file) => [`/blog/${file}`, cacheFor(30 * ONE_DAY)]),
)

const config = defineConfig({
  resolve: { tsconfigPaths: true },
  base: '/',
  plugins: [
    tailwindcss(),
    tanstackStart(),
    nitro({
      preset: 'node-server',
      compressPublicAssets: { gzip: true, brotli: true },
      routeRules: {
        '/realisations/**': cacheFor(30 * ONE_DAY),
        '/clients/**': cacheFor(30 * ONE_DAY),
        '/projects/**': cacheFor(30 * ONE_DAY),
        ...blogImages,
        '/video/**': cacheFor(30 * ONE_DAY),
        '/banner.png': cacheFor(ONE_DAY),
        '/favicon.svg': cacheFor(ONE_DAY),
        '/favicon-16x16.png': cacheFor(ONE_DAY),
        '/favicon-32x32.png': cacheFor(ONE_DAY),
        '/apple-touch-icon.png': cacheFor(ONE_DAY),
      },
    }),
    viteReact(),
  ],
})

export default config
