import { useState } from 'react'
import type { FormEvent } from 'react'
import { createFileRoute } from '@tanstack/react-router'

import type { AgencyOffer } from '../content/agency'
import { agency, offers } from '../content/agency'
import { links } from '../content/profile'
import type { ContactErrors, ContactInput, ProjectType } from '../lib/contact'
import {
  AVAILABILITY_MAX,
  MESSAGE_MAX,
  budgets,
  getContactSettings,
  projectTypes,
  sendContact,
  validateContact,
} from '../lib/contact'
import { AGENCY_ID, SITE_URL, seo } from '../lib/seo'

type ContactSearch = {
  appel?: 1
  type?: ProjectType
  forfait?: AgencyOffer['id']
}

/** Le budget coché d'avance quand on arrive depuis un forfait. */
const SUBSCRIPTION_BUDGET: (typeof budgets)[number] =
  'Abonnement mensuel (30 € ou 100 €)'

export const Route = createFileRoute('/contact')({
  // Trois paramètres préremplissent le formulaire selon la page d'origine :
  // `?appel=1` coche la case « appel découverte » (boutons « Demander un appel
  // découverte » et ancienne adresse /rendez-vous), `?type=` le type de projet
  // (pages service), `?forfait=` le type et le budget (cartes de forfait). Une
  // valeur inconnue est ignorée.
  validateSearch: (search: Record<string, unknown>): ContactSearch => {
    const type = projectTypes.find((item) => item.value === search.type)
    const offer = offers.find((item) => item.id === search.forfait)
    return {
      ...(String(search.appel) === '1' ? { appel: 1 as const } : {}),
      ...(type ? { type: type.value } : {}),
      ...(offer ? { forfait: offer.id } : {}),
    }
  },
  // Rendue à chaque requête, jamais prérendue : la page dépend des variables
  // d'environnement du conteneur (Brevo configuré ou non, clé Turnstile).
  loader: () => getContactSettings(),
  head: ({ loaderData }) => {
    const head = seo({
      title: 'Contact',
      description: `Parlez-nous de votre projet : site, application métier, intégration IA ou formation. L’agence ${agency.name}, à Lyon, répond sous deux jours ouvrés.`,
      path: '/contact',
      jsonLd: [
        {
          '@context': 'https://schema.org',
          '@type': 'ContactPage',
          url: `${SITE_URL}/contact`,
          name: `Contacter l’agence ${agency.name}`,
          inLanguage: 'fr-FR',
          mainEntity: {
            '@type': 'ProfessionalService',
            '@id': AGENCY_ID,
            name: `Agence ${agency.name}`,
            url: SITE_URL,
            email: links.email,
            address: {
              '@type': 'PostalAddress',
              addressLocality: 'Lyon',
              addressCountry: 'FR',
            },
          },
        },
      ],
    })
    return {
      ...head,
      scripts: loaderData?.turnstileSiteKey
        ? [
            ...head.scripts,
            {
              src: 'https://challenges.cloudflare.com/turnstile/v0/api.js',
              async: true,
              defer: true,
            },
          ]
        : head.scripts,
    }
  },
  component: Contact,
})

declare global {
  interface Window {
    // Absent quand le script Umami est bloqué : chaque appel reste optionnel.
    umami?: { track: (event: string, data?: Record<string, string>) => void }
  }
}

// Seuls des choix de liste partent vers Umami : ni nom, ni e-mail, ni message.
function track(event: string, data: Record<string, string>) {
  window.umami?.track(event, data)
}

type Status =
  | { state: 'idle' }
  | { state: 'sending' }
  | { state: 'sent'; callRequested: boolean }
  | { state: 'error'; message: string }

const fieldClass =
  'mt-2 block w-full rounded-xl border bg-white px-4 py-3 text-base text-stone-900 shadow-sm transition-colors placeholder:text-stone-400 focus:border-brand-400 focus:ring-4 focus:ring-brand-100 focus:outline-none'

function readForm(form: HTMLFormElement): ContactInput {
  const data = new FormData(form)
  const value = (key: string) => String(data.get(key) ?? '')
  return {
    name: value('name'),
    email: value('email'),
    company: value('company'),
    projectType: value('projectType'),
    budget: value('budget'),
    message: value('message'),
    callRequested: data.get('callRequested') === 'on',
    availability: value('availability'),
    website: value('website'),
    // Le widget Turnstile ajoute lui-même ce champ caché au formulaire.
    turnstileToken: value('cf-turnstile-response'),
  }
}

function Contact() {
  const settings = Route.useLoaderData()
  const search = Route.useSearch()
  const offer = offers.find((item) => item.id === search.forfait)
  const initialType = search.type ?? offer?.projectType
  const [callRequested, setCallRequested] = useState(search.appel === 1)
  const [status, setStatus] = useState<Status>({ state: 'idle' })
  const [errors, setErrors] = useState<ContactErrors>({})

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const input = readForm(form)

    const found = validateContact(input)
    setErrors(found)
    if (Object.keys(found).length > 0) {
      track('contact-erreur', {
        cause: 'validation',
        champs: Object.keys(found).join(','),
      })
      const first = Object.keys(found)[0]
      form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus()
      return
    }

    setStatus({ state: 'sending' })
    try {
      const result = await sendContact({ data: input })
      if (result.status === 'sent') {
        form.reset()
        setCallRequested(false)
        setStatus({ state: 'sent', callRequested: input.callRequested })
        track('contact-envoye', {
          type: input.projectType,
          appel: input.callRequested ? 'oui' : 'non',
          budget: input.budget || 'non précisé',
        })
      } else if (result.status === 'invalid') {
        setErrors(result.errors)
        setStatus({ state: 'idle' })
        track('contact-erreur', {
          cause: 'validation',
          champs: Object.keys(result.errors).join(','),
        })
      } else {
        setStatus({ state: 'error', message: result.message })
        track('contact-erreur', { cause: 'serveur' })
      }
    } catch {
      track('contact-erreur', { cause: 'reseau' })
      setStatus({
        state: 'error',
        message:
          'La connexion au serveur a échoué. Vérifiez votre réseau et réessayez.',
      })
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-16 lg:grid lg:grid-cols-[1fr_1.4fr] lg:gap-16">
      <div>
        <p className="text-sm font-medium tracking-widest text-brand-600 uppercase">
          Contact
        </p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-balance text-stone-900 sm:text-5xl">
          Parlez-nous de votre projet.
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-pretty text-stone-600">
          Un site à créer, une application à reprendre, de l’IA à intégrer ou
          une équipe à former : quelques lignes suffisent. L’agence vous
          répond sous deux jours ouvrés, avec des questions ou un créneau pour
          en parler.
        </p>

        <div className="mt-10 space-y-3">
          <a
            href={`mailto:${links.email}`}
            data-umami-event="mailto"
            data-umami-event-page="/contact"
            data-umami-event-emplacement="haut-de-page"
            className="flex flex-col gap-1 rounded-xl border border-stone-200 p-5 transition-colors hover:border-stone-300 hover:bg-stone-50"
          >
            <span className="font-semibold text-stone-900">Par e-mail</span>
            <span className="text-sm break-all text-brand-600">
              {links.email}
            </span>
          </a>
        </div>
      </div>

      <div className="mt-12 lg:mt-0">
        {status.state === 'sent' ? (
          <Sent
            callRequested={status.callRequested}
            onReset={() => setStatus({ state: 'idle' })}
          />
        ) : (
          <form
            noValidate
            onSubmit={onSubmit}
            className="rounded-[2rem] border border-stone-200 bg-stone-50/60 p-6 sm:p-10"
          >
            {!settings.enabled && (
              <p
                role="status"
                className="mb-8 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-relaxed text-amber-900"
              >
                Le formulaire n’est pas encore branché. En attendant, écrivez-nous
                à{' '}
                <a
                  href={`mailto:${links.email}`}
                  data-umami-event="mailto"
                  data-umami-event-page="/contact"
                  data-umami-event-emplacement="formulaire-indisponible"
                  className="font-semibold underline"
                >
                  {links.email}
                </a>
                .
              </p>
            )}

            <div className="grid gap-6 sm:grid-cols-2">
              <Field label="Nom" name="name" error={errors.name}>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  maxLength={120}
                  {...invalid('name', errors.name)}
                  className={`${fieldClass} ${borderFor(errors.name)}`}
                />
              </Field>
              <Field label="E-mail" name="email" error={errors.email}>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  maxLength={200}
                  {...invalid('email', errors.email)}
                  className={`${fieldClass} ${borderFor(errors.email)}`}
                />
              </Field>
              <Field label="Entreprise" name="company" optional>
                <input
                  id="company"
                  name="company"
                  type="text"
                  autoComplete="organization"
                  maxLength={120}
                  className={`${fieldClass} ${borderFor()}`}
                />
              </Field>
              <Field
                label="Budget indicatif"
                name="budget"
                optional
                error={errors.budget}
              >
                <select
                  id="budget"
                  name="budget"
                  defaultValue={offer ? SUBSCRIPTION_BUDGET : ''}
                  {...invalid('budget', errors.budget)}
                  className={`${fieldClass} ${borderFor(errors.budget)}`}
                >
                  <option value="">Non précisé</option>
                  {budgets.map((budget) => (
                    <option key={budget} value={budget}>
                      {budget}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <fieldset className="mt-6">
              <legend className="text-sm font-semibold text-stone-900">
                Type de projet
              </legend>
              <div
                className="mt-3 flex flex-wrap gap-2"
                {...(errors.projectType
                  ? { 'aria-describedby': 'projectType-error' }
                  : {})}
              >
                {projectTypes.map((type) => (
                  <label key={type.value} className="cursor-pointer">
                    <input
                      type="radio"
                      name="projectType"
                      value={type.value}
                      defaultChecked={type.value === initialType}
                      required
                      className="peer sr-only"
                    />
                    <span className="block rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 transition-colors peer-checked:border-brand-500 peer-checked:bg-brand-500 peer-checked:text-white peer-focus-visible:ring-4 peer-focus-visible:ring-brand-100 hover:border-stone-400">
                      {type.label}
                    </span>
                  </label>
                ))}
              </div>
              {errors.projectType && (
                <p id="projectType-error" className="mt-2 text-sm text-red-700">
                  {errors.projectType}
                </p>
              )}
            </fieldset>

            <div className="mt-6">
              <Field label="Message" name="message" error={errors.message}>
                <textarea
                  id="message"
                  name="message"
                  rows={7}
                  required
                  maxLength={MESSAGE_MAX}
                  placeholder="Votre activité, ce que vous aimeriez obtenir, vos délais…"
                  {...invalid('message', errors.message)}
                  className={`${fieldClass} ${borderFor(errors.message)} resize-y`}
                />
              </Field>
            </div>

            <div className="mt-6 rounded-xl border border-stone-200 bg-white p-4 sm:p-5">
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  name="callRequested"
                  checked={callRequested}
                  onChange={(event) => setCallRequested(event.target.checked)}
                  className="mt-0.5 h-5 w-5 shrink-0 accent-brand-500"
                />
                <span className="text-sm font-semibold text-stone-900">
                  Je souhaite un appel découverte (visio, gratuit)
                </span>
              </label>
              {callRequested && (
                <div className="mt-4">
                  <Field
                    label="Vos disponibilités"
                    name="availability"
                    optional
                    error={errors.availability}
                  >
                    <input
                      id="availability"
                      name="availability"
                      type="text"
                      maxLength={AVAILABILITY_MAX}
                      placeholder="Ex. : mardi ou jeudi après-midi"
                      {...invalid('availability', errors.availability)}
                      className={`${fieldClass} ${borderFor(errors.availability)}`}
                    />
                  </Field>
                </div>
              )}
            </div>

            {/* Champ piège : invisible et hors du parcours clavier. Un humain
                le laisse vide ; un robot qui remplit tout se trahit. */}
            <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
              <label htmlFor="website">Site web</label>
              <input
                id="website"
                name="website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            {settings.turnstileSiteKey && (
              <div
                className="cf-turnstile mt-6"
                data-sitekey={settings.turnstileSiteKey}
                data-language="fr"
              />
            )}

            {status.state === 'error' && (
              <p
                role="alert"
                className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm leading-relaxed text-red-800"
              >
                {status.message}{' '}
                <a
                  href={`mailto:${links.email}`}
                  data-umami-event="mailto"
                  data-umami-event-page="/contact"
                  data-umami-event-emplacement="erreur-envoi"
                  className="font-semibold underline"
                >
                  {links.email}
                </a>
              </p>
            )}

            <button
              type="submit"
              disabled={status.state === 'sending'}
              className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-500 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-brand-500/25 transition-all hover:bg-brand-600 disabled:cursor-wait disabled:opacity-70 sm:w-auto"
            >
              {status.state === 'sending' ? (
                <>
                  <span
                    aria-hidden="true"
                    className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
                  />
                  Envoi en cours…
                </>
              ) : (
                'Envoyer le message'
              )}
            </button>

            <p className="mt-4 text-sm leading-relaxed text-stone-600">
              <span className="font-semibold text-stone-900">Et ensuite ?</span>{' '}
              L’agence vous répond sous deux jours ouvrés, et le premier appel
              est offert.
            </p>

            <p className="mt-4 text-xs leading-relaxed text-stone-500">
              Vos informations servent uniquement à répondre à votre demande.
              Elles sont transmises à l’agence {agency.name}, ne sont ni
              revendues ni utilisées pour de la prospection, et sont supprimées
              au plus tard trois ans après notre dernier échange. Pour y
              accéder, les corriger ou les faire effacer, écrivez à{' '}
              <a href={`mailto:${links.email}`} className="underline">
                {links.email}
              </a>
              .
            </p>
          </form>
        )}
      </div>
    </div>
  )
}

function Sent({
  callRequested,
  onReset,
}: {
  callRequested: boolean
  onReset: () => void
}) {
  return (
    <div
      role="status"
      className="rounded-[2rem] border border-emerald-200 bg-emerald-50/60 p-8 sm:p-12"
    >
      <span
        aria-hidden="true"
        className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-xl text-emerald-700"
      >
        ✓
      </span>
      <h2 className="mt-6 text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
        Message bien reçu, merci.
      </h2>
      <p className="mt-4 leading-relaxed text-stone-600">
        {callRequested
          ? 'Nous revenons vers vous sous deux jours ouvrés pour fixer l’appel découverte.'
          : 'L’agence vous répond sous deux jours ouvrés.'}
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onReset}
          className="rounded-full border border-stone-300 px-6 py-3 text-sm font-semibold text-stone-700 transition-colors hover:border-stone-400 hover:bg-white"
        >
          Envoyer un autre message
        </button>
      </div>
    </div>
  )
}

function Field({
  label,
  name,
  optional,
  error,
  children,
}: {
  label: string
  name: string
  optional?: boolean
  error?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label htmlFor={name} className="text-sm font-semibold text-stone-900">
        {label}
        {optional && (
          <span className="ml-1 font-normal text-stone-500">(facultatif)</span>
        )}
      </label>
      {children}
      {error && (
        <p id={`${name}-error`} className="mt-2 text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  )
}

function invalid(name: string, error?: string) {
  return error
    ? { 'aria-invalid': true, 'aria-describedby': `${name}-error` }
    : {}
}

function borderFor(error?: string) {
  return error ? 'border-red-400' : 'border-stone-300'
}
