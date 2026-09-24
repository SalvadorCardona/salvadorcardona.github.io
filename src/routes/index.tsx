import { Link, createFileRoute } from '@tanstack/react-router'

import { LogoMark } from '../components/Logo'
import { ServiceIcon } from '../components/ServiceIcon'
import type { AgencyOffer } from '../content/agency'
import {
  agency,
  commitments,
  expertises,
  faq,
  figures,
  offers,
  steps,
} from '../content/agency'
import { links, profile } from '../content/profile'
import { PERSON_ID, SITE_URL, personJsonLd, seo } from '../lib/seo'

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
          publisher: { '@id': `${SITE_URL}/#agence` },
        },
        {
          '@context': 'https://schema.org',
          '@type': 'ProfessionalService',
          '@id': `${SITE_URL}/#agence`,
          name: `Agence ${agency.name}`,
          slogan: agency.tagline,
          description: agency.pitch,
          url: SITE_URL,
          logo: `${SITE_URL}/logo.svg`,
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
 * en CSS, et entièrement derrière `motion-safe:`.
 */
function Home() {
  return (
    <>
      <Hero />
      <Marquee />

      <div className="mx-auto max-w-6xl px-6">
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
    <section className="relative mx-auto max-w-6xl px-6 pt-12 pb-20 sm:pt-20 lg:pb-28">
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
          <p className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white/70 px-3 py-1 text-sm font-medium text-brand-700 backdrop-blur motion-safe:animate-hero-rise">
            <span className="h-2 w-2 rounded-full bg-brand-500" />
            {agency.tagline}
          </p>
          <h1 className="mt-6 text-5xl leading-[0.98] font-extrabold tracking-tight text-balance text-stone-900 motion-safe:animate-hero-rise motion-safe:[animation-delay:100ms] sm:text-6xl lg:text-7xl">
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
              className="group inline-flex items-center gap-2 rounded-full bg-brand-500 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-brand-500/25 transition-all hover:-translate-y-0.5 hover:bg-brand-600 hover:shadow-xl hover:shadow-brand-500/30"
            >
              Lancer mon projet
              <span
                aria-hidden="true"
                className="transition-transform group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
            <a
              href="#forfaits"
              className="rounded-full border border-stone-300 bg-white/60 px-6 py-3.5 text-base font-semibold text-stone-800 transition-all hover:-translate-y-0.5 hover:border-stone-400 hover:bg-white"
            >
              Voir les forfaits
            </a>
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
            <span>Basés à Lyon</span>
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
 * La composition à droite du titre : la tuile orange du logo, un badge
 * circulaire qui tourne et deux étiquettes qui reprennent les promesses.
 */
function HeroVisual() {
  return (
    <div
      aria-hidden="true"
      className="relative mx-auto aspect-square w-full max-w-sm motion-safe:animate-hero-rise motion-safe:[animation-delay:250ms] lg:max-w-md"
    >
      <div className="absolute inset-8 rotate-6 rounded-[3rem] bg-amber-200/70" />
      <div className="absolute inset-8 -rotate-3 overflow-hidden rounded-[3rem] bg-brand-500 shadow-2xl shadow-brand-500/30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgb(255_255_255/0.25),transparent_55%)]" />
        <svg
          viewBox="0 0 48 48"
          className="absolute inset-0 m-auto h-3/5 w-3/5 rotate-3"
        >
          <path
            d="M30.78 16.22A11 11 0 1 0 30.78 31.78"
            fill="none"
            stroke="#fff"
            strokeWidth="7"
            strokeLinecap="round"
          />
          <circle cx="36.5" cy="24" r="3.75" fill="#fff" />
        </svg>
      </div>

      <div className="absolute -top-2 -right-2 h-32 w-32 rounded-full bg-white p-1 shadow-xl shadow-stone-300/50 sm:h-36 sm:w-36">
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

      <div className="absolute bottom-10 -left-4 rounded-2xl bg-white px-4 py-3 shadow-xl shadow-stone-300/50 sm:-left-8">
        <p className="flex items-center gap-2 text-sm font-semibold text-stone-900">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-xs text-emerald-700">
            ✓
          </span>
          Site en ligne
        </p>
        <p className="mt-0.5 pl-8 text-xs text-stone-500">en deux semaines</p>
      </div>

      <div className="absolute -right-2 bottom-24 rounded-2xl bg-stone-900 px-4 py-3 text-white shadow-xl sm:-right-6">
        <p className="font-display text-2xl leading-none font-extrabold">
          30 €
          <span className="text-sm font-medium text-stone-300"> / mois</span>
        </p>
        <p className="mt-1 text-xs text-stone-300">création comprise</p>
      </div>
    </div>
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

function Expertises() {
  return (
    <section id="expertises" className="scroll-mt-24 pt-24 lg:pt-32">
      <SectionHeading
        eyebrow="Ce qu’on fait"
        title="Tout ce qu’il faut pour exister en ligne. Rien de superflu."
      />
      <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {expertises.map((item, index) => (
          <li
            key={item.title}
            className="group relative flex flex-col rounded-3xl border border-stone-200 bg-white p-7 transition-all hover:-translate-y-1 hover:border-brand-300 hover:shadow-xl hover:shadow-brand-100"
          >
            <span className="font-display text-sm font-bold text-stone-400">
              {String(index + 1).padStart(2, '0')}
            </span>
            <span className="mt-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-500 group-hover:text-white">
              <ServiceIcon name={item.icon} />
            </span>
            <h3 className="mt-5 text-xl font-bold tracking-tight text-stone-900">
              {item.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-stone-600">
              {item.description}
            </p>
          </li>
        ))}
      </ul>
    </section>
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
            <dt className="sr-only">{figure.label}</dt>
            <dd>
              <span className="block font-display text-5xl font-extrabold tracking-tight text-brand-600 lg:text-6xl">
                {figure.value}
              </span>
              <span className="mt-2 block text-sm leading-relaxed text-stone-600">
                {figure.label}
              </span>
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
  const muted = featured ? 'text-white/80' : 'text-stone-500'
  return (
    <article
      id={offer.id}
      className={`relative flex scroll-mt-24 flex-col rounded-[2rem] p-8 sm:p-10 ${
        featured
          ? 'bg-brand-500 text-white shadow-2xl shadow-brand-500/30'
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
        className={`mt-2 leading-relaxed ${featured ? 'text-white/90' : 'text-stone-600'}`}
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
        className={`mt-2 text-sm leading-relaxed ${featured ? 'text-white/90' : 'text-stone-600'}`}
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
        className={`mt-10 rounded-full px-6 py-3.5 text-center text-sm font-semibold transition-colors ${
          featured
            ? 'bg-white text-brand-700 hover:bg-brand-50'
            : 'bg-stone-900 text-white hover:bg-stone-700'
        }`}
      >
        Choisir le forfait {offer.name}
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
        {steps.map((step, index) => (
          <li key={step.title} className="relative">
            <span
              aria-hidden="true"
              className="font-display text-7xl leading-none font-extrabold text-transparent [-webkit-text-stroke:2px_var(--color-brand-400)]"
            >
              {index + 1}
            </span>
            <h3 className="mt-4 text-lg font-bold text-stone-900">
              {step.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-stone-600">
              {step.description}
            </p>
          </li>
        ))}
      </ol>
    </section>
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
          Fondateur, développeur web depuis 2013
        </p>
        <p className="mt-5 text-sm leading-relaxed text-stone-300">
          Treize ans à construire des marketplaces, une plateforme de
          streaming et une application de soin animalier. Aujourd’hui, le même
          soin pour votre présence en ligne.
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
      <div className="relative overflow-hidden rounded-[2.5rem] bg-brand-500 px-8 py-16 text-white sm:px-14 sm:py-20">
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
        <p className="relative mt-6 max-w-xl text-lg text-pretty text-white/90">
          Une heure pour comprendre votre activité et vous dire ce qu’on ferait
          à votre place. Gratuit, sans engagement, à Lyon ou en visio.
        </p>
        <div className="relative mt-10 flex flex-wrap gap-3">
          <Link
            to="/contact"
            className="rounded-full bg-white px-6 py-3.5 text-base font-semibold text-brand-700 transition-all hover:-translate-y-0.5 hover:bg-brand-50"
          >
            Prendre rendez-vous
          </Link>
          <a
            href={`mailto:${links.email}`}
            className="rounded-full border border-white/50 px-6 py-3.5 text-base font-semibold text-white transition-colors hover:border-white hover:bg-white/10"
          >
            Nous écrire
          </a>
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
