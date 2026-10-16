import { createFileRoute } from '@tanstack/react-router'

/**
 * Ancienne adresse de la page « Qui suis-je », devenue « Notre équipe ». Elle
 * répond par une redirection permanente vers `/notre-equipe`.
 */
export const Route = createFileRoute('/qui-suis-je')({
  server: {
    handlers: {
      GET: () =>
        new Response(null, {
          status: 301,
          headers: { location: '/notre-equipe' },
        }),
    },
  },
})
