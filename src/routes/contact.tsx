import { Link, createFileRoute } from '@tanstack/react-router'

import { links, profile } from '../content/profile'
import { servicePath, services } from '../content/services'
import { seo } from '../lib/seo'

export const Route = createFileRoute('/contact')({
  head: () =>
    seo({
      title: 'Contact',
      description:
        'Contacter Salvador Cardona, développeur web freelance à Lyon, pour un projet de développement, un audit ou une intégration IA : e-mail, LinkedIn, GitHub.',
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
    hint: 'Le plus direct. Je réponds sous deux jours ouvrés.',
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
      <h1 className="text-4xl font-bold tracking-tight text-stone-900">
        Contact
      </h1>
      <p className="mt-4 text-lg text-stone-600">
        {profile.availability}
      </p>
      <p className="mt-4 leading-relaxed text-stone-600">
        Une proposition de mission, une question technique, une envie de
        collaborer sur un projet ouvert : l’e-mail reste le canal le plus fiable.
        Décrivez le contexte en quelques lignes, je réponds avec des questions
        ou un créneau pour en parler.
      </p>

      <ul className="mt-6 flex flex-wrap gap-2 text-sm">
        {services.map((service) => (
          <li key={service.slug}>
            <Link
              to={servicePath(service.slug)}
              className="rounded-full border border-stone-200 px-3 py-1 text-stone-600 transition-colors hover:border-brand-300 hover:text-brand-600"
            >
              {service.name}
            </Link>
          </li>
        ))}
      </ul>

      <ul className="mt-10 space-y-3">
        {channels.map((channel) => (
          <li key={channel.label}>
            <a
              href={channel.href}
              {...(channel.external
                ? { target: '_blank', rel: 'noreferrer me' }
                : {})}
              className="flex flex-col gap-1 rounded-xl border border-stone-200 p-5 transition-colors hover:border-stone-300 hover:bg-stone-50 sm:flex-row sm:items-center sm:justify-between sm:gap-6"
            >
              <span>
                <span className="block font-semibold text-stone-900">
                  {channel.label}
                </span>
                <span className="mt-1 block text-sm text-stone-500">
                  {channel.hint}
                </span>
              </span>
              <span className="text-sm text-brand-600">
                {channel.value}
              </span>
            </a>
          </li>
        ))}
      </ul>

      <p className="mt-10 text-sm text-stone-500">
        {profile.location} · {profile.role}
      </p>
    </div>
  )
}
