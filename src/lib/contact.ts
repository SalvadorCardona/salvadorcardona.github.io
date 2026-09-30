/**
 * Le formulaire de contact : ce que le navigateur et le serveur partagent (la
 * liste des choix, la validation) et les deux server functions qui tournent
 * côté Node.
 *
 * L'envoi passe par l'API transactionnelle Brevo, appelée sans SDK : un e-mail
 * de notification à l'agence, un e-mail de confirmation au prospect, et, si
 * `BREVO_LIST_ID` est renseigné, l'ajout du prospect à une liste Brevo.
 *
 * Aucune valeur sensible n'atteint le navigateur : la clé Brevo et le secret
 * Turnstile sont lus dans `process.env` à l'intérieur des `handler`, que le
 * compilateur de Start retire du bundle client. Seule la clé publique
 * Turnstile en sort, par `getContactSettings`.
 */

import { createServerFn } from '@tanstack/react-start'
import { getRequestIP } from '@tanstack/react-start/server'

import { SITE_URL } from './seo'

export const projectTypes = [
  { value: 'site', label: 'Site web' },
  { value: 'application', label: 'Application métier' },
  { value: 'ia', label: 'Intégration IA' },
  { value: 'formation', label: 'Formation' },
  { value: 'autre', label: 'Autre' },
] as const

export const budgets = [
  'Moins de 1 000 €',
  '1 000 à 5 000 €',
  '5 000 à 15 000 €',
  'Plus de 15 000 €',
  'Abonnement mensuel (30 € ou 100 €)',
  'Je ne sais pas encore',
] as const

export type ContactInput = {
  name: string
  email: string
  company: string
  projectType: string
  budget: string
  message: string
  /** Case « appel découverte » cochée. */
  callRequested: boolean
  /** Créneaux proposés pour l'appel, facultatif et ignoré sans la case. */
  availability: string
  /** Champ piège, caché aux humains : rempli, c'est un robot. */
  website: string
  /** Jeton Cloudflare Turnstile, vide tant que Turnstile n'est pas activé. */
  turnstileToken: string
}

export type ContactField =
  | 'name'
  | 'email'
  | 'projectType'
  | 'budget'
  | 'message'
  | 'availability'
export type ContactErrors = Partial<Record<ContactField, string>>

export type ContactResult =
  | { status: 'sent' }
  | { status: 'invalid'; errors: ContactErrors }
  | { status: 'error'; message: string }

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
export const MESSAGE_MIN = 20
export const MESSAGE_MAX = 5000
export const AVAILABILITY_MAX = 300

/** La même validation dans le navigateur, avant l'envoi, et sur le serveur. */
export function validateContact(input: ContactInput): ContactErrors {
  const errors: ContactErrors = {}
  const name = input.name.trim()
  const message = input.message.trim()

  if (name.length < 2) errors.name = 'Indiquez votre nom.'
  else if (name.length > 120) errors.name = 'Ce nom est trop long.'

  if (!EMAIL_PATTERN.test(input.email.trim()) || input.email.length > 200) {
    errors.email = 'Cette adresse e-mail ne semble pas valide.'
  }

  if (!projectTypes.some((type) => type.value === input.projectType)) {
    errors.projectType = 'Choisissez le type de projet.'
  }

  if (input.budget && !budgets.some((budget) => budget === input.budget)) {
    errors.budget = 'Choisissez un budget dans la liste.'
  }

  if (message.length < MESSAGE_MIN) {
    errors.message = `Décrivez votre projet en quelques phrases (${MESSAGE_MIN} caractères au moins).`
  } else if (message.length > MESSAGE_MAX) {
    errors.message = `Le message dépasse ${MESSAGE_MAX} caractères.`
  }

  if (input.callRequested && input.availability.trim().length > AVAILABILITY_MAX) {
    errors.availability = `Vos disponibilités dépassent ${AVAILABILITY_MAX} caractères.`
  }

  return errors
}

/**
 * La configuration Brevo, ou `null` s'il manque de quoi envoyer. Lue à chaque
 * appel : les variables viennent du conteneur, pas du build.
 */
function brevoConfig() {
  const apiKey = process.env.BREVO_API_KEY
  const to = process.env.CONTACT_TO_EMAIL
  const from = process.env.CONTACT_FROM_EMAIL
  if (!apiKey || !to || !from) return null
  return {
    apiKey,
    to,
    sender: { email: from, name: process.env.CONTACT_FROM_NAME || 'Agence Cardona' },
    listId: Number(process.env.BREVO_LIST_ID) || null,
    // Seulement pour pointer vers un serveur factice en local (DEPLOY.md).
    baseUrl: process.env.BREVO_API_URL || 'https://api.brevo.com/v3',
  }
}

type BrevoConfig = NonNullable<ReturnType<typeof brevoConfig>>

/**
 * Ce que la page doit savoir de la configuration du serveur, sans rien
 * révéler : si l'envoi est branché, et la clé publique Turnstile si les deux
 * clés sont renseignées.
 */
export const getContactSettings = createServerFn({ method: 'GET' }).handler(
  () => ({
    enabled: brevoConfig() !== null,
    turnstileSiteKey:
      process.env.TURNSTILE_SITE_KEY && process.env.TURNSTILE_SECRET
        ? process.env.TURNSTILE_SITE_KEY
        : null,
  }),
)

/** Envois acceptés par adresse IP sur la fenêtre glissante. */
const RATE_LIMIT = 5
const RATE_WINDOW_MS = 15 * 60 * 1000

/**
 * Limite de débit en mémoire : suffisante pour un seul conteneur, remise à
 * zéro à chaque redémarrage. Les IP dont la fenêtre est échue sont purgées à
 * chaque passage, la table ne grossit donc pas indéfiniment.
 */
const attempts = new Map<string, Array<number>>()

function isRateLimited(ip: string) {
  const now = Date.now()
  for (const [key, times] of attempts) {
    const recent = times.filter((time) => now - time < RATE_WINDOW_MS)
    if (recent.length > 0) attempts.set(key, recent)
    else attempts.delete(key)
  }
  const recent = attempts.get(ip) ?? []
  if (recent.length >= RATE_LIMIT) return true
  attempts.set(ip, [...recent, now])
  return false
}

async function verifyTurnstile(token: string, secret: string, ip?: string) {
  const body = new URLSearchParams({ secret, response: token })
  if (ip) body.set('remoteip', ip)
  const response = await fetch(
    'https://challenges.cloudflare.com/turnstile/v0/siteverify',
    { method: 'POST', body, signal: AbortSignal.timeout(10_000) },
  )
  const result = (await response.json()) as { success?: boolean }
  return result.success === true
}

/** Toute valeur saisie passe par ici avant d'entrer dans un e-mail HTML. */
function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

async function brevo(config: BrevoConfig, path: string, body: unknown) {
  const response = await fetch(`${config.baseUrl}${path}`, {
    method: 'POST',
    headers: {
      'api-key': config.apiKey,
      accept: 'application/json',
      'content-type': 'application/json',
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(10_000),
  })
  if (!response.ok) {
    throw new Error(`Brevo ${path} : HTTP ${response.status} ${await response.text()}`)
  }
}

/** Les réponses du formulaire, dans l'ordre, pour les deux e-mails. */
function answers(data: ContactInput) {
  const type = projectTypes.find((item) => item.value === data.projectType)
  return [
    ['Nom', data.name.trim()],
    ['E-mail', data.email.trim()],
    ['Entreprise', data.company.trim() || '—'],
    ['Type de projet', type?.label ?? data.projectType],
    ['Budget indicatif', data.budget || 'Non précisé'],
  ] as const
}

/**
 * La demande d'appel, en tête des deux e-mails quand la case est cochée :
 * les disponibilités sont libres, donc échappées comme le reste.
 */
function callHtml(data: ContactInput) {
  if (!data.callRequested) return ''
  const availability = data.availability.trim() || 'Non précisées'
  return `<p style="margin:16px 0;padding:12px 16px;background:#fff7ed;border:1px solid #fdba74;border-radius:8px"><strong>Appel découverte demandé</strong> (visio, gratuit)<br>Disponibilités : ${escapeHtml(availability)}</p>`
}

function callText(data: ContactInput) {
  if (!data.callRequested) return ''
  const availability = data.availability.trim() || 'Non précisées'
  return `APPEL DÉCOUVERTE DEMANDÉ (visio, gratuit)\nDisponibilités : ${availability}\n\n`
}

function answersHtml(data: ContactInput) {
  const rows = answers(data)
    .map(
      ([label, value]) =>
        `<tr><td style="padding:4px 16px 4px 0;color:#78716c">${label}</td><td style="padding:4px 0">${escapeHtml(value)}</td></tr>`,
    )
    .join('')
  const message = escapeHtml(data.message.trim()).replace(/\n/g, '<br>')
  return `<table style="border-collapse:collapse">${rows}</table>
<p style="margin-top:16px;padding:12px 16px;background:#f5f5f4;border-radius:8px">${message}</p>`
}

function answersText(data: ContactInput) {
  const lines = answers(data).map(([label, value]) => `${label} : ${value}`)
  return `${lines.join('\n')}\n\n${data.message.trim()}`
}

/** L'e-mail à l'agence, avec « Répondre » qui écrit directement au prospect. */
function notification(config: BrevoConfig, data: ContactInput) {
  const type = projectTypes.find((item) => item.value === data.projectType)
  return {
    sender: config.sender,
    to: [{ email: config.to }],
    replyTo: { email: data.email.trim(), name: data.name.trim() },
    subject: `${data.callRequested ? 'Appel demandé' : 'Nouveau contact'} : ${data.name.trim()} (${type?.label ?? data.projectType})`,
    htmlContent: `<div style="font-family:sans-serif;color:#292524">
${callHtml(data)}
<p>Nouveau message depuis <a href="${SITE_URL}/contact">${SITE_URL}/contact</a>. Répondre à cet e-mail écrit directement au prospect.</p>
${answersHtml(data)}
</div>`,
    textContent: `${callText(data)}Nouveau message depuis ${SITE_URL}/contact.\n\n${answersText(data)}`,
  }
}

/** L'accusé de réception au prospect, qui reprend sa demande d'appel s'il en a fait une. */
function confirmation(config: BrevoConfig, data: ContactInput) {
  const name = data.name.trim()
  const next = data.callRequested
    ? 'Vous souhaitez un appel découverte : nous revenons vers vous sous deux jours ouvrés pour fixer l’appel, en visio.'
    : 'Merci pour votre message : l’agence Cardona vous répond sous deux jours ouvrés.'
  return {
    sender: config.sender,
    to: [{ email: data.email.trim(), name }],
    replyTo: { email: config.to },
    subject: 'Votre demande à l’agence Cardona',
    htmlContent: `<div style="font-family:sans-serif;color:#292524">
<p>Bonjour ${escapeHtml(name)},</p>
<p>${next}</p>
<p>Pour mémoire, votre demande :</p>
${callHtml(data)}
${answersHtml(data)}
<p>À très vite,<br>L’agence Cardona</p>
</div>`,
    textContent: `Bonjour ${name},\n\n${next}\n\nPour mémoire, votre demande :\n\n${callText(data)}${answersText(data)}\n\nÀ très vite,\nL’agence Cardona`,
  }
}

function asString(value: unknown) {
  return typeof value === 'string' ? value : ''
}

export const sendContact = createServerFn({ method: 'POST' })
  .validator((data: unknown): ContactInput => {
    const input = (data ?? {}) as Record<string, unknown>
    return {
      name: asString(input.name),
      email: asString(input.email),
      company: asString(input.company),
      projectType: asString(input.projectType),
      budget: asString(input.budget),
      message: asString(input.message),
      callRequested: input.callRequested === true,
      availability: asString(input.availability),
      website: asString(input.website),
      turnstileToken: asString(input.turnstileToken),
    }
  })
  .handler(async ({ data }): Promise<ContactResult> => {
    // Le robot qui remplit le champ piège croit son message parti : rien ne
    // lui signale qu'il a été repéré.
    if (data.website) return { status: 'sent' }

    // Derrière Traefik, l'adresse du visiteur n'est que dans X-Forwarded-For.
    const ip = getRequestIP({ xForwardedFor: true }) ?? 'inconnue'
    if (isRateLimited(ip)) {
      return {
        status: 'error',
        message:
          'Trop d’envois depuis votre connexion. Réessayez dans un quart d’heure, ou écrivez-nous directement.',
      }
    }

    const errors = validateContact(data)
    if (Object.keys(errors).length > 0) return { status: 'invalid', errors }

    const secret = process.env.TURNSTILE_SECRET
    if (secret && process.env.TURNSTILE_SITE_KEY) {
      const human =
        data.turnstileToken !== '' &&
        (await verifyTurnstile(data.turnstileToken, secret, ip).catch(
          () => false,
        ))
      if (!human) {
        return {
          status: 'error',
          message:
            'La vérification anti-robot a échoué. Rechargez la page et réessayez.',
        }
      }
    }

    const config = brevoConfig()
    if (!config) {
      return {
        status: 'error',
        message:
          'Le formulaire n’est pas encore branché. Écrivez-nous directement par e-mail, votre message nous parviendra tout aussi bien.',
      }
    }

    // Seule la notification à l'agence conditionne le succès : c'est elle qui
    // porte la demande. Afficher une erreur parce que l'accusé de réception a
    // échoué pousserait le visiteur à renvoyer un message déjà reçu.
    try {
      await brevo(config, '/smtp/email', notification(config, data))
    } catch (error) {
      console.error('[contact] notification Brevo impossible', error)
      return {
        status: 'error',
        message:
          'Votre message n’a pas pu partir, la faute à notre serveur. Réessayez dans un instant, ou écrivez-nous directement.',
      }
    }

    const followUps = [brevo(config, '/smtp/email', confirmation(config, data))]
    if (config.listId) {
      followUps.push(
        brevo(config, '/contacts', {
          email: data.email.trim(),
          listIds: [config.listId],
          updateEnabled: true,
        }),
      )
    }
    for (const result of await Promise.allSettled(followUps)) {
      if (result.status === 'rejected') {
        console.error('[contact] suite Brevo en échec', result.reason)
      }
    }

    return { status: 'sent' }
  })
