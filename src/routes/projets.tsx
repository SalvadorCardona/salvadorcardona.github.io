import { createFileRoute } from '@tanstack/react-router'

/**
 * Ancienne page Projets. Les README des dépôts pointent encore sur
 * `/projets` : l'adresse répond par une redirection permanente vers la
 * section open source de l'accueil.
 */
export const Route = createFileRoute('/projets')({
  server: {
    handlers: {
      GET: () =>
        new Response(null, {
          status: 301,
          headers: { location: '/#open-source' },
        }),
    },
  },
})
