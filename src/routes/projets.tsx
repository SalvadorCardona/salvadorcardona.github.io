import { createFileRoute } from '@tanstack/react-router'

import type { Project } from '../content/profile'
import { links, projectBanner, projects } from '../content/profile'
import { seo } from '../lib/seo'

export const Route = createFileRoute('/projets')({
  head: () =>
    seo({
      title: 'Projets',
      description:
        'Tous les projets de Salvador Cardona : dépôt GitHub, site en ligne et documentation — ticket-runner, React Resource View, Whisper Desk, Lead Finder, Claude Usage, React Data Form, jsonld-api-client, react-mini-i18n.',
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
      <h1 className="text-4xl font-bold tracking-tight text-stone-900">
        Projets
      </h1>
      <p className="mt-4 text-lg text-stone-600">
        Ce que je construis en dehors des heures de bureau, et parfois dedans :
        des applications complètes, des librairies React, des outils de bureau.{' '}
        {projects.length} projets, chacun avec son dépôt et, quand ils existent,
        son site en ligne et sa documentation.
      </p>

      <ul className="mt-12 space-y-8">
        {projects.map((project) => (
          <li
            key={project.name}
            className="overflow-hidden rounded-2xl border border-stone-200 transition-colors hover:border-stone-300"
          >
            <article>
              {/* La bannière vient du dépôt brand-assets : glyphe, nom du
                  projet et sa phrase d'accroche, déjà composés. Elle est en
                  21:9, recadrée en 24:7 — tout est au centre, et la carte
                  reste compacte. */}
              <img
                src={projectBanner(project)}
                alt={`Bannière du projet ${project.name}`}
                width={1200}
                height={525}
                loading="lazy"
                className="aspect-[24/7] w-full bg-stone-900 object-cover"
              />

              <div className="p-6">
                <h2 className="text-xl font-semibold tracking-tight text-stone-900">
                  {project.name}
                </h2>
                <p className="mt-3 leading-relaxed text-stone-600">
                  {project.description}
                </p>

                <p className="mt-4 text-xs text-stone-500">
                  {project.tags.join(' · ')}
                </p>

                <ProjectLinks project={project} />
              </div>
            </article>
          </li>
        ))}
      </ul>

      <p className="mt-10 text-sm">
        <a
          href={links.github}
          target="_blank"
          rel="noreferrer"
          className="text-brand-600 hover:underline"
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
            className="font-medium text-brand-600 hover:underline"
          >
            {target.label} →
          </a>
        </li>
      ))}
    </ul>
  )
}
