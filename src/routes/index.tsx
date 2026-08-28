import { Link, createFileRoute } from '@tanstack/react-router'

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
import { SITE_NAME, seo } from '../lib/seo'

export const Route = createFileRoute('/')({
  head: () =>
    seo({
      title: `${SITE_NAME} — Développeur web full-stack`,
      description: profile.intro,
      path: '/',
    }),
  component: Home,
})

function Home() {
  const visibleExperiences = experiences.filter((item) =>
    isFilled(item.company),
  )
  const visibleEducation = education.filter((item) => isFilled(item.school))
  const featured = projects.filter((project) => project.featured)
  const latestPosts = sortedPosts.slice(0, 2)

  return (
    <div className="mx-auto max-w-3xl px-6">
      <section className="py-16 sm:py-24">
        <p className="text-sm font-medium tracking-widest text-sky-600 uppercase dark:text-sky-400">
          {profile.role}
        </p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl dark:text-slate-100">
          {profile.name}
        </h1>
        <p className="mt-4 text-xl text-slate-600 dark:text-slate-400">
          {profile.tagline}
        </p>
        <p className="mt-6 leading-relaxed text-slate-600 dark:text-slate-400">
          {profile.intro}
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/contact"
            className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
          >
            Me contacter
          </Link>
          <Link
            to="/blog"
            className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-900"
          >
            Lire le blog
          </Link>
          <a
            href={links.github}
            target="_blank"
            rel="noreferrer"
            className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-900"
          >
            GitHub
          </a>
        </div>
      </section>

      <Section title="Technologies" id="technologies">
        <div className="grid gap-6 sm:grid-cols-2">
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
        <Section title="Expériences" id="experiences">
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

      <Section title="Projets" id="projets">
        <ul className="space-y-4">
          {featured.map((project) => (
            <li key={project.name}>
              <a
                href={project.url}
                target="_blank"
                rel="noreferrer"
                className="block rounded-xl border border-slate-200 p-5 transition-colors hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:hover:border-slate-700 dark:hover:bg-slate-900"
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
        <ul className="space-y-4">
          {latestPosts.map((post) => (
            <li key={post.slug}>
              <Link
                to="/blog/$slug"
                params={{ slug: post.slug }}
                className="block rounded-xl border border-slate-200 p-5 transition-colors hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:hover:border-slate-700 dark:hover:bg-slate-900"
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

function Section({
  title,
  id,
  children,
}: {
  title: string
  id: string
  children: React.ReactNode
}) {
  return (
    <section
      id={id}
      className="border-t border-slate-200 py-12 dark:border-slate-800"
    >
      <h2 className="mb-6 text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100">
        {title}
      </h2>
      {children}
    </section>
  )
}
