import {
  HeadContent,
  Link,
  Scripts,
  createRootRoute,
} from '@tanstack/react-router'

import appCss from '../styles.css?url'
import { SiteHeader } from '../components/SiteHeader'
import { SiteFooter } from '../components/SiteFooter'
import { agency } from '../content/agency'
import { seo } from '../lib/seo'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'theme-color', content: '#ffffff' },
      ...seo({
        title: `${agency.name} — ${agency.tagline}`,
        description: agency.pitch,
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
      <body className="bg-white text-stone-800 antialiased">
        <a
          href="#contenu"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-stone-900 focus:px-4 focus:py-2 focus:text-white"
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
      <Link
        to="/"
        className="mt-8 inline-flex rounded-full bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-600"
      >
        Retour à l’accueil
      </Link>
    </div>
  )
}
