import { createCsrfMiddleware, createMiddleware, createStart } from '@tanstack/react-start'

/**
 * Le routeur ramène `/blog/` sur `/blog` par une redirection temporaire (307),
 * sans option pour la rendre permanente : on la fait ici, en 301, avant lui.
 */
const trailingSlashMiddleware = createMiddleware().server(({ request, next }) => {
  const url = new URL(request.url)
  if (url.pathname === '/' || !url.pathname.endsWith('/')) return next()
  return new Response(null, {
    status: 301,
    headers: { location: (url.pathname.replace(/\/+$/, '') || '/') + url.search },
  })
})

/**
 * Content-Security-Policy du site, posée sur chaque réponse de Start (pages,
 * server functions, routes serveur).
 *
 * Les scripts inline de TanStack Start (hydratation, données des loaders) ne
 * peuvent pas être hachés : leur contenu change à chaque page. Un nonce est
 * donc tiré à chaque requête et transmis au routeur (`ssr.nonce`, voir
 * `router.tsx`), qui le pose sur ses balises et dans `<meta
 * property="csp-nonce">`, d'où le client le relit. Les blocs JSON-LD ne sont
 * pas exécutés : la CSP ne les concerne pas.
 *
 * Origines externes autorisées : Umami (`nx.js` et la collecte sur `/api/nx`)
 * et Cloudflare Turnstile sur `/contact` (script et iframe du widget). Les
 * styles inline restent permis : React rend l'attribut `style` en dur.
 *
 * Les autres en-têtes de sécurité, valables aussi pour les fichiers statiques,
 * sont dans les `routeRules` de `vite.config.ts`. Les sous-sites GitHub Pages
 * (`/whisper-desk/`…) ne passent pas par ce serveur : ils n'en héritent pas.
 *
 * En développement, Vite injecte ses propres scripts inline sans nonce : la
 * CSP n'est posée qu'en production.
 */
const UMAMI = 'https://umami.cardona.digital'
const TURNSTILE = 'https://challenges.cloudflare.com'

function contentSecurityPolicy(nonce: string) {
  return [
    `default-src 'self'`,
    `script-src 'self' 'nonce-${nonce}' ${UMAMI} ${TURNSTILE}`,
    `style-src 'self' 'unsafe-inline'`,
    `img-src 'self' data:`,
    `font-src 'self'`,
    `media-src 'self'`,
    `connect-src 'self' ${UMAMI}`,
    `frame-src ${TURNSTILE}`,
    `object-src 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`,
    `frame-ancestors 'none'`,
  ].join('; ')
}

const securityHeaders = createMiddleware().server(async ({ next }) => {
  const nonce = btoa(
    String.fromCharCode(...crypto.getRandomValues(new Uint8Array(16))),
  )
  const result = await next({ context: { nonce } })
  if (!import.meta.env.DEV) {
    result.response.headers.set(
      'Content-Security-Policy',
      contentSecurityPolicy(nonce),
    )
  }
  return result
})

/**
 * Déclarer une instance remplace les middlewares par défaut de Start : la
 * protection CSRF des server functions (le formulaire de contact) est donc
 * redéclarée, avec le même filtre.
 */
export const startInstance = createStart(() => ({
  requestMiddleware: [
    createCsrfMiddleware({ filter: (ctx) => ctx.handlerType === 'serverFn' }),
    trailingSlashMiddleware,
    securityHeaders,
  ],
}))
