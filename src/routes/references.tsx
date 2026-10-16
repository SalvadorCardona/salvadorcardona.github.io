import { createFileRoute } from '@tanstack/react-router'

import { ReferenceCard } from '../components/ReferenceCard'
import { CallToAction } from '../components/ServicePage'
import { clients } from '../content/profile'
import { references } from '../content/references'
import { breadcrumbJsonLd, seo } from '../lib/seo'

export const Route = createFileRoute('/references')({
  head: () =>
    seo({
      title: 'Références et études de cas : Symfony, React et IA',
      description:
        'Les références de l’agence Hermez : streaming de TF1 et M6, marketplaces B2B et e-commerce, plateforme avec agents IA. Problème, solution, résultat.',
      path: '/references',
      jsonLd: [
        breadcrumbJsonLd([
          { name: 'Accueil', path: '/' },
          { name: 'Références', path: '/references' },
        ]),
      ],
    }),
  component: References,
})

/** Les études de cas de `content/references.ts`, sous les logos des clients. */
function References() {
  return (
    <div className="mx-auto max-w-5xl px-6">
      <header className="py-16 lg:py-20">
        <p className="text-sm font-medium tracking-widest text-brand-600 uppercase">
          Références
        </p>
        <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight text-balance text-stone-900 sm:text-5xl">
          Des applications en production, pour des marques exigeantes
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-pretty text-stone-600">
          Treize ans de projets web, des grands comptes aux start-up. Pour
          chaque mission : le problème posé, ce que nous avons construit, et
          ce qui a changé.
        </p>

        <p className="mt-10 text-sm font-semibold text-stone-500">
          Notre équipe a travaillé pour
        </p>
        <ul className="mt-3 flex flex-wrap items-center gap-x-7 gap-y-4">
          {clients.map((client) => (
            <li key={client.name}>
              <img
                src={client.logo}
                alt={client.name}
                width={client.width}
                height={client.height}
                className="opacity-70"
              />
            </li>
          ))}
        </ul>
      </header>

      <section aria-labelledby="etudes-de-cas" className="border-t border-stone-200 py-12">
        <h2
          id="etudes-de-cas"
          className="text-lg font-semibold tracking-tight text-stone-900"
        >
          Études de cas
        </h2>
        <ul className="mt-6 grid gap-5 lg:grid-cols-2">
          {references.map((reference) => (
            <li key={reference.id} className="flex">
              <ReferenceCard reference={reference} />
            </li>
          ))}
        </ul>
      </section>

      <CallToAction />
    </div>
  )
}
