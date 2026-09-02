/**
 * Ce qu'est un article, indépendamment de la liste : son type, son
 * illustration, le formatage de sa date.
 *
 * Chaque article importe le type d'ici, jamais de `index.ts` — qui, lui,
 * importe tous les articles. Passer par ce module évite le cycle.
 */

import type { ReactNode } from 'react'

import coverData from '../covers.json'

export type Post = {
  slug: string
  title: string
  /** Format ISO `AAAA-MM-JJ`, utilisé pour le tri et la balise <time>. */
  date: string
  /** Résumé affiché sur la liste et dans les métadonnées SEO. */
  excerpt: string
  tags: Array<string>
  /** Durée de lecture indicative, en minutes. */
  readingTime: number
  body: ReactNode
}

/**
 * L'illustration d'un article. Les images sont générées une fois par
 * OpenRouter (`npm run post:image`) et versionnées dans `public/blog/` : rien
 * n'est appelé au build ni au runtime.
 */
export type PostCover = {
  /** Chemin public de l'image, ex. `/blog/mon-article.jpg`. */
  src: string
  alt: string
  width: number
  height: number
}

/** Toutes les couvertures sont demandées en 16:9, 1K. */
const COVER_WIDTH = 1024
const COVER_HEIGHT = 576

const covers: Record<string, { alt: string; prompt: string; file?: string }> =
  coverData

/**
 * L'illustration d'un article, ou `undefined` tant qu'elle n'a pas été
 * générée : `file` n'est écrit dans `covers.json` que par `npm run post:image`.
 */
export function getCover(slug: string): PostCover | undefined {
  const cover = covers[slug]
  if (!cover?.file) return undefined

  return {
    src: `/blog/${cover.file}`,
    alt: cover.alt,
    width: COVER_WIDTH,
    height: COVER_HEIGHT,
  }
}

export function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })
}
