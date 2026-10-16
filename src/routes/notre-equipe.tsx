import { Link, createFileRoute } from '@tanstack/react-router'

import { TeamMemberCard } from '../components/TeamMemberCard'
import { agency, commitments } from '../content/agency'
import { team } from '../content/team'
import { breadcrumbJsonLd, seo } from '../lib/seo'

export const Route = createFileRoute('/notre-equipe')({
  head: () =>
    seo({
      title: 'À propos : l’agence Hermez et son équipe, à Lyon',
      description:
        'Hermez est une agence digitale lyonnaise à taille humaine : son modèle, ses engagements et l’équipe qui construit vos sites, applications et projets d’IA.',
      path: '/notre-equipe',
      jsonLd: [
        breadcrumbJsonLd([
          { name: 'Accueil', path: '/' },
          { name: 'À propos', path: '/notre-equipe' },
        ]),
      ],
    }),
  component: Team,
})

/**
 * La page « À propos » de l'agence : son positionnement (`agency.about`), ses
 * engagements, puis une carte par membre de l'équipe.
 */
function Team() {
  return (
    <div className="mx-auto max-w-5xl px-6">
      <header className="py-16 lg:py-20">
        <p className="text-sm font-medium tracking-widest text-brand-600 uppercase">
          À propos
        </p>
        <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight text-balance text-stone-900 sm:text-5xl">
          Une agence à taille humaine, et les personnes qui construisent votre
          projet
        </h1>
        <div className="mt-6 max-w-2xl space-y-5 text-lg leading-relaxed text-pretty text-stone-600">
          {agency.about.map((paragraph) => (
            <p key={paragraph.slice(0, 40)}>{paragraph}</p>
          ))}
        </div>
      </header>

      <section
        aria-labelledby="engagements"
        className="border-t border-stone-200 py-12"
      >
        <h2
          id="engagements"
          className="text-lg font-semibold tracking-tight text-stone-900"
        >
          Nos engagements
        </h2>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {commitments.map((item) => (
            <li
              key={item}
              className="rounded-xl border border-stone-200 p-4 text-sm leading-relaxed text-stone-700"
            >
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section
        id="equipe"
        aria-labelledby="membres"
        className="border-t border-stone-200 py-12"
      >
        <h2
          id="membres"
          className="text-lg font-semibold tracking-tight text-stone-900"
        >
          Les membres
        </h2>
        <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {team.map((member) => (
            <li key={member.id} className="flex">
              <TeamMemberCard member={member} />
            </li>
          ))}
        </ul>
        <p className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <Link
            to="/services"
            className="font-medium text-brand-600 hover:underline"
          >
            Voir nos services →
          </Link>
          <Link
            to="/references"
            className="font-medium text-brand-600 hover:underline"
          >
            Nos références →
          </Link>
        </p>
      </section>
    </div>
  )
}
