import { createFileRoute } from '@tanstack/react-router'

import type { Project } from '../content/profile'
import { links, projects } from '../content/profile'
import { seo } from '../lib/seo'

export const Route = createFileRoute('/projets')({
  head: () =>
    seo({
      title: 'Projets',
      description:
        'Tous les projets de Salvador Cardona : dépôt GitHub, site en ligne et documentation — Trader IA, Animalink, Lead Finder, React Data Form, React Resource View, ticket-runner, Linux Whisper, Claude Usage.',
      path: '/projets',
    }),
  component: Projects,
})

/**
 * Le point d'entrée vers tous les dépôts : chaque projet y renvoie, et les
 * dépôts renvoient ici en retour. Les liens sont écrits en dur dans le HTML
 * prérendu, sans `nofollow`, pour que le maillage soit suivi.
 */
function Projects() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
        Projets
      </h1>
      <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
        Ce que je construis en dehors des heures de bureau, et parfois dedans :
        des applications complètes, des librairies React, des outils de bureau.{' '}
        {projects.length} projets, chacun avec son dépôt et, quand ils existent,
        son site en ligne et sa documentation.
      </p>

      <ul className="mt-12 space-y-6">
        {projects.map((project) => (
          <li
            key={project.name}
            className="rounded-xl border border-slate-200 p-6 dark:border-slate-800"
          >
            <article>
              <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                {project.name}
              </h2>
              <p className="mt-3 leading-relaxed text-slate-600 dark:text-slate-400">
                {project.description}
              </p>

              <p className="mt-4 text-xs text-slate-500 dark:text-slate-500">
                {project.tags.join(' · ')}
              </p>

              <ProjectLinks project={project} />
            </article>
          </li>
        ))}
      </ul>

      <p className="mt-10 text-sm">
        <a
          href={links.github}
          target="_blank"
          rel="noreferrer"
          className="text-sky-600 hover:underline dark:text-sky-400"
        >
          Le reste des dépôts sur GitHub →
        </a>
      </p>
    </div>
  )
}

function ProjectLinks({ project }: { project: Project }) {
  const targets = [
    { label: 'Code source', href: project.url },
    { label: 'Site en ligne', href: project.site },
    { label: 'Documentation', href: project.docs },
  ].filter((target): target is { label: string; href: string } =>
    Boolean(target.href),
  )

  return (
    <ul className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
      {targets.map((target) => (
        <li key={target.label}>
          <a
            href={target.href}
            target="_blank"
            rel="noreferrer"
            className="font-medium text-sky-600 hover:underline dark:text-sky-400"
          >
            {target.label} →
          </a>
        </li>
      ))}
    </ul>
  )
}
