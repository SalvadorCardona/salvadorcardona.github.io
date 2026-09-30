import { Link, createFileRoute } from '@tanstack/react-router'

import { seo } from '../lib/seo'

/**
 * Page 404 à adresse fixe, héritée de GitHub Pages. Depuis le passage en SSR,
 * une URL inconnue reçoit `NotFound` (`__root.tsx`) avec un statut 404 ;
 * `/404` reste joignable pour les liens qui y mènent déjà.
 */
export const Route = createFileRoute('/404')({
  head: () =>
    seo({
      title: 'Page introuvable',
      description: 'Cette page n’existe pas ou a été déplacée.',
      path: '/404',
    }),
  component: NotFoundPage,
})

function NotFoundPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-24 text-center">
      <p className="text-sm font-medium tracking-widest text-brand-600 uppercase">
        Erreur 404
      </p>
      <h1 className="mt-4 text-4xl font-bold tracking-tight text-stone-900">
        Cette page n’existe pas
      </h1>
      <p className="mt-4 text-stone-600">
        Le lien est peut-être obsolète, ou l’adresse comporte une faute de
        frappe.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          to="/"
          className="rounded-full bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-600"
        >
          Retour à l’accueil
        </Link>
        <Link
          to="/blog"
          className="rounded-full border border-stone-300 px-5 py-2.5 text-sm font-medium text-stone-700 transition-colors hover:border-stone-400 hover:bg-stone-50"
        >
          Voir le blog
        </Link>
      </div>
    </div>
  )
}
