import { Link, createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'

import { agency, discoveryCall } from '../content/agency'
import { seo } from '../lib/seo'

/**
 * L'URL de la page de réservation Google Agenda, lue à chaque requête dans
 * l'environnement du conteneur. Toute valeur qui n'est pas en `https://`
 * compte comme absente : l'iframe ne chargerait rien de sûr.
 */
const getBookingUrl = createServerFn({ method: 'GET' }).handler(() => {
  const url = process.env.BOOKING_URL
  return url?.startsWith('https://') ? url : null
})

export const Route = createFileRoute('/rendez-vous')({
  // Rendue à chaque requête, jamais prérendue : BOOKING_URL vient du
  // conteneur, pas du build.
  loader: () => getBookingUrl(),
  head: () =>
    seo({
      title: 'Prendre rendez-vous',
      description: `Réservez un appel découverte avec l’agence ${agency.name} : ${discoveryCall.duration.toLowerCase()}, gratuit et sans engagement, en visio, pour parler de votre site, de votre application ou de votre projet IA.`,
      path: '/rendez-vous',
    }),
  component: Booking,
})

function Booking() {
  const bookingUrl = Route.useLoaderData()

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="lg:grid lg:grid-cols-[1.2fr_1fr] lg:gap-16">
        <div>
          <p className="text-sm font-medium tracking-widest text-brand-600 uppercase">
            Rendez-vous
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-balance text-stone-900 sm:text-5xl">
            Un appel découverte, pour voir si on est faits pour travailler
            ensemble.
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-pretty text-stone-600">
            Choisissez un créneau, l’agence vous envoie l’invitation. Pas de
            présentation commerciale : on parle de votre activité et de ce qui
            vous ferait gagner du temps ou des clients.
          </p>
        </div>

        <dl className="mt-10 grid gap-3 self-end sm:grid-cols-3 lg:mt-0 lg:grid-cols-1">
          {[
            { term: 'Durée', value: discoveryCall.duration },
            { term: 'Où', value: discoveryCall.where },
            { term: 'Prix', value: discoveryCall.price },
          ].map((item) => (
            <div
              key={item.term}
              className="rounded-xl border border-stone-200 px-5 py-4"
            >
              <dt className="text-xs font-semibold tracking-wide text-stone-500 uppercase">
                {item.term}
              </dt>
              <dd className="mt-1 font-semibold text-stone-900">{item.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <section aria-labelledby="deroule" className="mt-14">
        <h2 id="deroule" className="text-xl font-bold text-stone-900">
          Comment se passe l’appel
        </h2>
        <ol className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {discoveryCall.agenda.map((step, index) => (
            <li key={step} className="flex gap-4 lg:block">
              <span
                aria-hidden="true"
                className="font-display text-4xl leading-none font-extrabold text-transparent [-webkit-text-stroke:1.5px_var(--color-brand-400)]"
              >
                {index + 1}
              </span>
              <p className="text-sm leading-relaxed text-stone-600 lg:mt-3">
                {step}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section aria-label="Réservation" className="mt-14">
        {bookingUrl ? (
          <div className="overflow-hidden rounded-[2rem] border border-stone-200 bg-white shadow-sm">
            <iframe
              src={bookingUrl}
              title={`Réserver un appel avec l’agence ${agency.name}`}
              loading="lazy"
              className="block h-[46rem] w-full sm:h-[40rem]"
            />
          </div>
        ) : (
          <div className="rounded-[2rem] border border-stone-200 bg-stone-50 p-8 text-center sm:p-12">
            <h2 className="text-2xl font-bold tracking-tight text-stone-900">
              La réservation en ligne arrive bientôt.
            </h2>
            <p className="mx-auto mt-4 max-w-xl leading-relaxed text-stone-600">
              En attendant, laissez-nous un message avec vos disponibilités :
              l’agence vous propose un créneau sous deux jours ouvrés.
            </p>
            <Link
              to="/contact"
              className="mt-8 inline-flex rounded-full bg-brand-500 px-6 py-3.5 text-base font-semibold text-white transition-colors hover:bg-brand-600"
            >
              Nous écrire
            </Link>
          </div>
        )}
        <p className="mt-4 text-center text-sm text-stone-500">
          Aucun créneau ne vous convient ?{' '}
          <Link to="/contact" className="font-semibold text-brand-600 hover:underline">
            Écrivez-nous
          </Link>
          , on s’adapte.
        </p>
      </section>
    </div>
  )
}
