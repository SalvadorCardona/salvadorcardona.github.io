import { createFileRoute } from '@tanstack/react-router'

import { links, profile } from '../content/profile'
import { seo } from '../lib/seo'

export const Route = createFileRoute('/contact')({
  head: () =>
    seo({
      title: 'Contact',
      description:
        'Écrire à Salvador Cardona : e-mail, LinkedIn, GitHub, X, Instagram.',
      path: '/contact',
    }),
  component: Contact,
})

/**
 * Pas de formulaire : un site statique n'a pas de backend pour recevoir un
 * POST. Un `mailto:` ouvre le client mail du visiteur, sans service tiers,
 * sans cookie et sans clé d'API à gérer.
 */
const channels = [
  {
    label: 'E-mail',
    value: links.email,
    href: `mailto:${links.email}`,
    hint: 'Le plus direct. Je réponds sous quelques jours.',
    external: false,
  },
  {
    label: 'LinkedIn',
    value: 'salvador-cardona',
    href: links.linkedin,
    hint: 'Parcours professionnel et mise en relation.',
    external: true,
  },
  {
    label: 'GitHub',
    value: 'SalvadorCardona',
    href: links.github,
    hint: 'Le code, les projets ouverts, les issues.',
    external: true,
  },
  {
    label: 'X',
    value: '@salvadevme',
    href: links.x,
    hint: 'Notes courtes sur le dev et l’IA.',
    external: true,
  },
  {
    label: 'Instagram',
    value: '@salvadorcardona81',
    href: links.instagram,
    hint: 'Le reste.',
    external: true,
  },
]

function Contact() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
        Contact
      </h1>
      <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
        {profile.availability}
      </p>
      <p className="mt-4 leading-relaxed text-slate-600 dark:text-slate-400">
        Une question technique, une proposition de mission, une envie de
        collaborer sur un projet ouvert : l’e-mail reste le canal le plus fiable.
      </p>

      <ul className="mt-10 space-y-3">
        {channels.map((channel) => (
          <li key={channel.label}>
            <a
              href={channel.href}
              {...(channel.external
                ? { target: '_blank', rel: 'noreferrer me' }
                : {})}
              className="flex flex-col gap-1 rounded-xl border border-slate-200 p-5 transition-colors hover:border-slate-300 hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between sm:gap-6 dark:border-slate-800 dark:hover:border-slate-700 dark:hover:bg-slate-900"
            >
              <span>
                <span className="block font-semibold text-slate-900 dark:text-slate-100">
                  {channel.label}
                </span>
                <span className="mt-1 block text-sm text-slate-500 dark:text-slate-500">
                  {channel.hint}
                </span>
              </span>
              <span className="text-sm text-sky-600 dark:text-sky-400">
                {channel.value}
              </span>
            </a>
          </li>
        ))}
      </ul>

      <p className="mt-10 text-sm text-slate-500 dark:text-slate-500">
        {profile.location} · {profile.role}
      </p>
    </div>
  )
}
