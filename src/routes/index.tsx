import { Link, createFileRoute } from '@tanstack/react-router'

import { LogoMark } from '../components/Logo'
import { ServiceIcon } from '../components/ServiceIcon'
import type { AgencyExpertise, AgencyOffer } from '../content/agency'
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

          <div className="mt-10 flex items-center gap-4 motion-safe:animate-hero-rise motion-safe:[animation-delay:350ms]">
            <div aria-hidden="true" className="flex -space-x-2">
              {['bg-brand-500', 'bg-amber-400', 'bg-stone-800', 'bg-brand-300'].map(
                (color) => (
                  <span
                    key={color}
                    className={`h-9 w-9 rounded-full ring-2 ring-white ${color}`}
                  />
                ),
              )}
            </div>
            <p className="text-sm leading-snug text-stone-600">
              <strong className="block font-display text-lg font-extrabold text-stone-900">
                {agency.clients} entreprises
              </strong>
              nous ont déjà fait confiance
            </p>
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
