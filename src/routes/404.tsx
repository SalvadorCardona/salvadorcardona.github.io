import { Link, createFileRoute } from '@tanstack/react-router'

import { seo } from '../lib/seo'

/**
 * Page 404 servie par GitHub Pages.
 *
 * Pages n'a pas de règle de réécriture : toute URL sans fichier correspondant
 * tombe sur `/404.html` à la racine. Cette route est prérendue comme les
 * autres, puis `scripts/postbuild.mjs` déplace le HTML obtenu vers
 * `dist/client/404.html`.
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
      <p className="text-sm font-medium tracking-widest text-sky-600 uppercase dark:text-sky-400">
        Erreur 404
      </p>
      <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
        Cette page n’existe pas
      </h1>
      <p className="mt-4 text-slate-600 dark:text-slate-400">
        Le lien est peut-être obsolète, ou l’adresse comporte une faute de
        frappe.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          to="/"
          className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
        >
          Retour à l’accueil
        </Link>
        <Link
          to="/blog"
          className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-900"
        >
          Voir le blog
        </Link>
      </div>
    </div>
  )
}
