import { Link, createFileRoute } from '@tanstack/react-router'

import { CallToAction } from '../components/ServicePage'
import { ServiceIcon } from '../components/ServiceIcon'
import type { AgencyOffer } from '../content/agency'
import { agency, commitments, faq, offers, steps } from '../content/agency'
import {
  PERSON_ID,
  SITE_URL,
  breadcrumbJsonLd,
  personJsonLd,
  seo,
} from '../lib/seo'

export const Route = createFileRoute('/agence')({
  head: () =>
    seo({
      title: `Agence ${agency.name} : site à 30 € et application à 100 € par mois`,
      description:
        'L’agence Cardona : votre présence web au forfait mensuel. Site vitrine à 30 € par mois, application métier sur mesure à 100 € par mois, création et maintenance comprises.',
      path: '/agence',
      jsonLd: [
        personJsonLd(),
        {
          '@context': 'https://schema.org',
          '@type': 'ProfessionalService',
          '@id': `${SITE_URL}/agence#agence`,
          name: `Agence ${agency.name}`,
          description: agency.pitch,
          url: `${SITE_URL}/agence`,
          founder: { '@id': PERSON_ID },
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Lyon',
            addressCountry: 'FR',
          },
          areaServed: 'France',
          priceRange: '30 € – 100 € / mois',
          makesOffer: offers.map((offer) => ({
            '@type': 'Offer',
            name: `${offer.name} — agence ${agency.name}`,
            description: offer.tagline,
            url: `${SITE_URL}/agence#${offer.id}`,
            availability: 'https://schema.org/InStock',
            seller: { '@id': PERSON_ID },
            priceSpecification: {
              '@type': 'UnitPriceSpecification',
              price: offer.price,
              priceCurrency: 'EUR',
              valueAddedTaxIncluded: false,
              // Un prix au mois : sans `referenceQuantity`, Google lirait 30 €
              // une bonne fois pour toutes.
              referenceQuantity: {
                '@type': 'QuantitativeValue',
                value: 1,
                unitCode: 'MON',
              },
            },
          })),
        },
        {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faq.map((item) => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: { '@type': 'Answer', text: item.answer },
          })),
        },
        breadcrumbJsonLd([
          { name: 'Accueil', path: '/' },
          { name: `Agence ${agency.name}`, path: '/agence' },
        ]),
      ],
    }),
  component: Agency,
})

/**
 * La même personne que le reste du site, présentée en agence : deux
 * abonnements à prix affiché, là où `/services` vend des missions au forfait.
 * Le contenu vit dans `content/agency.ts`.
 */
function Agency() {
  return (
    <div className="mx-auto max-w-5xl px-6">
      <header className="py-16 lg:py-20">
        <p className="text-sm font-medium tracking-widest text-sky-600 uppercase dark:text-sky-400">
          Agence {agency.name}
        </p>
        <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight text-balance text-slate-900 sm:text-5xl dark:text-slate-100">
          Votre présence web à partir de 30 € par mois
        </h1>
        <p className="mt-6 max-w-2xl text-xl leading-relaxed text-pretty text-slate-600 dark:text-slate-400">
          {agency.lead}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/contact"
            className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
          >
            Demander un appel
          </Link>
          <a
            href="#forfaits"
            className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-900"
          >
            Voir les deux forfaits
          </a>
        </div>
      </header>

      <section id="forfaits" className="scroll-mt-24 pb-12">
        <h2 className="sr-only">Les deux forfaits</h2>
        <div className="grid gap-5 lg:grid-cols-2">
          {offers.map((offer) => (
            <OfferCard key={offer.id} offer={offer} />
          ))}
        </div>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {commitments.map((item) => (
            <li
              key={item}
              className="flex gap-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400"
            >
              <Check />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <Section id="agence" title={`L’agence ${agency.name}`}>
        <div className="space-y-5 text-lg leading-relaxed text-pretty text-slate-600 dark:text-slate-400">
          {agency.about.map((paragraph) => (
            <p key={paragraph.slice(0, 40)}>{paragraph}</p>
          ))}
        </div>
        <p className="mt-6 text-sm">
          <Link
            to="/services"
            className="font-medium text-sky-600 hover:underline dark:text-sky-400"
          >
            Les prestations au forfait et en régie →
          </Link>
        </p>
      </Section>

      <Section id="deroulement" title="Comment ça se passe">
        <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <li key={step.title}>
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-sky-600 text-sm font-semibold text-white dark:bg-sky-500 dark:text-slate-950">
                {index + 1}
              </span>
              <h3 className="mt-4 font-semibold text-slate-900 dark:text-slate-100">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </Section>

      <Section id="faq" title="Questions fréquentes">
        <div className="divide-y divide-slate-200 rounded-2xl border border-slate-200 dark:divide-slate-800 dark:border-slate-800">
          {faq.map((item) => (
            <details key={item.question} className="group px-6 py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-slate-900 dark:text-slate-100">
                {item.question}
                <span
                  aria-hidden="true"
                  className="text-slate-400 transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="mt-3 leading-relaxed text-slate-600 dark:text-slate-400">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </Section>

      <CallToAction />
    </div>
  )
}

/** Un forfait : son prix, ce qu'il couvre, et pour qui il est fait. */
function OfferCard({ offer }: { offer: AgencyOffer }) {
  return (
    <article
      id={offer.id}
      className="flex scroll-mt-24 flex-col rounded-2xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-900/60"
    >
      <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-sky-600 ring-1 ring-sky-100 dark:bg-sky-950/60 dark:text-sky-400 dark:ring-sky-900">
        <ServiceIcon name={offer.icon} />
      </span>
      <h3 className="mt-5 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
        {offer.name}
      </h3>
      <p className="mt-2 leading-relaxed text-slate-600 dark:text-slate-400">
        {offer.tagline}
      </p>

      <p className="mt-6 flex items-baseline gap-2">
        <span className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          {offer.price} €
        </span>
        <span className="text-sm text-slate-500 dark:text-slate-400">
          {offer.priceNote}
        </span>
      </p>
      <p className="mt-1 text-xs text-slate-500 dark:text-slate-500">
        Hors taxes, engagement d’un an puis mois par mois. {offer.delivery}
      </p>

      <h4 className="mt-8 text-xs font-medium tracking-wide text-slate-500 uppercase dark:text-slate-500">
        Pour qui
      </h4>
      <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
        {offer.forWho}
      </p>

      <h4 className="mt-6 text-xs font-medium tracking-wide text-slate-500 uppercase dark:text-slate-500">
        Ce qui est compris
      </h4>
      <ul className="mt-3 flex-1 space-y-2.5">
        {offer.includes.map((item) => (
          <li
            key={item}
            className="flex gap-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300"
          >
            <Check />
            <span>{item}</span>
          </li>
        ))}
      </ul>

      <Link
        to="/contact"
        className="mt-8 rounded-lg bg-slate-900 px-5 py-2.5 text-center text-sm font-medium text-white transition-colors hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
      >
        Choisir le forfait {offer.name}
      </Link>
    </article>
  )
}

function Section({
  id,
  title,
  children,
}: {
  id: string
  title: string
  children: React.ReactNode
}) {
  return (
    <section
      id={id}
      className="scroll-mt-24 border-t border-slate-200 py-12 lg:grid lg:grid-cols-[14rem_1fr] lg:gap-10 dark:border-slate-800"
    >
      <h2 className="mb-6 text-lg font-semibold tracking-tight text-slate-900 lg:mb-0 dark:text-slate-100">
        {title}
      </h2>
      <div>{children}</div>
    </section>
  )
}

function Check() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="mt-0.5 h-5 w-5 shrink-0 text-sky-600 dark:text-sky-400"
    >
      <path d="m5 10.5 3 3 7-7" />
    </svg>
  )
}
