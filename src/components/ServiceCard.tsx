import { Link } from '@tanstack/react-router'

import type { Intervention, Service } from '../content/services'
import { interventions, servicePath, services } from '../content/services'
import { ServiceIcon } from './ServiceIcon'

const cardClass =
  'group relative flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 transition-all ' +
  'hover:-translate-y-0.5 hover:border-sky-300 hover:shadow-lg hover:shadow-sky-100 ' +
  'dark:border-slate-800 dark:bg-slate-900/60 dark:hover:border-sky-700 dark:hover:shadow-none'

const iconClass =
  'inline-flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-sky-600 ring-1 ring-sky-100 ' +
  'transition-colors group-hover:bg-sky-600 group-hover:text-white dark:bg-sky-950/60 dark:text-sky-400 dark:ring-sky-900 dark:group-hover:bg-sky-500 dark:group-hover:text-slate-950'

/** Une prestation avec sa page dédiée. */
export function ServiceCard({ service }: { service: Service }) {
  return (
    <Link to={servicePath(service.slug)} className={cardClass}>
      <span className={iconClass}>
        <ServiceIcon name={service.icon} />
      </span>
      <h3 className="mt-5 text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100">
        {service.name}
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
        {service.excerpt}
      </p>
      <span className="mt-5 text-sm font-medium text-sky-600 dark:text-sky-400">
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
      <h3 className="mt-5 text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100">
        {intervention.name}
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
        {intervention.excerpt}
      </p>
      <span className="mt-5 text-sm font-medium text-slate-500 dark:text-slate-500">
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
