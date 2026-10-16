import { Link, createFileRoute } from '@tanstack/react-router'

import { TeamMemberCard } from '../components/TeamMemberCard'
import { agency } from '../content/agency'
import { team } from '../content/team'
import { breadcrumbJsonLd, seo } from '../lib/seo'

export const Route = createFileRoute('/notre-equipe')({
  head: () =>
    seo({
      title: 'Notre équipe : les personnes derrière l’agence Hermez à Lyon',
      description:
        'Hermez est une agence digitale lyonnaise à taille humaine. Découvrez l’équipe qui conçoit et construit vos sites, applications métier et projets d’IA.',
      path: '/notre-equipe',
      jsonLd: [
        breadcrumbJsonLd([
          { name: 'Accueil', path: '/' },
          { name: 'Notre équipe', path: '/notre-equipe' },
        ]),
      ],
    }),
  component: Team,
})

/** L'agence présentée par son équipe : une introduction, puis une carte par membre. */
function Team() {
  return (
    <div className="mx-auto max-w-5xl px-6">
      <header className="py-16 lg:py-20">
        <p className="text-sm font-medium tracking-widest text-brand-600 uppercase">
          Notre équipe
        </p>
        <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight text-balance text-stone-900 sm:text-5xl">
          Les personnes qui construisent votre projet
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-pretty text-stone-600">
          {agency.about[0]}
        </p>
      </header>

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
        <p className="mt-8 text-sm">
          <Link
            to="/services"
            className="font-medium text-brand-600 hover:underline"
          >
            Voir nos services →
          </Link>
        </p>
      </section>
    </div>
  )
}
