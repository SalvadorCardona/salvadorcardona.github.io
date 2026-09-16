/**
 * Ce qu'est une expérience, indépendamment de la liste : son type, sa
 * période affichée, sa durée, le repli de son logo.
 *
 * Les données viennent de `experiences.json`, **généré** par
 * `npm run experiences:sync` depuis la database Notion « Experience Salvador
 * Cardona » — voir « Modifier le contenu » dans le README. Le JSON ne peut
 * pas porter d'en-tête « ne pas éditer » : c'est ce commentaire qui en tient
 * lieu. Ce fichier-ci, lui, s'écrit à la main.
 */

import experiencesData from './experiences.json'

export type ExperienceSection = {
  title: string
  items: Array<string>
}

export type Experience = {
  company: string
  role: string
  location: string
  /** Format ISO `AAAA-MM-JJ`. */
  startDate: string
  /** `null` = mission toujours en cours. */
  endDate: string | null
  stack: Array<string>
  /** Chemin public du logo, ou `null` — repli sur les initiales de l'entreprise. */
  logo: string | null
  /** Contexte métier en une ou deux phrases, avant le détail par section. */
  summary: string
  sections: Array<ExperienceSection>
}

export const experiences: Array<Experience> = experiencesData

/** Les expériences les plus récentes en premier. */
export const sortedExperiences: Array<Experience> = [...experiences].sort(
  (a, b) => b.startDate.localeCompare(a.startDate),
)

const MONTHS = [
  'janvier',
  'février',
  'mars',
  'avril',
  'mai',
  'juin',
  'juillet',
  'août',
  'septembre',
  'octobre',
  'novembre',
  'décembre',
]

function formatMonth(iso: string): string {
  const [year, month] = iso.split('-')
  return `${MONTHS[Number(month) - 1]} ${year}`
}

/** « Mai 2023 — aujourd'hui », ou entre deux dates si la mission est terminée. */
export function formatPeriod(experience: Experience): string {
  const start = formatMonth(experience.startDate)
  const end = experience.endDate ? formatMonth(experience.endDate) : 'aujourd’hui'
  return `${start} — ${end}`
}

/** Une durée arrondie au mois, ex. « 3 ans 5 mois » ou « 5 mois ». */
export function formatDuration(experience: Experience): string {
  const start = new Date(`${experience.startDate}T00:00:00Z`)
  const end = experience.endDate
    ? new Date(`${experience.endDate}T00:00:00Z`)
    : new Date()
  const totalMonths =
    (end.getUTCFullYear() - start.getUTCFullYear()) * 12 +
    (end.getUTCMonth() - start.getUTCMonth()) +
    1
  const years = Math.floor(totalMonths / 12)
  const months = totalMonths % 12
  const parts: Array<string> = []
  if (years > 0) parts.push(`${years} an${years > 1 ? 's' : ''}`)
  if (months > 0) parts.push(`${months} mois`)
  return parts.join(' ') || '1 mois'
}

/** Les initiales de l'entreprise, pour le repli sans logo — « Animalink » → « AN ». */
export function companyInitials(company: string): string {
  const words = company.split(/\s+/).filter(Boolean)
  const initials = words.slice(0, 2).map((word) => word[0]?.toUpperCase() ?? '')
  return initials.join('') || '?'
}
