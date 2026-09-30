import { createFileRoute } from '@tanstack/react-router'

/**
 * Ancienne page de réservation en ligne, abandonnée : l'appel découverte
 * se demande maintenant par une case du formulaire de contact. L'adresse a
 * été partagée, elle répond donc par une redirection permanente vers
 * `/contact`, la case déjà cochée.
 */
export const Route = createFileRoute('/rendez-vous')({
  server: {
    handlers: {
      GET: () =>
        new Response(null, {
          status: 301,
          headers: { location: '/contact?appel=1' },
        }),
    },
  },
})
