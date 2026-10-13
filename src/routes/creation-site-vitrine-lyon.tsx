import { Link, createFileRoute } from '@tanstack/react-router'

import type { AgencyWork } from '../content/agency'
import { agency, offers, works } from '../content/agency'
import { vitrineLyon } from '../content/vitrine-lyon'
import {
  SITE_URL,
  agencyJsonLd,
  breadcrumbJsonLd,
  seo,
} from '../lib/seo'

const offer = offers.find((item) => item.id === 'vitrine')!
const examples = works.filter((work) =>
  vitrineLyon.workImages.includes(work.image),
)

const NAME = 'Création de site vitrine à Lyon'

export const Route = createFileRoute('/creation-site-vitrine-lyon')({
  head: () =>
    seo({
      title: vitrineLyon.title,
      description: vitrineLyon.description,
      path: vitrineLyon.path,
      jsonLd: [
        {
          '@context': 'https://schema.org',
          '@type': 'Service',
          '@id': `${SITE_URL}${vitrineLyon.path}#service`,
          name: NAME,
          serviceType: 'Création de site vitrine',
          description: vitrineLyon.description,
          url: `${SITE_URL}${vitrineLyon.path}`,
          provider: agencyJsonLd(),
          areaServed: [
            { '@type': 'City', name: 'Lyon' },
            { '@type': 'AdministrativeArea', name: 'Métropole de Lyon' },
          ],
          offers: {
            '@type': 'Offer',
            name: `Abonnement ${offer.name}`,
            url: `${SITE_URL}${vitrineLyon.path}`,
            price: String(offer.price),
            priceCurrency: 'EUR',
            priceSpecification: {
              '@type': 'UnitPriceSpecification',
              price: String(offer.price),
              priceCurrency: 'EUR',
              unitCode: 'MON',
              unitText: 'mois',
              valueAddedTaxIncluded: false,
            },
            availability: 'https://schema.org/InStock',
          },
          availableChannel: {
            '@type': 'ServiceChannel',
            serviceUrl: `${SITE_URL}/contact`,
            availableLanguage: ['fr'],
          },
        },
        {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: vitrineLyon.faq.map((item) => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: { '@type': 'Answer', text: item.answer },
          })),
        },
        breadcrumbJsonLd([
          { name: 'Accueil', path: '/' },
          { name: NAME, path: vitrineLyon.path },
        ]),
      ],
    }),
  component: VitrineLyonPage,
})

function VitrineLyonPage() {
  return (
    <div className="mx-auto max-w-5xl px-6">
      <nav aria-label="Fil d’Ariane" className="pt-8 text-sm">
        <ol className="flex flex-wrap items-center gap-2 text-stone-500">
          <li>
            <Link to="/" className="transition-colors hover:text-brand-600">
              Accueil
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-stone-900">
            {NAME}
          </li>
        </ol>
      </nav>

      <header className="py-10 lg:py-16">
        <p className="text-sm font-medium tracking-widest text-brand-600 uppercase">
          Agence {agency.name} · Lyon et métropole
        </p>
        <h1 className="mt-4 max-w-3xl text-3xl font-bold tracking-tight text-balance text-stone-900 sm:text-4xl lg:text-5xl">
          {NAME}, {offer.price} € HT par mois
        </h1>
        <p className="mt-6 max-w-3xl text-xl leading-relaxed text-pretty text-stone-600">
          {vitrineLyon.lead}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/contact"
            search={{ forfait: offer.id }}
            data-umami-event="cta-contact"
            data-umami-event-page={vitrineLyon.path}
            data-umami-event-emplacement="haut-de-page"
            className="rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
          >
            Parler de votre site
          </Link>
          <a
            href="#abonnement"
            className="rounded-full border border-stone-300 px-5 py-2.5 text-sm font-medium text-stone-700 transition-colors hover:border-stone-400 hover:bg-stone-50"
          >
            Ce que comprend l’abonnement
          </a>
        </div>
      </header>

      <Section id="pour-qui" title="Pour qui">
        <ul className="grid gap-4 sm:grid-cols-2">
          {vitrineLyon.forWho.map((item) => (
            <li
              key={item}
              className="flex gap-3 rounded-xl border border-stone-200 p-4 text-sm leading-relaxed text-stone-700"
            >
              <Check />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="abonnement" title="Ce que comprend l’abonnement">
        <p className="flex flex-wrap items-baseline gap-x-2">
          <span className="text-4xl font-extrabold tracking-tight text-stone-900">
            {offer.price} € HT
          </span>
          <span className="text-stone-500">{offer.priceNote}</span>
        </p>
        <p className="mt-2 text-sm text-stone-500">
          Sans frais de mise en route, sans engagement.
        </p>
        <ul className="mt-6 space-y-3">
          {offer.includes.map((item) => (
            <li key={item} className="flex gap-3 text-stone-700">
              <Check />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="delai" title="Le délai">
        <p className="text-lg leading-relaxed text-pretty text-stone-600">
          {offer.delivery} Un appel d’une heure pour comprendre votre activité,
          une maquette validée avant d’écrire la moindre ligne, puis la mise en
          ligne : domaine, hébergement et référencement sont pris en charge.
        </p>
      </Section>

      <Section id="exemples" title="Des exemples réels">
        <ul className="grid gap-6 sm:grid-cols-2">
          {examples.map((work) => (
            <li key={work.image}>
              <a
                href={work.url}
                target="_blank"
                rel="noopener"
                className="group block overflow-hidden rounded-2xl border border-stone-200 transition-colors hover:border-stone-300"
              >
                <Shot work={work} />
                <span className="block p-4 text-sm">
                  <span className="font-semibold text-stone-900">
                    {work.name}
                  </span>
                  <span className="text-stone-500"> · {work.kind}</span>
                  <span aria-hidden="true" className="text-brand-600">
                    {' '}
                    ↗
                  </span>
                  <span className="sr-only"> (nouvel onglet)</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="zone" title="Lyon et sa métropole">
        <p className="text-lg leading-relaxed text-pretty text-stone-600">
          Même abonnement, même prix, où que vous soyez dans la métropole de
          Lyon :
        </p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {vitrineLyon.cities.map((city) => (
            <li
              key={city}
              className="rounded-full bg-stone-100 px-3 py-1 text-sm text-stone-700"
            >
              {city}
            </li>
          ))}
        </ul>
      </Section>

      <Section id="faq" title="Questions fréquentes">
        <div className="divide-y divide-stone-200 rounded-2xl border border-stone-200">
          {vitrineLyon.faq.map((item) => (
            <details key={item.question} className="group px-6 py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-stone-900">
                {item.question}
                <span
                  aria-hidden="true"
                  className="text-stone-400 transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="mt-3 leading-relaxed text-stone-600">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </Section>

      <section className="my-12 rounded-3xl bg-brand-600 px-8 py-12 text-white sm:px-12">
        <h2 className="text-2xl font-bold tracking-tight text-balance sm:text-3xl">
          Un site vitrine pour votre activité à Lyon ?
        </h2>
        <p className="mt-4 max-w-2xl text-pretty text-white">
          Un premier échange d’une heure, gratuit et sans engagement, pour
          comprendre votre activité et vous dire ce que l’agence peut faire.
          À Lyon ou à distance.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/contact"
            search={{ forfait: offer.id }}
            data-umami-event="cta-contact"
            data-umami-event-page={vitrineLyon.path}
            data-umami-event-emplacement="bas-de-page"
            className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-brand-700 transition-colors hover:bg-brand-50"
          >
            Parler de votre site
          </Link>
          <Link
            to="/contact"
            search={{ appel: 1, forfait: offer.id }}
            data-umami-event="cta-contact"
            data-umami-event-page={vitrineLyon.path}
            data-umami-event-emplacement="bas-de-page"
            data-umami-event-appel="oui"
            className="rounded-full border border-white/50 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:border-white hover:bg-white/10"
          >
            Demander un appel découverte
          </Link>
        </div>
      </section>
    </div>
  )
}

/** Une capture de `works`, en AVIF puis WebP, comme sur l'accueil. */
function Shot({ work }: { work: AgencyWork }) {
  const widths = work.format === 'desktop' ? [480, 800] : [180, 360]
  const srcSet = (format: string) =>
    widths
      .map((width) => `/realisations/${work.image}-${width}.${format} ${width}w`)
      .join(', ')
  const sizes = '(min-width: 640px) 400px, 100vw'
  return (
    <div
      className={`flex bg-stone-100 ${work.format === 'mobile' ? 'justify-center py-4' : ''}`}
    >
      <picture className="contents">
        <source type="image/avif" srcSet={srcSet('avif')} sizes={sizes} />
        <source type="image/webp" srcSet={srcSet('webp')} sizes={sizes} />
        <img
          src={`/realisations/${work.image}-${widths[1]}.webp`}
          width={widths[1]}
          height={work.format === 'desktop' ? widths[1] * (7 / 8) : widths[1] * 2}
          alt={work.alt}
          loading="lazy"
          decoding="async"
          className={
            work.format === 'desktop'
              ? 'aspect-[8/7] w-full object-cover object-top'
              : 'h-72 w-auto rounded-xl object-contain'
          }
        />
      </picture>
    </div>
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
      className="scroll-mt-24 border-t border-stone-200 py-12 lg:grid lg:grid-cols-[14rem_1fr] lg:gap-10"
    >
      <h2 className="mb-6 text-lg font-semibold tracking-tight text-stone-900 lg:mb-0">
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
      className="mt-0.5 h-5 w-5 shrink-0 text-brand-600"
    >
      <path d="m5 10.5 3 3 7-7" />
    </svg>
  )
}
