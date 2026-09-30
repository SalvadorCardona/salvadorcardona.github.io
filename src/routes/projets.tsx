import { Link, createFileRoute } from '@tanstack/react-router'

import { SITE_URL } from '../lib/seo'

/**
 * Ancienne page Projets, fondue dans la section projets de « Qui suis-je ».
 * Les README des dépôts pointent encore sur `/projets` : l'adresse doit
 * continuer de répondre, sans être indexée. Même renvoi que `/agence`.
 */
export const Route = createFileRoute('/projets')({
  head: () => ({
    meta: [
      { title: 'Projets — Salvador Cardona' },
      { name: 'robots', content: 'noindex' },
      { httpEquiv: 'refresh', content: '0; url=/qui-suis-je#projets' },
    ],
    links: [{ rel: 'canonical', href: `${SITE_URL}/qui-suis-je` }],
  }),
  component: ProjectsMoved,
})

function ProjectsMoved() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-24 text-center">
      <p className="text-stone-600">
        Les projets sont désormais sur la page « Qui suis-je ».
      </p>
      <Link
        to="/qui-suis-je"
        hash="projets"
        className="mt-6 inline-flex rounded-full bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-600"
      >
        Voir les projets
      </Link>
    </div>
  )
}
