import { Link } from '@tanstack/react-router'

import type { Reference } from '../content/references'
import { servicePath } from '../content/services'

/**
 * Une étude de cas : le client, puis problème, solution et résultat. Sur
 * l'accueil (`compact`), la solution et la stack sont omises et la carte
 * renvoie vers sa fiche complète sur `/references`.
 */
export function ReferenceCard({
  reference,
  compact = false,
}: {
  reference: Reference
  compact?: boolean
}) {
  return (
    <article
      id={compact ? undefined : reference.id}
      className="flex w-full scroll-mt-24 flex-col rounded-3xl border border-stone-200 bg-white p-6 sm:p-8"
    >
      <p className="text-sm font-medium text-brand-600">
        {reference.sector} · {reference.period}
      </p>
      <h3 className="mt-2 text-2xl font-extrabold tracking-tight text-stone-900">
        {reference.client}
        {reference.brands && (
          <span className="font-semibold text-stone-500">
            {' '}
            — {reference.brands.join(', ')}
          </span>
        )}
      </h3>
      <p className="mt-1 text-sm text-stone-500">{reference.context}</p>

      <dl className="mt-6 space-y-4 text-sm leading-relaxed text-pretty text-stone-600">
        <div>
          <dt className="font-semibold text-stone-900">Le problème</dt>
          <dd className="mt-1">{reference.problem}</dd>
        </div>
        {!compact && (
          <div>
            <dt className="font-semibold text-stone-900">La solution</dt>
            <dd className="mt-1">
              <ul className="list-disc space-y-1 pl-5">
                {reference.solution.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </dd>
          </div>
        )}
        <div>
          <dt className="font-semibold text-stone-900">Le résultat</dt>
          <dd className="mt-1">{reference.result}</dd>
        </div>
      </dl>

      {!compact && (
        <ul className="mt-6 flex flex-wrap gap-2">
          {reference.stack.map((item) => (
            <li
              key={item}
              className="rounded-full bg-stone-100 px-3 py-1 text-xs text-stone-700"
            >
              {item}
            </li>
          ))}
        </ul>
      )}

      <p className="mt-auto pt-6 text-sm font-semibold">
        {compact ? (
          <Link
            to="/references"
            hash={reference.id}
            className="text-brand-600 hover:underline"
          >
            Lire l’étude de cas →
          </Link>
        ) : (
          <Link
            to={servicePath(reference.service)}
            className="text-brand-600 hover:underline"
          >
            La prestation associée →
          </Link>
        )}
      </p>
    </article>
  )
}
