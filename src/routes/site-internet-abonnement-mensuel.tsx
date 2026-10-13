import { Link, createFileRoute } from '@tanstack/react-router'

import {
  COMPARISON_MONTHS,
  SUBSCRIPTION_PATH,
  commitments,
  offers,
  quote,
  subscription,
} from '../content/agency'
import {
  SITE_URL,
  agencyJsonLd,
  breadcrumbJsonLd,
  offerJsonLd,
  personJsonLd,
  seo,
} from '../lib/seo'

export const Route = createFileRoute('/site-internet-abonnement-mensuel')({
  head: () =>
    seo({
      title: subscription.title,
      description: subscription.description,
      path: SUBSCRIPTION_PATH,
      jsonLd: [
        personJsonLd(),
        {
          '@context': 'https://schema.org',
          '@type': 'Service',
          '@id': `${SITE_URL}${SUBSCRIPTION_PATH}#service`,
          name: 'Site internet en abonnement mensuel',
          serviceType: 'Création et maintenance de site internet',
          description: subscription.description,
          url: `${SITE_URL}${SUBSCRIPTION_PATH}`,
          provider: agencyJsonLd(),
          areaServed: [
            { '@type': 'City', name: 'Lyon' },
            { '@type': 'Country', name: 'France' },
          ],
          offers: offers.map(offerJsonLd),
        },
        {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: subscription.faq.map((item) => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: { '@type': 'Answer', text: item.answer },
          })),
        },
        breadcrumbJsonLd([
          { name: 'Accueil', path: '/' },
          { name: 'Site internet en abonnement', path: SUBSCRIPTION_PATH },
        ]),
      ],
    }),
  component: SubscriptionPage,
})

const euros = (amount: number) => `${amount.toLocaleString('fr-FR')} €`

function SubscriptionPage() {
  const [vitrine] = offers
  const classicTotal = quote.creation + quote.monthlyUpkeep * COMPARISON_MONTHS
  const rows = [
    {
      label: `Abonnement Vitrine (${vitrine.price} € HT × ${COMPARISON_MONTHS} mois)`,
      upfront: euros(0),
      total: euros(vitrine.price * COMPARISON_MONTHS),
    },
    {
      label: `Devis classique (création + ${quote.monthlyUpkeep} € HT / mois d’entretien)`,
      upfront: euros(quote.creation),
      total: euros(classicTotal),
    },
  ]

  return (
    <div className="mx-auto max-w-4xl px-6">
      <nav aria-label="Fil d’Ariane" className="pt-8 text-sm">
        <ol className="flex flex-wrap items-center gap-2 text-stone-500">
          <li>
            <Link to="/" className="transition-colors hover:text-brand-600">
              Accueil
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-stone-900">
            Site internet en abonnement
          </li>
        </ol>
      </nav>

      <header className="py-10 lg:py-16">
        <p className="text-sm font-medium tracking-widest text-brand-600 uppercase">
          Abonnement mensuel
        </p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-balance text-stone-900 sm:text-4xl lg:text-5xl">
          Un site internet en abonnement mensuel, sans facture de départ
        </h1>
        <p className="mt-6 text-xl leading-relaxed text-pretty text-stone-600">
          {subscription.lead}
        </p>
      </header>

      <Section title="Comment fonctionne l’abonnement">
        <div className="space-y-5 text-lg leading-relaxed text-pretty text-stone-600">
          {subscription.model.map((paragraph) => (
            <p key={paragraph.slice(0, 40)}>{paragraph}</p>
          ))}
        </div>
      </Section>

      <Section title="Ce que couvrent les 30 € et les 100 € HT par mois">
        <div className="grid gap-6 md:grid-cols-2">
          {offers.map((offer) => (
            <article
              key={offer.id}
              className="rounded-2xl border border-stone-200 p-6"
            >
              <h3 className="text-xl font-bold text-stone-900">
                {offer.name}
              </h3>
              <p className="mt-2 flex items-baseline gap-2">
                <span className="text-4xl font-extrabold tracking-tight text-stone-900">
                  {offer.price} €
                </span>
                <span className="text-sm text-stone-500">HT par mois</span>
              </p>
              <p className="mt-3 text-sm leading-relaxed text-stone-600">
                {offer.tagline}
              </p>
              <ul className="mt-5 space-y-2 text-sm leading-relaxed text-stone-700">
                {offer.includes.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span aria-hidden="true" className="text-brand-600">
                      ✓
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-xs text-stone-500">{offer.delivery}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section title="Abonnement ou devis classique : le calcul sur 3 ans">
        <p className="text-lg leading-relaxed text-pretty text-stone-600">
          Sur {COMPARISON_MONTHS} mois, la Vitrine coûte{' '}
          {euros(vitrine.price * COMPARISON_MONTHS)} HT, sans rien payer au
          départ. À titre d’exemple, un devis classique de {euros(quote.creation)}{' '}
          pour la création, puis {euros(quote.monthlyUpkeep)} par mois pour
          l’hébergement et les mises à jour, atteint {euros(classicTotal)} HT sur
          la même durée.
        </p>
        <div className="mt-6 overflow-x-auto rounded-2xl border border-stone-200">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">
              Comparaison chiffrée sur {COMPARISON_MONTHS} mois, hors taxes
            </caption>
            <thead className="bg-stone-50 text-stone-600">
              <tr>
                <th scope="col" className="px-4 py-3 font-medium">
                  Formule
                </th>
                <th scope="col" className="px-4 py-3 font-medium">
                  À payer au départ
                </th>
                <th scope="col" className="px-4 py-3 font-medium">
                  Total HT sur 3 ans
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {rows.map((row) => (
                <tr key={row.label}>
                  <th
                    scope="row"
                    className="px-4 py-3 font-medium text-stone-900"
                  >
                    {row.label}
                  </th>
                  <td className="px-4 py-3 text-stone-700">{row.upfront}</td>
                  <td className="px-4 py-3 font-semibold text-stone-900">
                    {row.total}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs leading-relaxed text-stone-500">
          Le devis classique est une hypothèse chiffrée, pas le tarif d’une
          agence en particulier : les montants varient beaucoup d’un prestataire
          à l’autre.
        </p>
      </Section>

      <Section title="Résiliation, domaine et code : ce qui vous appartient">
        <ul className="space-y-3">
          {[...subscription.ownership, commitments[0]].map((item) => (
            <li key={item} className="flex gap-3 text-stone-700">
              <span aria-hidden="true" className="text-brand-600">
                ✓
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Questions fréquentes">
        <div className="divide-y divide-stone-200 rounded-2xl border border-stone-200">
          {subscription.faq.map((item) => (
            <details key={item.question} className="group px-6 py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-stone-900">
                {item.question}
                <span
                  aria-hidden="true"
                  className="text-stone-400 transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="mt-3 leading-relaxed text-stone-600">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </Section>

      <section className="py-12">
        <div className="rounded-3xl bg-stone-900 p-8 text-white sm:p-10">
          <h2 className="text-2xl font-bold tracking-tight">
            Parlons de votre site
          </h2>
          <p className="mt-3 max-w-xl leading-relaxed text-stone-300">
            Un appel gratuit d’une heure pour comprendre votre activité, puis une
            maquette avant d’écrire la moindre ligne.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/contact"
              search={{ forfait: vitrine.id }}
              data-umami-event="cta-contact"
              data-umami-event-page={SUBSCRIPTION_PATH}
              data-umami-event-emplacement="bas-de-page"
              className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-stone-900 transition-colors hover:bg-brand-50"
            >
              Parler de votre projet
            </Link>
            <Link
              to="/"
              hash="forfaits"
              className="rounded-full border border-stone-600 px-5 py-2.5 text-sm font-medium transition-colors hover:bg-stone-800"
            >
              Voir les forfaits
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="border-t border-stone-200 py-12">
      <h2 className="mb-6 text-2xl font-bold tracking-tight text-balance text-stone-900">
        {title}
      </h2>
      {children}
    </section>
  )
}
