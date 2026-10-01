import { createFileRoute } from '@tanstack/react-router'

/**
 * Ancienne adresse de l'agence, devenue l'accueil. Elle répond par une
 * redirection permanente vers `/`.
 */
export const Route = createFileRoute('/agence')({
  server: {
    handlers: {
      GET: () =>
        new Response(null, {
          status: 301,
          headers: { location: '/' },
        }),
    },
  },
})
