import { createFileRoute } from '@tanstack/react-router'

/**
 * Sonde de santé du conteneur (`HEALTHCHECK` du Dockerfile, Dokploy) : ne
 * rend aucune page et ne touche à rien, elle dit seulement que Node répond.
 */
export const Route = createFileRoute('/healthz')({
  server: {
    handlers: {
      GET: () =>
        new Response('ok', {
          headers: { 'content-type': 'text/plain', 'cache-control': 'no-store' },
        }),
    },
  },
})
