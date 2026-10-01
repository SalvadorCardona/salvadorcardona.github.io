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
 * Déclarer une instance remplace les middlewares par défaut de Start : la
 * protection CSRF des server functions (le formulaire de contact) est donc
 * redéclarée, avec le même filtre.
 */
export const startInstance = createStart(() => ({
  requestMiddleware: [
    createCsrfMiddleware({ filter: (ctx) => ctx.handlerType === 'serverFn' }),
    trailingSlashMiddleware,
  ],
}))
