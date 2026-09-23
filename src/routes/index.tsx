import { Link, createFileRoute } from '@tanstack/react-router'

import { ServicesGrid } from '../components/ServiceCard'
import { agency } from '../content/agency'
import {
  education,
  isFilled,
  links,
  profile,
  projectIcon,
  projects,
  skills,
} from '../content/profile'
import type { Experience } from '../content/experiences'
import {
  companyInitials,
  formatDuration,
  formatPeriod,
  sortedExperiences,
} from '../content/experiences'
import { formatDate, sortedPosts } from '../content/posts'
import { SITE_NAME, SITE_URL, personJsonLd, seo } from '../lib/seo'

export const Route = createFileRoute('/')({
  head: () =>
    seo({
      title: `${SITE_NAME} — ${profile.role} à Lyon`,
      description: profile.pitch,
      path: '/',
      jsonLd: [
        personJsonLd(),
        {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          '@id': `${SITE_URL}/#website`,
          url: SITE_URL,
          name: SITE_NAME,
          inLanguage: 'fr-FR',
          author: { '@id': `${SITE_URL}/#person` },
        },
      ],
    }),
  component: Home,
})

/**
 * Nombre d'expériences dépliées d'emblée. Les suivantes sont derrière un
 * « Voir plus » : la section tenait sur trois écrans, c'était le premier
 * obstacle entre l'accueil et le reste de la page.
 */
const VISIBLE_EXPERIENCES = 3

/** Les missions en entreprise : l'entrée « Open source » n'en est pas une. */
const missionCount = sortedExperiences.filter(
  (item) => item.company !== 'Open source',
).length

const facts = [
  {
    label: 'Expérience',
    value: `${profile.yearsOfExperience} ans, ${missionCount} missions`,
  },
  { label: 'Stack', value: 'Symfony · React & TypeScript' },
  { label: 'IA appliquée', value: 'Agents · LLM · outillage · MCP · n8n' },
  { label: 'Zone', value: profile.area },
]

function Home() {
  const recentExperiences = sortedExperiences.slice(0, VISIBLE_EXPERIENCES)
  const olderExperiences = sortedExperiences.slice(VISIBLE_EXPERIENCES)
  const visibleEducation = education.filter((item) => isFilled(item.school))
  const featured = projects.filter((project) => project.featured)
  const latestPosts = sortedPosts.slice(0, 2)

  return (
    <div className="mx-auto max-w-5xl px-6">
      <Hero />

      <Section
        title="Services"
        id="services"
        intro="Trois prestations avec leur page dédiée, et des interventions plus courtes sur un sujet précis."
      >
        <ServicesGrid />
        <p className="mt-6 text-sm">
          <Link
            to="/services"
            className="font-medium text-sky-600 hover:underline dark:text-sky-400"
          >
            Tous les services et la façon dont je travaille →
          </Link>
        </p>
        <p className="mt-2 text-sm">
          <Link
            to="/agence"
            className="font-medium text-sky-600 hover:underline dark:text-sky-400"
          >
            {agency.teaser} →
          </Link>
        </p>
      </Section>

      <Section title="À propos" id="a-propos">
        <div className="max-w-2xl space-y-4 text-slate-600 dark:text-slate-400">
          {profile.about.map((paragraph) => (
            <p key={paragraph} className="leading-relaxed text-pretty">
              {paragraph}
            </p>
          ))}
        </div>
      </Section>

      <Section title="Technologies" id="technologies">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {skills.map((group) => (
            <div key={group.title}>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {group.title}
              </h3>
              <ul className="mt-3 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      {sortedExperiences.length > 0 && (
        <Section
          title="Expériences"
          id="experiences"
          intro="Des marketplaces, une plateforme de streaming, une application de soin animalier, et en parallèle de l’outillage open source pour agents IA."
        >
          <ol className="space-y-8">
            {recentExperiences.map((item) => (
              <ExperienceItem
                key={`${item.company}-${item.startDate}`}
                item={item}
              />
            ))}
          </ol>
          {olderExperiences.length > 0 && (
            // `<details>` plutôt qu'un état React : le repli fonctionne sur la
            // page prérendue, avant même l'hydratation. Même parti pris que la
            // FAQ des pages service.
            <details className="group mt-8">
              <summary className="inline-flex cursor-pointer list-none items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-900">
                <span className="group-open:hidden">
                  Voir les {olderExperiences.length} expériences précédentes
                </span>
                <span className="hidden group-open:inline">
                  Masquer les expériences précédentes
                </span>
                <span
                  aria-hidden="true"
                  className="text-slate-400 transition-transform group-open:rotate-180"
                >
                  ↓
                </span>
              </summary>
              <ol
                start={VISIBLE_EXPERIENCES + 1}
                className="mt-8 space-y-8 border-t border-slate-200 pt-8 dark:border-slate-800"
              >
                {olderExperiences.map((item) => (
                  <ExperienceItem
                    key={`${item.company}-${item.startDate}`}
                    item={item}
                  />
                ))}
              </ol>
            </details>
          )}
          <p className="mt-6 text-sm">
            <a
              href={links.linkedin}
              target="_blank"
              rel="noreferrer me"
              className="text-sky-600 hover:underline dark:text-sky-400"
            >
              Le parcours complet sur LinkedIn →
            </a>
          </p>
        </Section>
      )}

      {visibleEducation.length > 0 && (
        <Section title="Diplômes" id="diplomes">
          <ul className="space-y-6">
            {visibleEducation.map((item) => (
              <li
                key={`${item.school}-${item.year}`}
                className="border-l-2 border-slate-200 pl-5 dark:border-slate-800"
              >
                <p className="text-xs font-medium tracking-wide text-slate-500 uppercase dark:text-slate-500">
                  {item.year}
                </p>
                <h3 className="mt-1 font-semibold text-slate-900 dark:text-slate-100">
                  {item.degree}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {item.school}
                </p>
                {item.detail && (
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                    {item.detail}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </Section>
      )}

      <Section
        title="Projets ouverts"
        id="projets"
        intro="Ce que je construis sur mon temps libre, et que j’utilise tous les jours."
      >
        <ul className="grid gap-4 sm:grid-cols-2">
          {featured.map((project) => (
            <li key={project.name}>
              <a
                href={project.url}
                target="_blank"
                rel="noreferrer"
                className="flex h-full flex-col rounded-xl border border-slate-200 p-5 transition-colors hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:hover:border-slate-700 dark:hover:bg-slate-900"
              >
                <div className="flex items-center gap-3">
                  {/* Le nom suit juste à côté : l'icône est décorative. */}
                  <img
                    src={projectIcon(project)}
                    alt=""
                    width={128}
                    height={128}
                    loading="lazy"
                    className="h-10 w-10 shrink-0 rounded-lg ring-1 ring-slate-200 dark:ring-white/10"
                  />
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                    {project.name}
                  </h3>
                </div>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  {project.description}
                </p>
                <p className="mt-3 text-xs text-slate-500 dark:text-slate-500">
                  {project.tags.join(' · ')}
                </p>
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm">
          <Link
            to="/projets"
            className="text-sky-600 hover:underline dark:text-sky-400"
          >
            Tous les projets, avec leurs dépôts et leurs sites →
          </Link>
        </p>
      </Section>

      <Section title="Derniers articles" id="articles">
        <ul className="grid gap-4 sm:grid-cols-2">
          {latestPosts.map((post) => (
            <li key={post.slug}>
              <Link
                to="/blog/$slug"
                params={{ slug: post.slug }}
                className="block h-full rounded-xl border border-slate-200 p-5 transition-colors hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:hover:border-slate-700 dark:hover:bg-slate-900"
              >
                <time
                  dateTime={post.date}
                  className="text-xs text-slate-500 dark:text-slate-500"
                >
                  {formatDate(post.date)}
                </time>
                <h3 className="mt-1 font-semibold text-slate-900 dark:text-slate-100">
                  {post.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  {post.excerpt}
                </p>
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm">
          <Link
            to="/blog"
            className="text-sky-600 hover:underline dark:text-sky-400"
          >
            Tous les articles →
          </Link>
        </p>
      </Section>
    </div>
  )
}

/** Une mission de la section « Expériences », dépliée ou repliée. */
function ExperienceItem({ item }: { item: Experience }) {
  return (
    <li className="border-l-2 border-slate-200 pl-5 dark:border-slate-800">
      <div className="flex items-start gap-4">
        <ExperienceLogo item={item} />
        <div>
          <p className="text-xs font-medium tracking-wide text-slate-500 uppercase dark:text-slate-500">
            {formatPeriod(item)} · {formatDuration(item)}
          </p>
          <h3 className="mt-1 font-semibold text-slate-900 dark:text-slate-100">
            {item.role} · {item.company}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-500">{item.location}</p>
        </div>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
        {item.summary}
      </p>
      {item.stack.length > 0 && (
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-500">
          {item.stack.join(' · ')}
        </p>
      )}
      {item.sections.length > 0 && (
        <div className="mt-3 divide-y divide-slate-200 rounded-xl border border-slate-200 dark:divide-slate-800 dark:border-slate-800">
          {item.sections.map((section) => (
            <details key={section.title} className="group px-4 py-3">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-medium text-slate-900 dark:text-slate-100">
                {section.title}
                <span
                  aria-hidden="true"
                  className="text-slate-400 transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <ul className="mt-3 space-y-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                {section.items.map((point) => (
                  <li key={point} className="flex gap-2">
                    <span aria-hidden="true">–</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </details>
          ))}
        </div>
      )}
    </li>
  )
}

/** Le logo de l'entreprise, ou ses initiales tant qu'il n'y en a pas dans Notion. */
function ExperienceLogo({ item }: { item: Experience }) {
  if (item.logo) {
    return (
      <img
        src={item.logo}
        alt=""
        width={48}
        height={48}
        loading="lazy"
        className="h-10 w-10 shrink-0 rounded-lg object-contain ring-1 ring-slate-200 dark:bg-white dark:ring-white/10"
      />
    )
  }
  return (
    <span
      aria-hidden="true"
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-semibold text-slate-500 ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:ring-white/10"
    >
      {companyInitials(item.company)}
    </span>
  )
}

/**
 * Le premier écran : une promesse, deux actions, et une fiche de faits à
 * droite. Pas de carrousel : tout se lit d'un coup. Le mouvement est
 * purement décoratif et en CSS (styles.css, `animate-hero-*`) : les blocs
 * apparaissent en cascade au chargement, les halos dérivent lentement, le
 * mot clé du titre brille. Tout est derrière `motion-safe:`, donc désactivé
 * pour qui a demandé moins d'animations.
 */
function Hero() {
  return (
    <section className="relative py-16 sm:py-24">
      {/* Halos de fond. Ils débordent du conteneur ; `overflow-x: clip` sur
          <html> (styles.css) évite qu'ils créent un défilement horizontal. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -right-40 -left-40 -z-10 h-[36rem]"
      >
        {/* Quadrillage fin qui glisse en diagonale, fondu vers le bas. */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-slate-900)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-slate-900)_1px,transparent_1px)] bg-[size:2.5rem_2.5rem] opacity-[0.045] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent)] motion-safe:animate-hero-grid dark:bg-[linear-gradient(to_right,var(--color-slate-100)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-slate-100)_1px,transparent_1px)] dark:opacity-[0.06]" />
        <div className="absolute top-0 right-0 h-[30rem] w-[30rem] rounded-full bg-sky-200/50 blur-3xl motion-safe:animate-hero-drift dark:bg-sky-900/30" />
        <div className="absolute top-48 left-0 h-72 w-72 rounded-full bg-slate-200/70 blur-3xl motion-safe:animate-hero-drift-slow dark:bg-slate-800/40" />
        <div className="absolute top-64 right-1/3 h-56 w-56 rounded-full bg-indigo-200/40 blur-3xl motion-safe:animate-hero-drift-slow dark:bg-indigo-900/25" />
      </div>

      <div className="grid gap-12 lg:grid-cols-[1.35fr_1fr] lg:items-center">
        <div>
          <p className="text-sm font-medium tracking-widest text-sky-600 uppercase motion-safe:animate-hero-rise dark:text-sky-400">
            {profile.role} · Lyon
          </p>
          <h1 className="mt-5 text-4xl font-bold tracking-tight text-balance text-slate-900 motion-safe:animate-hero-rise motion-safe:[animation-delay:100ms] sm:text-5xl lg:text-[3.4rem] lg:leading-[1.08] dark:text-slate-100">
            Des applications web{' '}
            <span className="bg-linear-to-r from-sky-600 via-indigo-500 to-sky-600 bg-[length:200%_auto] bg-clip-text text-transparent motion-safe:animate-hero-shine dark:from-sky-400 dark:via-indigo-300 dark:to-sky-400">
              solides
            </span>
            , de l’API à l’interface.
          </h1>
          <p className="mt-5 text-base font-medium text-pretty text-slate-800 motion-safe:animate-hero-rise motion-safe:[animation-delay:200ms] dark:text-slate-200">
            {profile.headline}
          </p>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-pretty text-slate-600 motion-safe:animate-hero-rise motion-safe:[animation-delay:300ms] dark:text-slate-400">
            {profile.name}, développeur web depuis 2013 : des API Symfony et
            des interfaces React pour des marketplaces, une plateforme de
            streaming et une application de soin animalier. Lead developer
            chez Animalink jusqu’en septembre 2026, et des agents LLM qui
            livrent du code sur mon temps libre.
          </p>

          <div className="mt-8 flex flex-wrap gap-3 motion-safe:animate-hero-rise motion-safe:[animation-delay:400ms]">
            <Link
              to="/contact"
              className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition-all hover:-translate-y-0.5 hover:bg-slate-700 hover:shadow-lg hover:shadow-slate-900/20 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white dark:hover:shadow-white/10"
            >
              Discuter de votre projet
            </Link>
            <Link
              to="/services"
              className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 transition-all hover:-translate-y-0.5 hover:border-slate-400 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-900"
            >
              Voir les services
            </Link>
            <a
              href={links.github}
              target="_blank"
              rel="noreferrer"
              className="rounded-lg px-5 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
            >
              GitHub ↗
            </a>
          </div>

          <p className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-500 motion-safe:animate-hero-rise motion-safe:[animation-delay:500ms] dark:text-slate-500">
            <span>Développement sur mesure</span>
            <span aria-hidden="true">·</span>
            <span>Audit de sécurité</span>
            <span aria-hidden="true">·</span>
            <span>Intégration IA</span>
          </p>
        </div>

        <aside
          aria-label="En bref"
          className="rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-xl shadow-slate-200/50 backdrop-blur transition-shadow hover:shadow-2xl hover:shadow-sky-200/40 motion-safe:animate-hero-rise motion-safe:[animation-delay:350ms] dark:border-slate-800 dark:bg-slate-900/70 dark:shadow-none dark:hover:shadow-none"
        >
          <p className="flex items-center gap-2 text-sm font-medium text-slate-900 dark:text-slate-100">
            <span aria-hidden="true" className="relative inline-flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 motion-safe:animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            Ouvert à de nouvelles missions
          </p>
          <dl className="mt-5 divide-y divide-slate-100 text-sm dark:divide-slate-800">
            {facts.map((fact) => (
              <div
                key={fact.label}
                className="grid grid-cols-[6.5rem_1fr] gap-3 py-2.5"
              >
                <dt className="text-xs font-medium tracking-wide text-slate-500 uppercase dark:text-slate-500">
                  {fact.label}
                </dt>
                <dd className="text-slate-800 dark:text-slate-200">
                  {fact.value}
                </dd>
              </div>
            ))}
          </dl>
        </aside>
      </div>
    </section>
  )
}

function Section({
  title,
  id,
  intro,
  children,
}: {
  title: string
  id: string
  intro?: string
  children: React.ReactNode
}) {
  return (
    <section
      id={id}
      className="scroll-mt-24 border-t border-slate-200 py-12 lg:grid lg:grid-cols-[14rem_1fr] lg:gap-10 dark:border-slate-800"
    >
      <div className="mb-6 lg:mb-0">
        <h2 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100">
          {title}
        </h2>
        {intro && (
          <p className="mt-2 text-sm leading-relaxed text-pretty text-slate-500 dark:text-slate-400">
            {intro}
          </p>
        )}
      </div>
      <div>{children}</div>
    </section>
  )
}
