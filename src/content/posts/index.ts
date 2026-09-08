/**
 * Généré par `npm run posts:sync` depuis la database Notion « Blog Salvador Cardona ».
 * Ne pas éditer à la main : la prochaine synchronisation écrase ce fichier.
 */

import type { Post } from './post'

import { post as decouperUnDomaineMetierEnRessourcesApiPlatform } from './decouper-un-domaine-metier-en-ressources-api-platform'
import { post as suivreSaConsommationClaudeCodeSousLinux } from './suivre-sa-consommation-claude-code-sous-linux'
import { post as unPortfolioTanstackStartSurGithubPages } from './un-portfolio-tanstack-start-sur-github-pages'
import { post as jsonLdLeContratQueLeFrontAttendait } from './json-ld-le-contrat-que-le-front-attendait'
import { post as faireJouerSesTicketsParUnAgent } from './faire-jouer-ses-tickets-par-un-agent'

export type { Post, PostCover } from './post'
export { formatDate, getCover } from './post'

export const posts: Array<Post> = [
  decouperUnDomaineMetierEnRessourcesApiPlatform,
  suivreSaConsommationClaudeCodeSousLinux,
  unPortfolioTanstackStartSurGithubPages,
  jsonLdLeContratQueLeFrontAttendait,
  faireJouerSesTicketsParUnAgent,
]

/** Les articles du plus récent au plus ancien. */
export const sortedPosts: Array<Post> = [...posts].sort((a, b) =>
  b.date.localeCompare(a.date),
)

export function getPost(slug: string): Post | undefined {
  return posts.find((post) => post.slug === slug)
}

export const allTags: Array<string> = [
  ...new Set(posts.flatMap((post) => post.tags)),
].sort((a, b) => a.localeCompare(b, 'fr'))
