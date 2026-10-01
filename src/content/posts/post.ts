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
  /**
   * Chemin public de l'image d'origine, ex. `/blog/mon-article.jpg` : l'image
   * de partage, LinkedIn ne lisant pas l'AVIF.
   */
  src: string
  /** Les déclinaisons affichées sur le site, par format, en `srcset`. */
  srcSet: { avif: string; webp: string }
  /** La plus grande déclinaison WebP, repli de `<img>`. */
  fallback: string
  alt: string
  width: number
  height: number
}

/** Toutes les couvertures sont demandées en 16:9, 1K. */
const COVER_WIDTH = 1024
const COVER_HEIGHT = 576

/** Les largeurs écrites par `scripts/cover-variants.mjs`. */
const VARIANT_WIDTHS = [480, 960]

const covers: Record<string, { alt: string; prompt: string; file?: string }> =
  coverData

/**
 * L'illustration d'un article, ou `undefined` tant qu'elle n'a pas été
 * générée : `file` n'est écrit dans `covers.json` que par `npm run post:image`.
 */
export function getCover(slug: string): PostCover | undefined {
  const cover = covers[slug]
  if (!cover?.file) return undefined

  const base = `/blog/${cover.file.replace(/\.[^.]+$/, '')}`
  const srcSet = (format: string) =>
    VARIANT_WIDTHS.map((width) => `${base}-${width}.${format} ${width}w`).join(
      ', ',
    )

  return {
    src: `/blog/${cover.file}`,
    srcSet: { avif: srcSet('avif'), webp: srcSet('webp') },
    fallback: `${base}-${VARIANT_WIDTHS[1]}.webp`,
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
