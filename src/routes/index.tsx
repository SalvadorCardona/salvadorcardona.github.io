import { Link, createFileRoute } from '@tanstack/react-router'

import { ServicesGrid } from '../components/ServiceCard'
import {
  education,
  experiences,
  isFilled,
  links,
  profile,
  projects,
  skills,
} from '../content/profile'
import { formatDate, sortedPosts } from '../content/posts'
import { SITE_NAME, SITE_URL, personJsonLd, seo } from '../lib/seo'

export const Route = createFileRoute('/')({
  head: () =>
    seo({
      title: `${SITE_NAME} — Développeur web full-stack indépendant à Lyon`,
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

const facts = [
  { label: 'Expérience', value: `${profile.yearsOfExperience} ans, dix missions` },
  { label: 'Aujourd’hui', value: 'Lead developer chez Animalink' },
  { label: 'Stack', value: 'Symfony · API Platform · React · TypeScript' },
  { label: 'IA appliquée', value: 'Agents LLM · n8n · MCP · Ollama' },
  { label: 'Zone', value: profile.area },
]

function Home() {
  const visibleExperiences = experiences.filter((item) =>
    isFilled(item.company),
  )
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

      {visibleExperiences.length > 0 && (
        <Section
          title="Expériences"
          id="experiences"
          intro="Des marketplaces, une plateforme de streaming, un studio de jeu, une application de soin animalier. Le détail sur LinkedIn."
        >
          <ol className="space-y-8">
            {visibleExperiences.map((item) => (
              <li
                key={`${item.company}-${item.period}`}
                className="border-l-2 border-slate-200 pl-5 dark:border-slate-800"
              >
                <p className="text-xs font-medium tracking-wide text-slate-500 uppercase dark:text-slate-500">
                  {item.period}
                </p>
                <h3 className="mt-1 font-semibold text-slate-900 dark:text-slate-100">
                  {item.role} · {item.company}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  {item.description}
                </p>
                {item.stack.length > 0 && (
                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-500">
                    {item.stack.join(' · ')}
                  </p>
                )}
              </li>
            ))}
          </ol>
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
        intro="Ce que je construis sur mon temps propre, et que j’utilise tous les jours."
      >
        <ul className="grid gap-4 sm:grid-cols-2">
          {featured.map((project) => (
            <li key={project.name}>
              <a
                href={project.url}
                target="_blank"
                rel="noreferrer"
                className="block h-full rounded-xl border border-slate-200 p-5 transition-colors hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:hover:border-slate-700 dark:hover:bg-slate-900"
              >
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                  {project.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
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
          <a
            href={links.github}
            target="_blank"
            rel="noreferrer"
            className="text-sky-600 hover:underline dark:text-sky-400"
          >
            Tous les dépôts sur GitHub →
          </a>
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

/**
 * Le premier écran : une promesse, deux actions, et une fiche de faits à
 * droite. Pas de carrousel — rien ne bouge, tout se lit d'un coup.
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
        <div className="absolute top-0 right-0 h-[30rem] w-[30rem] rounded-full bg-sky-200/50 blur-3xl dark:bg-sky-900/30" />
        <div className="absolute top-48 left-0 h-72 w-72 rounded-full bg-slate-200/70 blur-3xl dark:bg-slate-800/40" />
      </div>

      <div className="grid gap-12 lg:grid-cols-[1.35fr_1fr] lg:items-center">
        <div>
          <p className="text-sm font-medium tracking-widest text-sky-600 uppercase dark:text-sky-400">
            {profile.role} · Lyon
          </p>
          <h1 className="mt-5 text-4xl font-bold tracking-tight text-balance text-slate-900 sm:text-5xl lg:text-[3.4rem] lg:leading-[1.08] dark:text-slate-100">
            Des applications web solides, auditées, et prêtes pour l’IA.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-pretty text-slate-600 dark:text-slate-400">
            {profile.name}, {profile.yearsOfExperience} ans à concevoir des
            API Symfony et des interfaces React pour des marketplaces, une
            plateforme de streaming et un studio de jeu. Aujourd’hui lead
            developer chez Animalink, et disponible pour votre projet.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/contact"
              className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
            >
              Discuter de votre projet
            </Link>
            <Link
              to="/services"
              className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-900"
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

          <p className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-500 dark:text-slate-500">
            <span>Développement sur mesure</span>
            <span aria-hidden="true">·</span>
            <span>Audit de sécurité</span>
            <span aria-hidden="true">·</span>
            <span>Intégration IA</span>
          </p>
        </div>

        <aside
          aria-label="En bref"
          className="rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-xl shadow-slate-200/50 backdrop-blur dark:border-slate-800 dark:bg-slate-900/70 dark:shadow-none"
        >
          <p className="flex items-center gap-2 text-sm font-medium text-slate-900 dark:text-slate-100">
            <span
              aria-hidden="true"
              className="inline-block h-2 w-2 rounded-full bg-emerald-500"
            />
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
