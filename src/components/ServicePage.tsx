import { Link } from '@tanstack/react-router'

import { formatDate, getPost } from '../content/posts'
import { links, profile } from '../content/profile'
import type { Service } from '../content/services'
import { getService, servicePath, services } from '../content/services'
import {
  PERSON_ID,
  SITE_URL,
  breadcrumbJsonLd,
  personJsonLd,
  seo,
} from '../lib/seo'
import { ServiceCard } from './ServiceCard'
import { ServiceIcon } from './ServiceIcon'

/**
 * Le gabarit commun des trois pages service. Une seule structure HTML, un
 * seul jeu de données structurées : ce qui change d'une page à l'autre vit
 * dans `content/services.ts`.
 */

/** Le `head()` d'une route service : balises SEO et JSON-LD. */
export function serviceHead(slug: string) {
  const service = getService(slug)
  if (!service) return {}

  const path = servicePath(slug)

  return seo({
    title: service.title,
    description: service.description,
    path,
    jsonLd: [
      personJsonLd(),
      {
        '@context': 'https://schema.org',
        '@type': 'Service',
        '@id': `${SITE_URL}${path}#service`,
        name: service.name,
        serviceType: service.name,
        description: service.description,
        url: `${SITE_URL}${path}`,
        provider: { '@id': PERSON_ID },
        areaServed: [
          { '@type': 'City', name: 'Lyon' },
          { '@type': 'Country', name: 'France' },
        ],
        availableChannel: {
          '@type': 'ServiceChannel',
          serviceUrl: `${SITE_URL}/contact`,
          availableLanguage: ['fr'],
        },
        keywords: service.stack.join(', '),
      },
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: service.faq.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: { '@type': 'Answer', text: item.answer },
        })),
      },
      breadcrumbJsonLd([
        { name: 'Accueil', path: '/' },
        { name: 'Services', path: '/services' },
        { name: service.name, path },
      ]),
    ],
  })
}

export function ServicePage({ slug }: { slug: string }) {
  const service = getService(slug)
  if (!service) return null

  const others = services.filter((item) => item.slug !== slug)
  const related = service.relatedPosts
    .map((postSlug) => getPost(postSlug))
    .filter((post) => post !== undefined)

  return (
    <div className="mx-auto max-w-5xl px-6">
      <Breadcrumb service={service} />

      <header className="grid gap-10 py-10 lg:grid-cols-[1fr_18rem] lg:items-start lg:py-16">
        <div>
          <p className="text-sm font-medium tracking-widest text-sky-600 uppercase dark:text-sky-400">
            Service
          </p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-balance text-slate-900 sm:text-4xl lg:text-5xl dark:text-slate-100">
            {service.title}
          </h1>
          <p className="mt-6 text-xl leading-relaxed text-pretty text-slate-600 dark:text-slate-400">
            {service.lead}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/contact"
              className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
            >
              Discuter de votre projet
            </Link>
            <a
              href="#deroulement"
              className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-900"
            >
              Comment ça se passe
            </a>
          </div>
        </div>

        <aside className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-sm dark:border-slate-800 dark:bg-slate-900/60">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white text-sky-600 ring-1 ring-slate-200 dark:bg-slate-950 dark:text-sky-400 dark:ring-slate-800">
            <ServiceIcon name={service.icon} />
          </span>
          <dl className="mt-5 space-y-3">
            <Fact label="Par">
              {profile.name}, {profile.role.toLowerCase()}
            </Fact>
            <Fact label="Expérience">
              {profile.yearsOfExperience} ans d’applications web
            </Fact>
            <Fact label="Zone">{profile.area}</Fact>
            <Fact label="Facturation">Forfait ou régie, devis écrit</Fact>
          </dl>
        </aside>
      </header>

      <Section id="contexte" title="De quoi il s’agit">
        <div className="space-y-5 text-lg leading-relaxed text-pretty text-slate-600 dark:text-slate-400">
          {service.context.map((paragraph) => (
            <p key={paragraph.slice(0, 40)}>{paragraph}</p>
          ))}
        </div>
      </Section>

      <Section id="pour-qui" title="Pour qui">
        <ul className="grid gap-4 sm:grid-cols-2">
          {service.forWho.map((item) => (
            <li
              key={item}
              className="flex gap-3 rounded-xl border border-slate-200 p-4 text-sm leading-relaxed text-slate-700 dark:border-slate-800 dark:text-slate-300"
            >
              <Check />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="prestation" title="Ce que comprend la prestation">
        <div className="grid gap-5 sm:grid-cols-2">
          {service.includes.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-slate-200 p-6 dark:border-slate-800"
            >
              <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section id="deroulement" title="Comment ça se passe">
        <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {service.process.map((step, index) => (
            <li key={step.title} className="relative">
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

      <Section id="livrables" title="Ce que vous recevez">
        <ul className="space-y-3">
          {service.deliverables.map((item) => (
            <li
              key={item}
              className="flex gap-3 text-slate-700 dark:text-slate-300"
            >
              <Check />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <h3 className="mt-10 text-sm font-semibold text-slate-900 dark:text-slate-100">
          Technologies
        </h3>
        <ul className="mt-3 flex flex-wrap gap-2">
          {service.stack.map((item) => (
            <li
              key={item}
              className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700 dark:bg-slate-800 dark:text-slate-300"
            >
              {item}
            </li>
          ))}
        </ul>
      </Section>

      <Section id="faq" title="Questions fréquentes">
        <div className="divide-y divide-slate-200 rounded-2xl border border-slate-200 dark:divide-slate-800 dark:border-slate-800">
          {service.faq.map((item) => (
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

      {related.length > 0 && (
        <Section id="lectures" title="Pour aller plus loin">
          <ul className="grid gap-4 sm:grid-cols-2">
            {related.map((post) => (
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
                  <span className="mt-1 block font-semibold text-slate-900 dark:text-slate-100">
                    {post.title}
                  </span>
                  <span className="mt-2 block text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    {post.excerpt}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      )}

      <CallToAction />

      <section className="py-12">
        <h2 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100">
          Les autres services
        </h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          {others.map((item) => (
            <ServiceCard key={item.slug} service={item} />
          ))}
        </div>
      </section>
    </div>
  )
}

function Breadcrumb({ service }: { service: Service }) {
  return (
    <nav aria-label="Fil d’Ariane" className="pt-8 text-sm">
      <ol className="flex flex-wrap items-center gap-2 text-slate-500 dark:text-slate-400">
        <li>
          <Link
            to="/"
            className="transition-colors hover:text-sky-600 dark:hover:text-sky-400"
          >
            Accueil
          </Link>
        </li>
        <li aria-hidden="true">/</li>
        <li>
          <Link
            to="/services"
            className="transition-colors hover:text-sky-600 dark:hover:text-sky-400"
          >
            Services
          </Link>
        </li>
        <li aria-hidden="true">/</li>
        <li aria-current="page" className="text-slate-900 dark:text-slate-100">
          {service.name}
        </li>
      </ol>
    </nav>
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

function Fact({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div>
      <dt className="text-xs font-medium tracking-wide text-slate-500 uppercase dark:text-slate-500">
        {label}
      </dt>
      <dd className="mt-0.5 text-slate-800 dark:text-slate-200">{children}</dd>
    </div>
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

/** Le bandeau de fin de page, commun aux pages service et à `/services`. */
export function CallToAction() {
  return (
    <section className="my-12 rounded-3xl bg-slate-900 px-8 py-12 text-white sm:px-12 dark:bg-slate-100 dark:text-slate-900">
      <h2 className="text-2xl font-bold tracking-tight text-balance sm:text-3xl">
        Parlons de votre projet
      </h2>
      <p className="mt-4 max-w-2xl text-pretty text-slate-300 dark:text-slate-600">
        Un premier échange d’une heure, gratuit et sans engagement, pour
        comprendre votre besoin et vous dire franchement si je suis la bonne
        personne. {profile.area}.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          to="/contact"
          className="rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-slate-900 transition-colors hover:bg-slate-200 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-700"
        >
          Me contacter
        </Link>
        <a
          href={`mailto:${links.email}`}
          className="rounded-lg border border-slate-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:border-slate-400 hover:bg-slate-800 dark:border-slate-400 dark:text-slate-900 dark:hover:bg-slate-200"
        >
          {links.email}
        </a>
      </div>
    </section>
  )
}
