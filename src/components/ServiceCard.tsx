import { Link } from '@tanstack/react-router'

import type { Intervention, Service } from '../content/services'
import { interventions, servicePath, services } from '../content/services'
import { ServiceIcon } from './ServiceIcon'

const cardClass =
  'group relative flex h-full flex-col rounded-2xl border border-stone-200 bg-white p-6 transition-all ' +
  'hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-lg hover:shadow-brand-100 ' +
  ''

const iconClass =
  'inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600 ring-1 ring-brand-100 ' +
  'transition-colors group-hover:bg-brand-600 group-hover:text-white'

/** Une prestation avec sa page dédiée. */
export function ServiceCard({ service }: { service: Service }) {
  return (
    <Link to={servicePath(service.slug)} className={cardClass}>
      <span className={iconClass}>
        <ServiceIcon name={service.icon} />
      </span>
      <h3 className="mt-5 text-lg font-semibold tracking-tight text-stone-900">
        {service.name}
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-stone-600">
        {service.excerpt}
      </p>
      <span className="mt-5 text-sm font-medium text-brand-600">
        En savoir plus
        <span
          aria-hidden="true"
          className="ml-1 inline-block transition-transform group-hover:translate-x-0.5"
        >
          →
        </span>
      </span>
    </Link>
  )
}

/**
 * Une intervention ponctuelle : même carte, plus discrète, vers `/services`.
 * Pas d'ancre dans le lien : le crawler du prérendu prendrait
 * `/services#interventions` pour une page de plus, y compris dans le sitemap.
 */
export function InterventionCard({
  intervention,
}: {
  intervention: Intervention
}) {
  return (
    <Link to="/services" className={`${cardClass} border-dashed`}>
      <span className={iconClass}>
        <ServiceIcon name={intervention.icon} />
      </span>
      <h3 className="mt-5 text-lg font-semibold tracking-tight text-stone-900">
        {intervention.name}
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-stone-600">
        {intervention.excerpt}
      </p>
      <span className="mt-5 text-sm font-medium text-stone-500">
        Intervention ponctuelle
      </span>
    </Link>
  )
}

/** La grille complète : trois prestations, trois interventions. */
export function ServicesGrid() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {services.map((service) => (
        <ServiceCard key={service.slug} service={service} />
      ))}
      {interventions.map((intervention) => (
        <InterventionCard key={intervention.id} intervention={intervention} />
      ))}
    </div>
  )
}
