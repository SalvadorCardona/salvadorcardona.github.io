import { createRouter as createTanStackRouter } from '@tanstack/react-router'
import { getGlobalStartContext } from '@tanstack/react-start'
import { routeTree } from './routeTree.gen'

export function getRouter() {
  const router = createTanStackRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreload: 'intent',
    defaultPreloadStaleTime: 0,
    // Nonce de la CSP, tiré par requête dans `start.ts`. Côté client,
    // `getGlobalStartContext` renvoie `undefined` et le routeur relit le nonce
    // dans `<meta property="csp-nonce">`.
    ssr: { nonce: getGlobalStartContext()?.nonce },
  })

  return router
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
