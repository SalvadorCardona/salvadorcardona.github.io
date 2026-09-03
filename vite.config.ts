import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/**
 * Build statique pour GitHub Pages.
 *
 * `prerender` fige chaque route en HTML au build : le dossier `dist/client`
 * devient un site complet, servable par n'importe quel hébergeur de fichiers.
 *
 * Le mode SPA reste désactivé : activé, il remplace la page d'accueil par une
 * coquille vide (`_shell.html`) et fait perdre son HTML au `/`. Le repli sur
 * URL inconnue passe donc par une vraie route `/404`, prérendue puis déplacée
 * en `dist/client/404.html` par `scripts/postbuild.mjs` — c'est le fichier que
 * GitHub Pages sert quand aucune autre correspondance n'existe.
 *
 * Le `base` reste `/` : le site est publié sur un dépôt `<pseudo>.github.io`,
 * servi à la racine du domaine. Un dépôt de projet imposerait `/<repo>/` et
 * la gestion — encore fragile — du `basepath` dans Start.
 */
const config = defineConfig({
  resolve: { tsconfigPaths: true },
  base: '/',
  plugins: [
    tailwindcss(),
    tanstackStart({
      prerender: {
        enabled: true,
        // Suit les <a href> internes : /→/blog→/blog/<slug>. Aucune liste
        // d'URL à maintenir quand un article est ajouté.
        crawlLinks: true,
        // Écrit /blog/index.html plutôt que /blog.html, ce qu'attend un
        // hébergeur statique pour résoudre /blog.
        autoSubfolderIndex: true,
        failOnError: true,
        retryCount: 1,
        // Le crawler trouve /blog par le lien et /blog/ par la route : sans
        // ce filtre, la même page est rendue deux fois et apparaît en double
        // dans le sitemap. Même chose pour les liens vers une ancre
        // (/services#interventions) : c'est la même page que /services.
        filter: ({ path }) =>
          !path.includes('#') && (path === '/' || !path.endsWith('/')),
      },
      pages: [
        // Route non liée depuis le site : le crawler ne peut pas la trouver,
        // on la déclare explicitement. Elle n'a rien à faire dans le sitemap.
        { path: '/404', sitemap: { exclude: true } },
        // Variante avec slash final de /blog : ni rendue, ni indexée, pour
        // éviter le contenu dupliqué.
        {
          path: '/blog/',
          sitemap: { exclude: true },
          prerender: { enabled: false },
        },
        // Même chose pour /services, qui a aussi une route d'index.
        {
          path: '/services/',
          sitemap: { exclude: true },
          prerender: { enabled: false },
        },
      ],
      sitemap: {
        enabled: true,
        host: 'https://cardona.digital',
      },
    }),
    viteReact(),
  ],
})

export default config
