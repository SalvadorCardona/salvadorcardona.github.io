import {
  HeadContent,
  Link,
  Scripts,
  createRootRoute,
} from '@tanstack/react-router'

import appCss from '../styles.css?url'
import { SiteHeader } from '../components/SiteHeader'
import { SiteFooter } from '../components/SiteFooter'
import { profile } from '../content/profile'
import { SITE_NAME, seo } from '../lib/seo'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'theme-color', content: '#020617' },
      ...seo({
        title: `${SITE_NAME} — Développeur web full-stack indépendant à Lyon`,
        description: profile.pitch,
        path: '/',
      }).meta,
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
      { rel: 'icon', href: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { rel: 'icon', href: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
    ],
    scripts: [
      {
        src: 'https://umami.cardona.digital/nx.js',
        defer: true,
        'data-website-id': '7c871d6e-78eb-4be4-99c6-634d4336cb8a',
        'data-domains': 'cardona.digital',
      },
    ],
  }),
  shellComponent: RootDocument,
  notFoundComponent: NotFound,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className="scroll-smooth">
      <head>
        <HeadContent />
      </head>
      <body className="bg-white text-slate-800 antialiased dark:bg-slate-950 dark:text-slate-200">
        <a
          href="#contenu"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-slate-900 focus:px-4 focus:py-2 focus:text-white"
        >
          Aller au contenu
        </a>
        <SiteHeader />
        <main id="contenu">{children}</main>
        <SiteFooter />
        <Scripts />
      </body>
    </html>
  )
}

function NotFound() {
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
      <Link
        to="/"
        className="mt-8 inline-flex rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
      >
        Retour à l’accueil
      </Link>
    </div>
  )
}
