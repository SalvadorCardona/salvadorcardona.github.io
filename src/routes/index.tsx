import { useEffect, useRef, useState } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'

import { LogoMark } from '../components/Logo'
import { ServiceIcon } from '../components/ServiceIcon'
import type {
  AgencyExpertise,
  AgencyOffer,
  AgencyWork,
} from '../content/agency'
import {
  agency,
  audiences,
  commitments,
  expertises,
  faq,
  figures,
  offers,
  steps,
  techSkills,
  works,
} from '../content/agency'
import { clients, links, profile } from '../content/profile'
import { servicePath } from '../content/services'
import {
  AGENCY_ID,
  PERSON_ID,
  SITE_URL,
  personJsonLd,
  seo,
} from '../lib/seo'

export const Route = createFileRoute('/')({
  head: () =>
    seo({
      title: `${agency.name} — ${agency.tagline}`,
      description: agency.pitch,
      path: '/',
      jsonLd: [
        personJsonLd(),
        {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          '@id': `${SITE_URL}/#website`,
          url: SITE_URL,
          name: `Agence ${agency.name}`,
          inLanguage: 'fr-FR',
          publisher: { '@id': AGENCY_ID },
        },
        {
          '@context': 'https://schema.org',
          '@type': 'ProfessionalService',
          '@id': AGENCY_ID,
          name: `Agence ${agency.name}`,
          slogan: agency.tagline,
          description: agency.pitch,
          url: SITE_URL,
          email: links.email,
          // Google n'accepte qu'un logo raster d'au moins 112 px : le PNG est
          // tiré de `public/logo.svg`.
          logo: `${SITE_URL}/logo.png`,
          image: `${SITE_URL}/og/cardona.png`,
          sameAs: [links.linkedin, links.github],
          founder: { '@id': PERSON_ID },
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Lyon',
            addressCountry: 'FR',
          },
          // Lyon d'abord, pour le référencement local ; la France pour le
          // travail à distance.
          areaServed: [
            { '@type': 'City', name: 'Lyon' },
            { '@type': 'AdministrativeArea', name: 'Métropole de Lyon' },
            { '@type': 'AdministrativeArea', name: 'Auvergne-Rhône-Alpes' },
            { '@type': 'Country', name: 'France' },
          ],
          priceRange: '30 € – 100 € / mois',
          makesOffer: offers.map((offer) => ({
            '@type': 'Offer',
            name: `${offer.name} — agence ${agency.name}`,
            description: offer.tagline,
            url: `${SITE_URL}/#${offer.id}`,
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
          '@type': 'VideoObject',
          name: VIDEO.title,
          description: VIDEO.description,
          thumbnailUrl: `${SITE_URL}${VIDEO.thumbnail}`,
          contentUrl: `${SITE_URL}${VIDEO.src}`,
          uploadDate: '2026-09-29',
          duration: 'PT1M1S',
          inLanguage: 'fr',
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
      ],
    }),
  component: Home,
})

/**
 * L'accueil, c'est l'agence : deux abonnements à prix affiché, là où
 * `/services` vend des missions au forfait et `/qui-suis-je` présente le
 * fondateur. Le contenu vit dans `content/agency.ts`.
 *
 * Le mouvement (halos, bandeau défilant, badge qui tourne) est décoratif,
 * en CSS, et entièrement derrière `motion-safe:` ; seule la pile de cartes
 * du hero (`WorkDeck`) a un minuteur, qui ne démarre pas non plus avec
 * « réduire les animations ».
 */
function Home() {
  return (
    <>
      <Hero />
      <Marquee />

      <div className="mx-auto max-w-6xl px-6">
        <Audiences />
        <Showreel />
        <Expertises />
        <Figures />
        <Offers />
        <Method />
        <About />
        <Faq />
      </div>

      <FinalCall />
    </>
  )
}

function Hero() {
  return (
    <section className="relative mx-auto max-w-6xl px-6 pt-12 pb-20 max-lg:overflow-x-clip sm:pt-20 lg:pb-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -right-40 -left-40 -z-10 h-[44rem]"
      >
        {/* Trame de points, fondue vers le bas. */}
        <div className="absolute inset-0 bg-[radial-gradient(var(--color-stone-300)_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] opacity-60 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent)]" />
        <div className="absolute top-0 right-0 h-[32rem] w-[32rem] rounded-full bg-brand-200/60 blur-3xl motion-safe:animate-hero-drift" />
        <div className="absolute top-72 left-10 h-72 w-72 rounded-full bg-amber-100/80 blur-3xl motion-safe:animate-hero-drift-slow" />
      </div>

      <div className="grid items-center gap-16 lg:grid-cols-[1.25fr_1fr]">
        <div>
          <h1 className="text-5xl leading-[0.98] font-extrabold tracking-tight text-balance text-stone-900 motion-safe:animate-hero-rise motion-safe:[animation-delay:100ms] sm:text-6xl lg:text-7xl">
            On fait parler{' '}
            <span className="relative inline-block whitespace-nowrap text-brand-500">
              de vous
              <Scribble />
            </span>
            , même quand vous dormez.
          </h1>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-pretty text-stone-600 motion-safe:animate-hero-rise motion-safe:[animation-delay:200ms] sm:text-xl">
            {agency.lead}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3 motion-safe:animate-hero-rise motion-safe:[animation-delay:300ms]">
            <Link
              to="/contact"
              data-umami-event="cta-contact"
              data-umami-event-page="/"
              data-umami-event-emplacement="haut-de-page"
              className="group inline-flex items-center gap-2 rounded-full bg-brand-600 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-brand-500/25 transition-all hover:-translate-y-0.5 hover:bg-brand-700 hover:shadow-xl hover:shadow-brand-500/30"
            >
              Parler de votre projet
              <span
                aria-hidden="true"
                className="transition-transform group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
            <a
              href="#forfaits"
              data-umami-event="cta-forfaits"
              data-umami-event-page="/"
              data-umami-event-emplacement="haut-de-page"
              className="rounded-full border border-stone-300 bg-white/60 px-6 py-3.5 text-base font-semibold text-stone-800 transition-all hover:-translate-y-0.5 hover:border-stone-400 hover:bg-white"
            >
              Voir les forfaits
            </a>
          </div>

          <div className="mt-10 motion-safe:animate-hero-rise motion-safe:[animation-delay:350ms]">
            <p className="text-sm font-semibold text-stone-500">
              Ils m’ont fait confiance
            </p>
            <ul className="mt-3 flex flex-wrap items-center gap-x-7 gap-y-4">
              {clients.map((client) => (
                <li key={client.name}>
                  <img
                    src={client.logo}
                    alt={client.name}
                    width={client.width}
                    height={client.height}
                    className="opacity-60 transition-opacity duration-300 hover:opacity-100"
                  />
                </li>
              ))}
            </ul>
          </div>

          <p className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-stone-500 motion-safe:animate-hero-rise motion-safe:[animation-delay:400ms]">
            <span>Premier appel offert</span>
            <span aria-hidden="true" className="text-brand-400">
              ✦
            </span>
            <span>Réponse sous deux jours ouvrés</span>
            <span aria-hidden="true" className="text-brand-400">
              ✦
            </span>
            <span>Basé à Lyon</span>
          </p>
        </div>

        <HeroVisual />
      </div>
    </section>
  )
}

/** Le trait « à la main » sous le mot clé du titre. */
function Scribble() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 300 24"
      preserveAspectRatio="none"
      className="absolute -bottom-3 left-0 h-4 w-full text-brand-300"
    >
      <path
        d="M4 16C60 6 140 4 296 12M40 20c70-6 150-8 220-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
      />
    </svg>
  )
}

/**
 * La composition à droite du titre : la pile de cartes des réalisations, un
 * badge circulaire qui tourne et deux étiquettes qui reprennent les promesses.
 */
function HeroVisual() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[21rem] motion-safe:animate-hero-rise motion-safe:[animation-delay:250ms] sm:max-w-sm lg:max-w-md">
      <div
        aria-hidden="true"
        className="absolute inset-8 rotate-6 rounded-[3rem] bg-amber-200/70"
      />
      <WorkDeck />

      <div
        aria-hidden="true"
        className="absolute -top-4 -right-4 z-40 h-28 w-28 rounded-full bg-white p-1 shadow-xl shadow-stone-300/50 sm:-top-2 sm:-right-2 sm:h-36 sm:w-36"
      >
        <svg
          viewBox="0 0 120 120"
          className="h-full w-full motion-safe:animate-spin-slow"
        >
          <defs>
            <path
              id="badge-circle"
              d="M60 60m-44 0a44 44 0 1 1 88 0a44 44 0 1 1-88 0"
            />
          </defs>
          <text className="fill-stone-900 font-display text-[10.5px] font-bold tracking-[0.2em] uppercase">
            <textPath href="#badge-circle" textLength="272">
              Agence digitale ✦ Made in Lyon ✦
            </textPath>
          </text>
        </svg>
        <span className="absolute inset-0 m-auto h-5 w-5 rounded-full bg-brand-500" />
      </div>

      <div
        aria-hidden="true"
        className="absolute top-[40%] -left-3 z-40 rounded-2xl bg-white px-3 py-2 shadow-xl shadow-stone-300/50 sm:-left-10 sm:px-4 sm:py-3"
      >
        <p className="flex items-center gap-2 text-xs font-semibold text-stone-900 sm:text-sm">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-[10px] text-emerald-700 sm:h-6 sm:w-6 sm:text-xs">
            ✓
          </span>
          Site en ligne
        </p>
        <p className="mt-0.5 pl-7 text-[11px] text-stone-500 sm:pl-8 sm:text-xs">
          en deux semaines
        </p>
      </div>

      <div
        aria-hidden="true"
        className="absolute -right-3 bottom-20 z-40 rounded-2xl bg-stone-900 px-3 py-2 text-white shadow-xl sm:-right-8 sm:bottom-24 sm:px-4 sm:py-3"
      >
        <p className="font-display text-xl leading-none font-extrabold sm:text-2xl">
          30 €
          <span className="text-xs font-medium text-stone-300 sm:text-sm">
            {' '}
            / mois
          </span>
        </p>
        <p className="mt-1 text-[11px] text-stone-300 sm:text-xs">
          création comprise
        </p>
      </div>
    </div>
  )
}

/** Délai entre deux cartes de la pile. */
const DECK_INTERVAL = 3200

/**
 * Position d'une carte selon son rang dans la pile (0 = dessus). Au-delà de
 * la troisième, les cartes attendent derrière, invisibles.
 */
const DECK_POSES = [
  'rotate(-3deg)',
  'translate3d(5%, -3%, 0) rotate(4deg) scale(0.95)',
  'translate3d(-4%, -6%, 0) rotate(-8deg) scale(0.9)',
]
const DECK_HIDDEN = 'translate3d(0, -4%, 0) rotate(3deg) scale(0.86)'

/**
 * La pile de cartes du hero : les captures de `works`, qui défilent toutes
 * les ~3 s — la carte du dessus glisse sur le côté et repart derrière la
 * pile (`animate-deck-out`). Le défilement s'arrête au survol et au focus,
 * et ne démarre pas du tout avec « réduire les animations » : la pile reste
 * fixe, les points permettent encore de changer de carte.
 *
 * Seule la première capture est chargée en priorité ; les autres, en différé.
 */
function WorkDeck() {
  const [active, setActive] = useState(0)
  const [leaving, setLeaving] = useState<number | null>(null)
  const [paused, setPaused] = useState(false)

  function show(index: number) {
    if (index === active) return
    setLeaving(active)
    setActive(index)
  }

  useEffect(() => {
    if (paused) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const timer = window.setTimeout(
      () => show((active + 1) % works.length),
      DECK_INTERVAL,
    )
    return () => window.clearTimeout(timer)
  }, [active, paused])

  return (
    <div
      role="region"
      aria-roledescription="carrousel"
      aria-label="Nos réalisations"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className="absolute inset-0"
    >
      <div className="absolute inset-8">
        {works.map((work, index) => {
          const rank = (index - active + works.length) % works.length
          const isTop = rank === 0
          return (
            <a
              key={work.image}
              href={work.url}
              target="_blank"
              rel="noopener"
              aria-hidden={isTop ? undefined : true}
              tabIndex={isTop ? undefined : -1}
              aria-label={`${work.name} — ${work.kind} (nouvel onglet)`}
              style={{
                transform: DECK_POSES[rank] ?? DECK_HIDDEN,
                opacity: rank < DECK_POSES.length ? 1 : 0,
                zIndex: 20 - Math.min(rank, 10),
              }}
              className={`group absolute inset-0 overflow-hidden rounded-[3rem] shadow-2xl shadow-stone-900/15 ring-1 ring-stone-900/5 focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-brand-500 motion-safe:transition-[transform,opacity] motion-safe:duration-700 motion-safe:ease-[cubic-bezier(0.22,1,0.36,1)] ${
                isTop ? '' : 'pointer-events-none'
              } ${index === leaving ? 'motion-safe:animate-deck-out' : ''}`}
            >
              {work.format === 'desktop' ? (
                <BrowserShot work={work} priority={index === 0} />
              ) : (
                <PhoneShot work={work} priority={index === 0} />
              )}
              <span className="absolute bottom-5 left-6 flex items-center gap-2 rounded-full bg-white/90 py-1.5 pr-3 pl-3.5 text-xs font-semibold whitespace-nowrap text-stone-900 shadow-lg shadow-stone-900/10 backdrop-blur sm:bottom-6 sm:left-8 sm:text-sm">
                {work.name}
                <span className="hidden font-normal text-stone-500 sm:inline">
                  {work.kind}
                </span>
                <span
                  aria-hidden="true"
                  className="text-brand-600 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                >
                  ↗
                </span>
              </span>
            </a>
          )
        })}
      </div>

      <div className="absolute inset-x-0 bottom-0 z-40 flex h-8 items-center justify-center gap-1">
        {works.map((work, index) => (
          <button
            key={work.image}
            type="button"
            onClick={() => show(index)}
            aria-label={`Réalisation ${index + 1} sur ${works.length} : ${work.name}, ${work.kind}`}
            aria-current={index === active ? true : undefined}
            className="group/dot flex h-6 min-w-6 items-center justify-center px-1"
          >
            <span
              className={`block h-1.5 rounded-full transition-all duration-300 ${
                index === active
                  ? 'w-5 bg-brand-500'
                  : 'w-1.5 bg-stone-300 group-hover/dot:bg-stone-400'
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  )
}

/** Tailles d'affichage des captures, pour que le navigateur choisisse. */
const DESKTOP_SIZES =
  '(min-width: 1024px) 384px, (min-width: 640px) 320px, 272px'
const PHONE_SIZES = '(min-width: 640px) 128px, 104px'

/** Une capture de site vue dans une fenêtre de navigateur. */
function BrowserShot({ work, priority }: { work: AgencyWork; priority: boolean }) {
  return (
    <div className="flex h-full flex-col bg-white">
      <div className="flex h-10 shrink-0 items-center gap-3 border-b border-stone-200 bg-stone-100 px-8">
        <span aria-hidden="true" className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-stone-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-stone-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-stone-300" />
        </span>
        <span className="truncate rounded-full bg-white px-3 py-0.5 text-[11px] text-stone-500">
          {work.url.replace(/^https:\/\//, '').replace(/\/$/, '')}
        </span>
      </div>
      <WorkImage
        work={work}
        widths={[480, 800]}
        height={7 / 8}
        sizes={DESKTOP_SIZES}
        priority={priority}
        className="min-h-0 w-full flex-1 object-cover object-top"
      />
    </div>
  )
}

/** Une capture d'application vue dans un cadre de téléphone. */
function PhoneShot({ work, priority }: { work: AgencyWork; priority: boolean }) {
  return (
    <div className="relative h-full bg-brand-500">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgb(255_255_255/0.3),transparent_60%)]" />
      <div className="absolute top-[7%] left-1/2 aspect-[1/2] h-[74%] -translate-x-1/2 rotate-3 rounded-[1.6rem] bg-stone-900 p-1.5 shadow-2xl shadow-brand-900/40">
        <WorkImage
          work={work}
          widths={[180, 360]}
          height={2}
          sizes={PHONE_SIZES}
          priority={priority}
          className="h-full w-full rounded-[1.2rem] object-cover object-top"
        />
        <span className="absolute top-3 left-1/2 h-1.5 w-8 -translate-x-1/2 rounded-full bg-stone-900" />
      </div>
    </div>
  )
}

/** Les captures de `public/realisations/`, en AVIF avec repli WebP. */
function WorkImage({
  work,
  widths,
  height,
  sizes,
  priority,
  className,
}: {
  work: AgencyWork
  widths: [number, number]
  height: number
  sizes: string
  priority: boolean
  className: string
}) {
  const srcSet = (format: string) =>
    widths
      .map((width) => `/realisations/${work.image}-${width}.${format} ${width}w`)
      .join(', ')
  return (
    <picture className="contents">
      <source type="image/avif" srcSet={srcSet('avif')} sizes={sizes} />
      <source type="image/webp" srcSet={srcSet('webp')} sizes={sizes} />
      <img
        src={`/realisations/${work.image}-${widths[1]}.webp`}
        width={widths[1]}
        height={widths[1] * height}
        alt={work.alt}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'low'}
        decoding="async"
        className={className}
      />
    </picture>
  )
}

/** Le bandeau orange qui fait défiler les métiers de l'agence. */
function Marquee() {
  const words = agency.keywords
  return (
    <section
      aria-label="Nos métiers"
      className="-rotate-1 overflow-hidden border-y-4 border-stone-900 bg-brand-500 py-4"
    >
      <div className="flex w-max motion-safe:animate-marquee">
        {/* La liste est doublée pour boucler sans à-coup ; le double est
            masqué aux lecteurs d'écran. */}
        {[0, 1].map((copy) => (
          <ul
            key={copy}
            aria-hidden={copy === 1 ? true : undefined}
            className="flex shrink-0 items-center"
          >
            {words.map((word) => (
              <li
                key={word}
                className="flex items-center font-display text-2xl font-bold whitespace-nowrap text-white sm:text-3xl"
              >
                <span className="px-6">{word}</span>
                <span aria-hidden="true" className="text-stone-900">
                  ✦
                </span>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </section>
  )
}

/**
 * Les deux publics de l'agence, sitôt le hero passé : un prospect technique
 * doit lire « IA », « React » ou « Symfony » sans descendre jusqu'aux
 * forfaits. Chaque étiquette mène à la page service qui en parle.
 */
function Audiences() {
  const { business, tech } = audiences
  return (
    <section
      id="pour-qui"
      aria-label="Pour qui"
      className="grid scroll-mt-24 gap-5 pt-20 lg:grid-cols-[1.7fr_1fr] lg:pt-24"
    >
      <div className="flex flex-col rounded-[2rem] bg-stone-900 p-7 text-white sm:p-10">
        <p className="text-sm font-semibold tracking-widest text-brand-300 uppercase">
          {business.eyebrow}
        </p>
        <h2 className="mt-3 text-3xl leading-tight font-extrabold tracking-tight text-balance sm:text-4xl">
          {business.title}
        </h2>
        <p className="mt-4 max-w-2xl leading-relaxed text-pretty text-stone-300">
          {business.description}
        </p>
        <ul className="mt-8 grid flex-1 gap-4 sm:grid-cols-2">
          {offers.map((offer) => (
            <li key={offer.id} className="flex">
              <a
                href={`#${offer.id}`}
                className="group flex w-full flex-col rounded-3xl bg-white/5 p-6 ring-1 ring-white/10 transition hover:bg-white/10 hover:ring-brand-400/60"
              >
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-500/15 text-brand-300">
                  <ServiceIcon name={offer.icon} />
                </span>
                <span className="mt-5 text-xl font-extrabold tracking-tight">
                  {offer.name}
                </span>
                <span className="mt-2 text-sm leading-relaxed text-pretty text-stone-400">
                  {offer.tagline}
                </span>
                <span className="mt-auto flex items-baseline gap-1.5 pt-6">
                  <span className="font-display text-4xl font-extrabold tracking-tight text-white">
                    {offer.price} €
                  </span>
                  <span className="text-sm text-stone-400">HT / mois</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
        <a
          href="#forfaits"
          className="group mt-8 inline-flex items-center gap-2 font-semibold text-brand-300 hover:text-brand-200"
        >
          Voir les forfaits
          <span
            aria-hidden="true"
            className="transition-transform group-hover:translate-x-1"
          >
            →
          </span>
        </a>
      </div>

      <div className="flex flex-col rounded-[2rem] border border-stone-200 bg-white p-7 sm:p-10">
        <p className="text-sm font-semibold tracking-widest text-brand-600 uppercase">
          {tech.eyebrow}
        </p>
        <h2 className="mt-3 text-2xl leading-tight font-extrabold tracking-tight text-balance text-stone-900 sm:text-3xl">
          {tech.title}
        </h2>
        <p className="mt-4 leading-relaxed text-pretty text-stone-600">
          {tech.description}
        </p>
        <ul className="mt-6 flex flex-wrap gap-2.5">
          {techSkills.map((skill) => (
            <li key={skill.label}>
              <Link
                to={servicePath(skill.service)}
                className="inline-block rounded-full bg-stone-100 px-4 py-2 text-sm font-semibold text-stone-900 ring-1 ring-stone-200 transition-colors hover:bg-brand-500 hover:text-white hover:ring-brand-500"
              >
                {skill.label}
              </Link>
            </li>
          ))}
        </ul>
        <Link
          to="/services"
          className="group mt-auto inline-flex items-center gap-2 pt-8 font-semibold text-brand-600 hover:text-brand-700"
        >
          Voir les prestations
          <span
            aria-hidden="true"
            className="transition-transform group-hover:translate-x-1"
          >
            →
          </span>
        </Link>
      </div>
    </section>
  )
}

/**
 * La vidéo de présentation, dont les sources vivent dans `video-source/`.
 * Titre et description servent aussi au `VideoObject` du JSON-LD.
 */
const VIDEO = {
  src: '/video/agence-cardona.mp4',
  poster: '/video/agence-cardona-poster.webp',
  /** Le JPEG reste la vignette du JSON-LD, lue par les moteurs et les réseaux. */
  thumbnail: '/video/agence-cardona-poster.jpg',
  subtitles: '/video/agence-cardona.fr.vtt',
  title: `L’agence ${agency.name} en une minute`,
  description:
    'Ce que fait l’agence Cardona, ses deux abonnements — Vitrine à 30 € et Application à 100 € HT par mois — et comment prendre rendez-vous.',
}

/**
 * Rien n'est chargé avant le clic (`preload="none"`), hormis l'image
 * d'attente. Les sous-titres sont incrustés dans l'image : la piste WebVTT,
 * désactivée par défaut, ne sert qu'à l'accessibilité et au référencement.
 */
function Showreel() {
  const video = useRef<HTMLVideoElement>(null)
  const [started, setStarted] = useState(false)

  return (
    <section id="video" className="scroll-mt-24 pt-24 lg:pt-32">
      <SectionHeading eyebrow="En vidéo" title="L’agence en une minute." />
      <div className="relative mt-12 aspect-video overflow-hidden rounded-[2.5rem] bg-stone-900 shadow-2xl shadow-brand-100 ring-1 ring-brand-100">
        <video
          ref={video}
          controls
          preload="none"
          playsInline
          poster={VIDEO.poster}
          aria-label={`Vidéo : ${VIDEO.title}, 1 min 01, voix off et sous-titres incrustés`}
          onPlay={() => setStarted(true)}
          className="absolute inset-0 h-full w-full"
        >
          <source src={VIDEO.src} type="video/mp4" />
          <track
            kind="subtitles"
            srcLang="fr"
            label="Français"
            src={VIDEO.subtitles}
          />
        </video>
        {!started && (
          <button
            type="button"
            onClick={() => void video.current?.play()}
            aria-label="Lire la vidéo"
            className="group absolute top-1/2 left-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-brand-500 text-white shadow-2xl shadow-stone-900/30 ring-8 ring-white/30 transition-transform hover:scale-110 focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-brand-500 sm:h-28 sm:w-28"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="ml-1 h-8 w-8 fill-current sm:h-11 sm:w-11"
            >
              <path d="M8 5.14v13.72a1 1 0 0 0 1.52.85l10.6-6.86a1 1 0 0 0 0-1.7L9.52 4.29A1 1 0 0 0 8 5.14Z" />
            </svg>
          </button>
        )}
      </div>
    </section>
  )
}

function Expertises() {
  return (
    <section id="expertises" className="scroll-mt-24 pt-24 lg:pt-32">
      <SectionHeading
        eyebrow="Ce qu’on fait"
        title="Tout ce qu’il faut pour exister en ligne. Rien de superflu."
      />
      <ul className="mt-12 grid gap-5 lg:grid-cols-12">
        {expertises.map((item, index) => {
          const scene = scenes[item.icon]
          return (
            <li
              key={item.title}
              className={`group flex flex-col overflow-hidden rounded-[2rem] border border-stone-200 bg-white transition-all hover:-translate-y-1 hover:border-brand-300 hover:shadow-xl hover:shadow-brand-100 ${
                // Les largeurs alternent d'une ligne à l'autre : 7 + 5, puis 5 + 7.
                index % 4 === 0 || index % 4 === 3
                  ? 'lg:col-span-7'
                  : 'lg:col-span-5'
              }`}
            >
              {scene && (
                <div
                  aria-hidden="true"
                  className={`relative h-56 overflow-hidden sm:h-64 ${scene.background}`}
                >
                  <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-105">
                    {scene.art}
                  </div>
                </div>
              )}
              <div className="flex flex-1 flex-col p-7 sm:p-8">
                <p className="flex items-center gap-3">
                  <span className="font-display text-sm font-bold text-brand-600">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span aria-hidden="true" className="h-px flex-1 bg-stone-200" />
                </p>
                <h3 className="mt-4 text-2xl font-bold tracking-tight text-stone-900">
                  {item.title}
                </h3>
                <p className="mt-3 max-w-md leading-relaxed text-stone-600">
                  {item.description}
                </p>
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

/**
 * Les illustrations des expertises, en SVG inline comme le reste de la page :
 * rien à charger, et elles prennent les couleurs de la marque. Une scène par
 * pictogramme d'expertise, sur un fond qui change d'une carte à l'autre.
 */
const scenes: Partial<
  Record<AgencyExpertise['icon'], { background: string; art: React.ReactNode }>
> = {
  compass: { background: 'bg-brand-500', art: <ShowcaseScene /> },
  sparkles: { background: 'bg-amber-100', art: <VisibilityScene /> },
  code: { background: 'bg-stone-900', art: <AppScene /> },
  shield: { background: 'bg-brand-50', art: <CareScene /> },
}
/** Cadre commun des scènes : elles remplissent leur panneau, rognées au besoin. */
function Scene({ children }: { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 480 280"
      preserveAspectRatio="xMidYMid slice"
      className="h-full w-full"
    >
      {children}
    </svg>
  )
}

/** Image & site vitrine : un téléphone qui affiche le site, prêt à appeler. */
function ShowcaseScene() {
  return (
    <Scene>
      <circle cx="400" cy="40" r="120" className="fill-brand-400" />
      <circle cx="70" cy="260" r="90" className="fill-brand-600" />
      <path
        d="M60 70c.8 5 3.2 7.4 8.2 8.2-5 .8-7.4 3.2-8.2 8.2-.8-5-3.2-7.4-8.2-8.2 5-.8 7.4-3.2 8.2-8.2Z"
        className="fill-amber-200"
      />
      <path
        d="M420 200c.6 3.6 2.4 5.4 6 6-3.6.6-5.4 2.4-6 6-.6-3.6-2.4-5.4-6-6 3.6-.6 5.4-2.4 6-6Z"
        className="fill-white"
      />

      {/* Le téléphone, penché, avec une page d'accueil dedans. */}
      <g transform="rotate(-6 240 170)">
        <rect x="170" y="36" width="140" height="270" rx="26" className="fill-stone-900" />
        <rect x="178" y="44" width="124" height="254" rx="19" className="fill-white" />
        <rect x="222" y="50" width="36" height="7" rx="3.5" className="fill-stone-900" />
        <rect x="190" y="70" width="38" height="8" rx="4" className="fill-brand-500" />
        <rect x="266" y="72" width="24" height="4" rx="2" className="fill-stone-300" />
        <rect x="190" y="88" width="100" height="62" rx="10" className="fill-brand-100" />
        <circle cx="262" cy="108" r="14" className="fill-brand-300" />
        <path d="M190 150l30-28 22 20 14-10 34 18Z" className="fill-brand-200" />
        <rect x="190" y="162" width="92" height="9" rx="4.5" className="fill-stone-900" />
        <rect x="190" y="177" width="70" height="9" rx="4.5" className="fill-stone-900" />
        <rect x="190" y="195" width="100" height="4" rx="2" className="fill-stone-300" />
        <rect x="190" y="204" width="84" height="4" rx="2" className="fill-stone-300" />
        <rect x="190" y="222" width="68" height="20" rx="10" className="fill-brand-500" />
      </g>

      {/* La bulle « appeler » qui déborde de l'écran. */}
      <g transform="translate(300 176)">
        <rect width="116" height="50" rx="25" className="fill-white" />
        <circle cx="25" cy="25" r="16" className="fill-emerald-500" />
        <path
          d="M19.5 18.5c.8-.8 2-.8 2.6.1l1.5 2.2c.5.8.4 1.8-.3 2.4l-.9.8a9 9 0 0 0 4 4l.8-.9c.6-.7 1.6-.8 2.4-.3l2.2 1.5c.9.6.9 1.8.1 2.6l-1 1c-1.4 1.4-6 .5-9.6-3.1s-4.5-8.2-3.1-9.6Z"
          className="fill-white"
        />
        <rect x="50" y="17" width="48" height="7" rx="3.5" className="fill-stone-900" />
        <rect x="50" y="29" width="34" height="5" rx="2.5" className="fill-stone-300" />
      </g>
    </Scene>
  )
}

/** Contenus & visibilité : la fiche locale bien notée et des visites qui montent. */
function VisibilityScene() {
  return (
    <Scene>
      <circle cx="420" cy="250" r="110" className="fill-amber-200" />
      <circle cx="40" cy="30" r="70" className="fill-amber-50" />

      {/* La barre de recherche. */}
      <rect x="70" y="34" width="250" height="40" rx="20" className="fill-white" />
      <circle cx="96" cy="53" r="8" fill="none" strokeWidth="3" className="stroke-stone-400" />
      <path d="m102 59 6 6" strokeWidth="3" strokeLinecap="round" className="stroke-stone-400" />
      <rect x="118" y="50" width="120" height="7" rx="3.5" className="fill-stone-300" />

      {/* La fiche d'établissement, avec sa carte et ses étoiles. */}
      <g transform="translate(70 90)">
        <rect width="250" height="150" rx="18" className="fill-white" />
        <rect x="12" y="12" width="226" height="64" rx="10" className="fill-emerald-50" />
        <path d="M12 52c40-12 70 14 120-4s70-8 106 2v16a10 10 0 0 1-10 10H22a10 10 0 0 1-10-10Z" className="fill-emerald-100" />
        <path d="M60 12v64M12 40h226M160 12l-30 64" strokeWidth="5" className="stroke-white" />
        <path
          d="M125 20a15 15 0 0 0-15 15c0 11 15 25 15 25s15-14 15-25a15 15 0 0 0-15-15Z"
          className="fill-brand-500"
        />
        <circle cx="125" cy="35" r="5.5" className="fill-white" />
        <rect x="14" y="90" width="120" height="9" rx="4.5" className="fill-stone-900" />
        {[0, 1, 2, 3, 4].map((star) => (
          <path
            key={star}
            transform={`translate(${14 + star * 18} 108)`}
            d="M7 0l2.1 4.4 4.9.7-3.5 3.4.8 4.8L7 11l-4.3 2.3.8-4.8L0 5.1l4.9-.7Z"
            className="fill-amber-400"
          />
        ))}
        <rect x="112" y="111" width="40" height="6" rx="3" className="fill-stone-300" />
        <rect x="14" y="128" width="84" height="12" rx="6" className="fill-brand-100" />
        <rect x="106" y="128" width="64" height="12" rx="6" className="fill-stone-100" />
      </g>

      {/* Le graphique des visites, sans traceur publicitaire. */}
      <g transform="translate(290 128)">
        <rect width="136" height="116" rx="18" className="fill-stone-900" />
        {[34, 46, 40, 60, 72].map((height, bar) => (
          <rect
            key={bar}
            x={18 + bar * 22}
            y={96 - height}
            width="14"
            height={height}
            rx="4"
            className={bar === 4 ? 'fill-brand-400' : 'fill-stone-700'}
          />
        ))}
        <path
          d="M25 54 47 44l22 8 22-22 22-12"
          fill="none"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="stroke-amber-300"
        />
        <circle cx="113" cy="18" r="5" className="fill-amber-300" />
      </g>
    </Scene>
  )
}

/** Applications sur mesure : le tableur de gauche devient l'outil de droite. */
function AppScene() {
  return (
    <Scene>
      <circle cx="120" cy="300" r="140" className="fill-stone-800" />
      <circle cx="440" cy="20" r="80" className="fill-brand-700" />

      {/* Le tableur d'avant, un peu de travers. */}
      <g transform="rotate(-8 110 150)">
        <rect x="36" y="70" width="150" height="150" rx="12" className="fill-stone-700" />
        <rect x="36" y="70" width="150" height="24" rx="12" className="fill-stone-600" />
        {[0, 1, 2, 3, 4].map((row) => (
          <path
            key={row}
            d={`M36 ${118 + row * 22}h150`}
            strokeWidth="1.5"
            className="stroke-stone-600"
          />
        ))}
        <path d="M86 94v126M136 94v126" strokeWidth="1.5" className="stroke-stone-600" />
        <rect x="44" y="102" width="34" height="6" rx="3" className="fill-emerald-400/70" />
        <rect x="94" y="124" width="34" height="6" rx="3" className="fill-amber-300/70" />
        <rect x="144" y="146" width="30" height="6" rx="3" className="fill-rose-400/70" />
        <rect x="44" y="168" width="28" height="6" rx="3" className="fill-stone-500" />
      </g>

      {/* La flèche de la transformation. */}
      <path
        d="M190 150c20-18 40-18 60 0"
        fill="none"
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray="2 10"
        className="stroke-brand-300"
      />
      <path d="m244 138 8 12-14 4" fill="none" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="stroke-brand-300" />

      {/* L'application d'après : menu, fiches et un statut. */}
      <g transform="translate(250 50)">
        <rect width="200" height="186" rx="16" className="fill-white" />
        <rect width="52" height="186" rx="16" className="fill-brand-500" />
        <rect x="36" width="16" height="186" className="fill-brand-500" />
        <rect x="14" y="18" width="24" height="24" rx="8" className="fill-white/90" />
        {[0, 1, 2].map((item) => (
          <rect
            key={item}
            x="14"
            y={62 + item * 22}
            width={item === 0 ? 24 : 18}
            height="6"
            rx="3"
            className={item === 0 ? 'fill-white' : 'fill-brand-200'}
          />
        ))}
        <rect x="68" y="20" width="80" height="9" rx="4.5" className="fill-stone-900" />
        <rect x="68" y="36" width="54" height="5" rx="2.5" className="fill-stone-300" />
        {[0, 1, 2].map((card) => (
          <g key={card} transform={`translate(68 ${56 + card * 42})`}>
            <rect width="118" height="34" rx="9" className="fill-stone-50" />
            <circle cx="16" cy="17" r="8" className={card === 1 ? 'fill-amber-200' : 'fill-brand-100'} />
            <rect x="30" y="11" width="46" height="5" rx="2.5" className="fill-stone-800" />
            <rect x="30" y="20" width="30" height="4" rx="2" className="fill-stone-300" />
            <rect
              x="86"
              y="12"
              width="22"
              height="10"
              rx="5"
              className={card === 2 ? 'fill-brand-200' : 'fill-emerald-100'}
            />
          </g>
        ))}
      </g>
    </Scene>
  )
}

/** Suivi & sérénité : un site sous bonne garde, sauvegardé et surveillé. */
function CareScene() {
  return (
    <Scene>
      <circle cx="60" cy="40" r="100" className="fill-brand-100" />
      <circle cx="430" cy="260" r="90" className="fill-amber-100" />

      {/* Le tableau de suivi. */}
      <g transform="translate(40 60)">
        <rect width="270" height="170" rx="18" className="fill-white" />
        <circle cx="22" cy="22" r="5" className="fill-emerald-500" />
        <rect x="34" y="18" width="70" height="8" rx="4" className="fill-stone-800" />
        <rect x="200" y="15" width="54" height="14" rx="7" className="fill-emerald-100" />
        <path
          d="M18 96h44l12-26 16 52 16-40 10 14h136"
          fill="none"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="stroke-brand-500"
        />
        {/* Une case par jour du mois, toutes au vert. */}
        {Array.from({ length: 15 }, (_, day) => (
          <rect
            key={day}
            x={18 + day * 16.2}
            y="138"
            width="11"
            height="16"
            rx="3"
            className={day === 14 ? 'fill-brand-300' : 'fill-emerald-400'}
          />
        ))}
      </g>

      {/* Le bouclier, posé devant. */}
      <g transform="translate(290 44)">
        <path
          d="M70 0 8 24v44c0 38 26 70 62 80 36-10 62-42 62-80V24Z"
          className="fill-brand-500"
        />
        <path
          d="M70 14 20 33v35c0 30 20 56 50 64Z"
          className="fill-brand-400"
        />
        <path
          d="m46 72 16 16 32-34"
          fill="none"
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="stroke-white"
        />
      </g>

      {/* La sauvegarde, en petit nuage. */}
      <g transform="translate(330 180)">
        <rect width="104" height="46" rx="23" className="fill-stone-900" />
        <path
          d="M22 30a7 7 0 0 1 1-14 9 9 0 0 1 17 2 6 6 0 0 1 0 12Z"
          className="fill-white"
        />
        <rect x="52" y="16" width="38" height="6" rx="3" className="fill-white" />
        <rect x="52" y="27" width="26" height="5" rx="2.5" className="fill-stone-500" />
      </g>
    </Scene>
  )
}

function Figures() {
  return (
    <section
      aria-label="En chiffres"
      className="mt-24 rounded-[2.5rem] bg-brand-50 px-8 py-12 ring-1 ring-brand-100 sm:px-12 lg:mt-32"
    >
      <dl className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        {figures.map((figure) => (
          <div key={figure.label}>
            <dt className="font-display text-5xl font-extrabold tracking-tight text-brand-600 lg:text-6xl">
              {figure.value}
            </dt>
            <dd className="mt-2 text-sm leading-relaxed text-stone-600">
              {figure.label}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

function Offers() {
  return (
    <section id="forfaits" className="scroll-mt-24 pt-24 lg:pt-32">
      <SectionHeading
        eyebrow="Les forfaits"
        title="Deux abonnements. Zéro surprise."
        intro="Pas de devis à rallonge ni de facture de départ : la création est comprise dans le mensuel, l’hébergement et le suivi aussi."
      />
      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        {offers.map((offer, index) => (
          <OfferCard key={offer.id} offer={offer} featured={index === 0} />
        ))}
      </div>
      <ul className="mt-10 grid gap-3 sm:grid-cols-2">
        {commitments.map((item) => (
          <li
            key={item}
            className="flex gap-3 text-sm leading-relaxed text-stone-600"
          >
            <Check />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

/**
 * Un forfait : son prix, ce qu'il couvre, et pour qui il est fait. Le premier
 * est mis en avant en orange : c'est la porte d'entrée de l'agence.
 */
function OfferCard({
  offer,
  featured,
}: {
  offer: AgencyOffer
  featured: boolean
}) {
  const muted = featured ? 'text-white' : 'text-stone-500'
  return (
    <article
      id={offer.id}
      className={`relative flex scroll-mt-24 flex-col rounded-[2rem] p-8 sm:p-10 ${
        featured
          ? 'bg-brand-600 text-white shadow-2xl shadow-brand-500/30'
          : 'border border-stone-200 bg-white text-stone-900'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <span
          className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl ${
            featured ? 'bg-white/15 text-white' : 'bg-brand-50 text-brand-600'
          }`}
        >
          <ServiceIcon name={offer.icon} />
        </span>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            featured ? 'bg-white text-brand-700' : 'bg-stone-100 text-stone-700'
          }`}
        >
          {featured ? 'Pour démarrer' : 'Pour aller plus loin'}
        </span>
      </div>
      <h3 className="mt-6 text-3xl font-extrabold tracking-tight">
        {offer.name}
      </h3>
      <p
        className={`mt-2 leading-relaxed ${featured ? 'text-white' : 'text-stone-600'}`}
      >
        {offer.tagline}
      </p>

      <p className="mt-8 flex items-baseline gap-2">
        <span className="font-display text-6xl font-extrabold tracking-tight">
          {offer.price} €
        </span>
        <span className={`text-sm ${muted}`}>{offer.priceNote}</span>
      </p>
      <p className={`mt-1 text-xs ${muted}`}>
        Hors taxes, engagement d’un an puis mois par mois. {offer.delivery}
      </p>

      <h4
        className={`mt-8 text-xs font-semibold tracking-wide uppercase ${muted}`}
      >
        Pour qui
      </h4>
      <p
        className={`mt-2 text-sm leading-relaxed ${featured ? 'text-white' : 'text-stone-600'}`}
      >
        {offer.forWho}
      </p>

      <h4
        className={`mt-6 text-xs font-semibold tracking-wide uppercase ${muted}`}
      >
        Ce qui est compris
      </h4>
      <ul className="mt-3 flex-1 space-y-2.5">
        {offer.includes.map((item) => (
          <li
            key={item}
            className={`flex gap-3 text-sm leading-relaxed ${featured ? 'text-white' : 'text-stone-700'}`}
          >
            <Check className={featured ? 'text-white' : undefined} />
            <span>{item}</span>
          </li>
        ))}
      </ul>

      <Link
        to="/contact"
        search={{ forfait: offer.id }}
        data-umami-event="cta-contact"
        data-umami-event-page="/"
        data-umami-event-emplacement="forfaits"
        data-umami-event-forfait={offer.name}
        className={`mt-10 rounded-full px-6 py-3.5 text-center text-sm font-semibold transition-colors ${
          featured
            ? 'bg-white text-brand-700 hover:bg-brand-50'
            : 'bg-stone-900 text-white hover:bg-stone-700'
        }`}
      >
        Parler de votre projet
        <span className="sr-only"> : forfait {offer.name}</span>
      </Link>
    </article>
  )
}

function Method() {
  return (
    <section id="deroulement" className="scroll-mt-24 pt-24 lg:pt-32">
      <SectionHeading
        eyebrow="La méthode"
        title="De l’appel à la mise en ligne, en quatre temps."
      />
      <ol className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, index) => {
          const scene = stepScenes[index]
          return (
            <li key={step.title}>
              {scene && (
                <div
                  aria-hidden="true"
                  className={`h-44 overflow-hidden rounded-[1.5rem] ${scene.background}`}
                >
                  {scene.art}
                </div>
              )}
              <p className="mt-6 flex items-center gap-3">
                <span className="font-display text-sm font-bold text-brand-600">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span aria-hidden="true" className="h-px flex-1 bg-stone-200" />
              </p>
              <h3 className="mt-4 text-lg font-bold text-stone-900">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-stone-600">
                {step.description}
              </p>
            </li>
          )
        })}
      </ol>
    </section>
  )
}

/**
 * Les illustrations de la méthode, une par étape et dans l'ordre de `steps`,
 * dessinées comme les scènes des expertises et dans le même cadre.
 */
const stepScenes: Array<{ background: string; art: React.ReactNode }> = [
  { background: 'bg-brand-50', art: <CallScene /> },
  { background: 'bg-amber-100', art: <MockupScene /> },
  { background: 'bg-brand-500', art: <LaunchScene /> },
  { background: 'bg-stone-900', art: <FollowUpScene /> },
]

/** Un appel : le téléphone décroché, la conversation, une heure au compteur. */
function CallScene() {
  return (
    <Scene>
      <circle cx="420" cy="40" r="100" className="fill-brand-100" />
      <circle cx="60" cy="260" r="80" className="fill-amber-100" />

      {/* Le téléphone. */}
      <circle cx="150" cy="134" r="56" className="fill-brand-500" />
      <path
        transform="translate(150 134) scale(3.4) translate(-25.8 -25.8)"
        d="M19.5 18.5c.8-.8 2-.8 2.6.1l1.5 2.2c.5.8.4 1.8-.3 2.4l-.9.8a9 9 0 0 0 4 4l.8-.9c.6-.7 1.6-.8 2.4-.3l2.2 1.5c.9.6.9 1.8.1 2.6l-1 1c-1.4 1.4-6 .5-9.6-3.1s-4.5-8.2-3.1-9.6Z"
        className="fill-white"
      />

      {/* La conversation : votre question, notre réponse. */}
      <g transform="translate(228 64)">
        <rect width="180" height="56" rx="28" className="fill-white" />
        <path d="M24 50 14 66l26-12Z" className="fill-white" />
        <rect x="26" y="18" width="110" height="8" rx="4" className="fill-stone-800" />
        <rect x="26" y="32" width="74" height="6" rx="3" className="fill-stone-300" />
      </g>
      <g transform="translate(258 146)">
        <rect width="150" height="50" rx="25" className="fill-brand-500" />
        <path d="M126 44l12 16-24-10Z" className="fill-brand-500" />
        <rect x="22" y="16" width="96" height="7" rx="3.5" className="fill-white" />
        <rect x="22" y="29" width="60" height="5" rx="2.5" className="fill-brand-200" />
      </g>

      {/* L'heure de l'appel. */}
      <g transform="translate(100 204)">
        <rect width="100" height="34" rx="17" className="fill-stone-900" />
        <circle cx="18" cy="17" r="9" fill="none" strokeWidth="2.5" className="stroke-white" />
        <path d="M18 12v5l4 3" fill="none" strokeWidth="2.5" strokeLinecap="round" className="stroke-white" />
        <rect x="36" y="14" width="48" height="6" rx="3" className="fill-white" />
      </g>
    </Scene>
  )
}

/** Une maquette : la page en fil de fer, qu'on reprend au crayon. */
function MockupScene() {
  return (
    <Scene>
      <circle cx="430" cy="250" r="100" className="fill-amber-200" />
      <circle cx="40" cy="30" r="70" className="fill-amber-50" />

      {/* La page, encore en blocs. */}
      <g transform="translate(90 50)">
        <rect width="230" height="180" rx="16" className="fill-white" />
        <circle cx="20" cy="18" r="6" className="fill-stone-300" />
        <rect x="34" y="14" width="60" height="8" rx="4" className="fill-stone-300" />
        <rect x="168" y="15" width="44" height="6" rx="3" className="fill-stone-200" />
        <rect
          x="16"
          y="34"
          width="198"
          height="64"
          rx="8"
          fill="none"
          strokeWidth="2"
          strokeDasharray="6 6"
          className="stroke-stone-300"
        />
        <path d="m16 34 198 64M214 34 16 98" strokeWidth="1.5" className="stroke-stone-200" />
        <rect x="16" y="112" width="120" height="8" rx="4" className="fill-stone-700" />
        <rect x="16" y="126" width="160" height="5" rx="2.5" className="fill-stone-300" />
        <rect x="16" y="136" width="130" height="5" rx="2.5" className="fill-stone-300" />
        <rect x="16" y="152" width="64" height="16" rx="8" className="fill-brand-500" />
        {/* La retouche, entourée à la main. */}
        <ellipse
          cx="48"
          cy="160"
          rx="44"
          ry="15"
          fill="none"
          strokeWidth="2.5"
          className="stroke-brand-600"
          transform="rotate(-4 48 160)"
        />
      </g>

      {/* Le crayon. */}
      <g transform="translate(330 70) rotate(35)">
        <rect y="-16" width="24" height="16" rx="4" className="fill-brand-200" />
        <rect y="-4" width="24" height="8" className="fill-stone-300" />
        <rect y="4" width="24" height="126" className="fill-brand-500" />
        <path d="M0 130 12 156l12-26Z" className="fill-amber-200" />
        <path d="m8 147 4 9 4-9Z" className="fill-stone-900" />
      </g>
    </Scene>
  )
}

/** La mise en ligne : le site à son adresse, sécurisé et en ligne. */
function LaunchScene() {
  return (
    <Scene>
      <circle cx="400" cy="40" r="120" className="fill-brand-400" />
      <circle cx="70" cy="260" r="90" className="fill-brand-600" />
      <path
        d="M60 70c.8 5 3.2 7.4 8.2 8.2-5 .8-7.4 3.2-8.2 8.2-.8-5-3.2-7.4-8.2-8.2 5-.8 7.4-3.2 8.2-8.2Z"
        className="fill-amber-200"
      />

      {/* Le navigateur, avec le cadenas dans la barre d'adresse. */}
      <g transform="translate(70 56)">
        <rect width="260" height="170" rx="16" className="fill-white" />
        {[18, 32, 46].map((cx) => (
          <circle key={cx} cx={cx} cy="18" r="4" className="fill-stone-200" />
        ))}
        <rect x="62" y="9" width="180" height="18" rx="9" className="fill-stone-100" />
        <rect x="72" y="16" width="8" height="7" rx="1.5" className="fill-emerald-500" />
        <path d="M73.5 16v-2a2.5 2.5 0 0 1 5 0v2" fill="none" strokeWidth="1.5" className="stroke-emerald-500" />
        <rect x="86" y="15" width="80" height="6" rx="3" className="fill-stone-300" />
        <rect x="16" y="40" width="228" height="56" rx="10" className="fill-brand-100" />
        <circle cx="210" cy="62" r="12" className="fill-brand-300" />
        <rect x="16" y="108" width="110" height="9" rx="4.5" className="fill-stone-900" />
        <rect x="16" y="124" width="150" height="5" rx="2.5" className="fill-stone-300" />
        <rect x="16" y="134" width="120" height="5" rx="2.5" className="fill-stone-300" />
        <rect x="16" y="148" width="60" height="14" rx="7" className="fill-brand-500" />
      </g>

      {/* Le monde entier peut le voir. */}
      <g transform="translate(372 76)" fill="none" strokeWidth="3" className="stroke-white">
        <circle r="30" />
        <ellipse rx="13" ry="30" />
        <path d="M-30 0h60M-26-15h52M-26 15h52" />
      </g>

      {/* Le statut « en ligne ». */}
      <g transform="translate(290 168)">
        <rect width="130" height="46" rx="23" className="fill-white" />
        <circle cx="23" cy="23" r="14" className="fill-emerald-100" />
        <circle cx="23" cy="23" r="7" className="fill-emerald-500" />
        <rect x="44" y="15" width="62" height="7" rx="3.5" className="fill-stone-900" />
        <rect x="44" y="27" width="42" height="5" rx="2.5" className="fill-stone-300" />
      </g>
    </Scene>
  )
}

/** La suite : un mois coché jour après jour, et les mises à jour qui tournent. */
function FollowUpScene() {
  return (
    <Scene>
      <circle cx="120" cy="300" r="140" className="fill-stone-800" />
      <circle cx="440" cy="20" r="80" className="fill-brand-700" />

      {/* Le calendrier du mois. */}
      <g transform="translate(80 52)">
        <rect width="200" height="176" rx="16" className="fill-white" />
        <rect width="200" height="36" rx="16" className="fill-brand-500" />
        <rect y="20" width="200" height="16" className="fill-brand-500" />
        <rect x="16" y="14" width="60" height="8" rx="4" className="fill-white" />
        <rect x="48" y="-8" width="8" height="20" rx="4" className="fill-stone-300" />
        <rect x="144" y="-8" width="8" height="20" rx="4" className="fill-stone-300" />
        {Array.from({ length: 20 }, (_, day) => {
          const x = 16 + (day % 5) * 36
          const y = 48 + Math.floor(day / 5) * 30
          return (
            <g key={day}>
              <rect
                x={x}
                y={y}
                width="26"
                height="22"
                rx="6"
                className={
                  day < 13
                    ? 'fill-emerald-100'
                    : day === 13
                      ? 'fill-brand-100'
                      : 'fill-stone-100'
                }
              />
              {day < 13 && (
                <path
                  d={`M${x + 8} ${y + 11}l4 4 7-8`}
                  fill="none"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="stroke-emerald-600"
                />
              )}
            </g>
          )
        })}
      </g>

      {/* Les mises à jour, en boucle. */}
      <g transform="translate(350 110)">
        <circle r="44" className="fill-brand-500" />
        {[0, 180].map((angle) => (
          <g key={angle} transform={`rotate(${angle})`}>
            <path
              d="M-18.8-6.8A20 20 0 0 1 15.3-12.9"
              fill="none"
              strokeWidth="5"
              strokeLinecap="round"
              className="stroke-white"
            />
            <path d="m19.9-16.8-9.2 7.8 9.7 2.2Z" className="fill-white" />
          </g>
        ))}
      </g>

      {/* La demande du mois, traitée. */}
      <g transform="translate(300 190)">
        <rect width="130" height="44" rx="22" className="fill-white" />
        <circle cx="22" cy="22" r="11" className="fill-emerald-500" />
        <path
          d="m17 22 4 4 7-8"
          fill="none"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="stroke-white"
        />
        <rect x="42" y="14" width="66" height="7" rx="3.5" className="fill-stone-900" />
        <rect x="42" y="26" width="44" height="5" rx="2.5" className="fill-stone-300" />
      </g>
    </Scene>
  )
}

function About() {
  return (
    <section
      id="agence"
      className="scroll-mt-24 pt-24 lg:grid lg:grid-cols-[1.4fr_1fr] lg:gap-16 lg:pt-32"
    >
      <div>
        <SectionHeading
          eyebrow="L’agence"
          title="Née à Lyon, entre Rhône et Saône."
        />
        <div className="mt-8 space-y-5 text-lg leading-relaxed text-pretty text-stone-600">
          {agency.about.map((paragraph) => (
            <p key={paragraph.slice(0, 40)}>{paragraph}</p>
          ))}
        </div>
        <p className="mt-8 text-sm">
          <Link
            to="/services"
            className="font-semibold text-brand-600 hover:underline"
          >
            Les prestations au forfait et en régie →
          </Link>
        </p>
      </div>

      <aside className="mt-12 self-start rounded-[2rem] bg-stone-900 p-8 text-white lg:mt-0">
        <LogoMark className="h-12 w-12" />
        <p className="mt-6 text-xs font-semibold tracking-widest text-brand-300 uppercase">
          Derrière l’agence
        </p>
        <p className="mt-2 font-display text-2xl font-bold">{profile.name}</p>
        <p className="mt-1 text-sm text-stone-300">
          Fondateur · 13 ans de projets web
        </p>
        <p className="mt-5 text-sm leading-relaxed text-stone-300">
          Treize ans aux côtés de grandes marques comme TF1, M6 ou OVH m’ont
          appris ce qui fait qu’un visiteur devient un client. Aujourd’hui, je
          mets ce savoir-faire au service des entreprises lyonnaises, sans
          intermédiaire : vous parlez directement à celui qui conçoit, écrit et
          construit.
        </p>
        <Link
          to="/qui-suis-je"
          className="mt-6 inline-flex rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-stone-900 transition-colors hover:bg-brand-50"
        >
          Qui suis-je ?
        </Link>
      </aside>
    </section>
  )
}

function Faq() {
  return (
    <section id="faq" className="scroll-mt-24 pt-24 lg:pt-32">
      <SectionHeading eyebrow="FAQ" title="Les questions qu’on nous pose." />
      <div className="mt-10 divide-y divide-stone-200 rounded-3xl border border-stone-200 bg-white">
        {faq.map((item) => (
          <details key={item.question} className="group px-6 py-5 sm:px-8">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-semibold text-stone-900">
              {item.question}
              <span
                aria-hidden="true"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600 transition-transform group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <p className="mt-3 max-w-3xl leading-relaxed text-stone-600">
              {item.answer}
            </p>
          </details>
        ))}
      </div>
    </section>
  )
}

/** Le dernier écran : l'invitation, en grand et en orange. */
function FinalCall() {
  return (
    <section className="mx-auto mt-24 max-w-6xl px-6 lg:mt-32">
      <div className="relative overflow-hidden rounded-[2.5rem] bg-brand-600 px-8 py-16 text-white sm:px-14 sm:py-20">
        <div
          aria-hidden="true"
          className="absolute -top-24 -right-24 h-80 w-80 rounded-full border-[3rem] border-white/10"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-32 left-1/3 h-64 w-64 rounded-full bg-amber-300/30 blur-3xl"
        />
        <h2 className="relative max-w-3xl text-4xl leading-[1.05] font-extrabold tracking-tight text-balance sm:text-6xl">
          Un projet ? Parlons-en autour d’un café.
        </h2>
        <p className="relative mt-6 max-w-xl text-lg text-pretty text-white">
          Une heure pour comprendre votre activité et vous dire ce qu’on ferait
          à votre place. Gratuit, sans engagement, à Lyon ou en visio.
        </p>
        <div className="relative mt-10 flex flex-wrap gap-3">
          <Link
            to="/contact"
            search={{ appel: 1 }}
            data-umami-event="cta-contact"
            data-umami-event-page="/"
            data-umami-event-emplacement="bas-de-page"
            data-umami-event-appel="oui"
            className="rounded-full bg-white px-6 py-3.5 text-base font-semibold text-brand-700 transition-all hover:-translate-y-0.5 hover:bg-brand-50"
          >
            Demander un appel découverte
          </Link>
          <Link
            to="/contact"
            data-umami-event="cta-contact"
            data-umami-event-page="/"
            data-umami-event-emplacement="bas-de-page"
            className="rounded-full border border-white/50 px-6 py-3.5 text-base font-semibold text-white transition-colors hover:border-white hover:bg-white/10"
          >
            Parler de votre projet
          </Link>
        </div>
      </div>
    </section>
  )
}

function SectionHeading({
  eyebrow,
  title,
  intro,
}: {
  eyebrow: string
  title: string
  intro?: string
}) {
  return (
    <div className="max-w-3xl">
      <p className="flex items-center gap-3 text-sm font-semibold tracking-widest text-brand-600 uppercase">
        <span aria-hidden="true" className="h-px w-8 bg-brand-500" />
        {eyebrow}
      </p>
      <h2 className="mt-4 text-4xl leading-[1.05] font-extrabold tracking-tight text-balance text-stone-900 sm:text-5xl">
        {title}
      </h2>
      {intro && (
        <p className="mt-5 text-lg leading-relaxed text-pretty text-stone-600">
          {intro}
        </p>
      )}
    </div>
  )
}

function Check({ className = 'text-brand-600' }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`mt-0.5 h-5 w-5 shrink-0 ${className}`}
    >
      <path d="m5 10.5 3 3 7-7" />
    </svg>
  )
}
