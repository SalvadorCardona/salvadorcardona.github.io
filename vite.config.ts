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
 */
const config = defineConfig({
  resolve: { tsconfigPaths: true },
  base: '/',
  plugins: [
    tailwindcss(),
    tanstackStart(),
    nitro({ preset: 'node-server' }),
    viteReact(),
  ],
})

export default config
