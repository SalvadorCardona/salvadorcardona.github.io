import { createFileRoute } from '@tanstack/react-router'

/**
 * Ancienne page Projets, fondue dans la section projets de « Qui suis-je ».
 * Les README des dépôts pointent encore sur `/projets` : l'adresse répond par
 * une redirection permanente, l'ancre dans `location` pour que le navigateur
 * descende jusqu'aux projets.
 */
export const Route = createFileRoute('/projets')({
  server: {
    handlers: {
      GET: () =>
        new Response(null, {
          status: 301,
          headers: { location: '/qui-suis-je#projets' },
        }),
    },
  },
})
