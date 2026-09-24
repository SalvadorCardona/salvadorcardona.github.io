import { Link, createFileRoute } from '@tanstack/react-router'

import { SITE_URL } from '../lib/seo'

/**
 * Ancienne adresse de l'agence, devenue l'accueil. GitHub Pages ne sait pas
 * rediriger : la page prérendue renvoie vers `/` par un `<meta refresh>`,
 * déclare `/` comme URL canonique et n'est pas indexée. Elle est déclarée à
 * la main dans `vite.config.ts`, plus rien ne pointant vers elle.
 */
export const Route = createFileRoute('/agence')({
  head: () => ({
    meta: [
      { title: 'Agence Cardona' },
      { name: 'robots', content: 'noindex' },
      { httpEquiv: 'refresh', content: '0; url=/' },
    ],
    links: [{ rel: 'canonical', href: `${SITE_URL}/` }],
  }),
  component: AgencyMoved,
})

function AgencyMoved() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-24 text-center">
      <p className="text-stone-600">
        L’agence a déménagé sur la page d’accueil.
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex rounded-full bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-600"
      >
        Aller à l’accueil
      </Link>
    </div>
  )
}
