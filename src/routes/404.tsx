import { createFileRoute } from '@tanstack/react-router'

/**
 * Page 404 à adresse fixe, héritée de GitHub Pages. Une URL inconnue reçoit
 * `NotFound` (`__root.tsx`) avec un statut 404 ; `/404` renvoie vers l'accueil
 * les liens qui y mènent encore, plutôt que de répondre 200.
 */
export const Route = createFileRoute('/404')({
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
