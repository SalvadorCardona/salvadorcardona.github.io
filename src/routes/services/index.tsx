import { Link, createFileRoute } from '@tanstack/react-router'

import { CallToAction } from '../../components/ServicePage'
import { ServiceCard } from '../../components/ServiceCard'
import { ServiceIcon } from '../../components/ServiceIcon'
import { profile } from '../../content/profile'
import { interventions, servicePath, services } from '../../content/services'
import {
  PERSON_ID,
  SITE_URL,
  breadcrumbJsonLd,
  personJsonLd,
  seo,
} from '../../lib/seo'

export const Route = createFileRoute('/services/')({
  head: () =>
    seo({
      title: 'Services : développement web, audit de sécurité et intégration IA',
      description:
        'Développeur web freelance à Lyon. Trois prestations : développement sur mesure (Symfony, React), audit de sécurité, mise en place de l’IA.',
      path: '/services',
      jsonLd: [
        personJsonLd(),
        {
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: 'Services de Salvador Cardona',
          itemListElement: services.map((service, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: service.name,
            url: `${SITE_URL}${servicePath(service.slug)}`,
          })),
        },
        {
          '@context': 'https://schema.org',
          '@type': 'ProfessionalService',
          '@id': `${SITE_URL}/services#business`,
          name: 'Salvador Cardona — développement web, audit et IA',
          url: `${SITE_URL}/services`,
          founder: { '@id': PERSON_ID },
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Lyon',
            addressCountry: 'FR',
          },
          areaServed: 'France',
          priceRange: 'Sur devis',
        },
        breadcrumbJsonLd([
          { name: 'Accueil', path: '/' },
          { name: 'Services', path: '/services' },
        ]),
      ],
    }),
  component: ServicesIndex,
})

const method = [
  {
    title: 'Comprendre avant de coder',
    description:
      'Chaque mission commence par un échange sur le métier, l’existant et ce qui vous empêche de dormir. La stack vient après.',
  },
  {
    title: 'Un périmètre écrit',
    description:
      'Une proposition claire : ce qui est inclus, ce qui ne l’est pas, le prix et le mode de facturation. Pas de surprise à la facture.',
  },
  {
    title: 'Livrer souvent',
    description:
      'Des lots courts, une démonstration à chaque étape, et du code que votre équipe peut lire, relire et reprendre.',
  },
  {
    title: 'Transmettre',
    description:
      'Une mission se termine quand l’équipe peut continuer sans moi : documentation, passation, formation si besoin.',
  },
]

function ServicesIndex() {
  return (
    <div className="mx-auto max-w-5xl px-6">
      <header className="py-16 lg:py-20">
        <p className="text-sm font-medium tracking-widest text-sky-600 uppercase dark:text-sky-400">
          Services
        </p>
        <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight text-balance text-slate-900 sm:text-5xl dark:text-slate-100">
          Développement web, audit de sécurité et intégration IA
        </h1>
        <p className="mt-6 max-w-2xl text-xl leading-relaxed text-pretty text-slate-600 dark:text-slate-400">
          Trois prestations, un seul interlocuteur. {profile.yearsOfExperience}{' '}
          ans à construire des applications web, à {profile.area},
          au forfait ou en régie.
        </p>
      </header>

      <section aria-labelledby="prestations">
        <h2 id="prestations" className="sr-only">
          Les prestations
        </h2>
        <div className="grid gap-5 lg:grid-cols-3">
          {services.map((service) => (
            <ServiceCard key={service.slug} service={service} />
          ))}
        </div>
      </section>

      <section
        id="interventions"
        className="mt-20 scroll-mt-24 border-t border-slate-200 py-12 lg:grid lg:grid-cols-[14rem_1fr] lg:gap-10 dark:border-slate-800"
      >
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            Interventions ponctuelles
          </h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Quelques jours, un sujet précis.
          </p>
        </div>
        <ul className="mt-6 space-y-6 lg:mt-0">
          {interventions.map((item) => (
            <li key={item.id} id={item.id} className="flex gap-4 scroll-mt-24">
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-600 ring-1 ring-sky-100 dark:bg-sky-950/60 dark:text-sky-400 dark:ring-sky-900">
                <ServiceIcon name={item.icon} className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                  {item.name}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  {item.excerpt}
                </p>
                <Link
                  to={servicePath(item.service)}
                  className="mt-2 inline-block text-sm font-medium text-sky-600 hover:underline dark:text-sky-400"
                >
                  Voir la prestation associée →
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="border-t border-slate-200 py-12 lg:grid lg:grid-cols-[14rem_1fr] lg:gap-10 dark:border-slate-800">
        <h2 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100">
          Comment je travaille
        </h2>
        <ol className="mt-6 grid gap-6 sm:grid-cols-2 lg:mt-0">
          {method.map((step, index) => (
            <li key={step.title}>
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
      </section>

      <CallToAction />
    </div>
  )
}
