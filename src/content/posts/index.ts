/**
 * Le sommaire du blog : un article = un fichier de ce dossier, listé ici.
 *
 * Le corps d'un article est du JSX : pas de parseur Markdown, pas de fichiers
 * à charger, pas d'appel réseau. Tout part dans le bundle et est prérendu au
 * build.
 *
 * Pour ajouter un article : créer `<slug>.tsx` à côté de ses voisins, exporter
 * son `post`, puis l'ajouter au tableau ci-dessous. L'ordre n'a pas
 * d'importance, `sortedPosts` trie par date. Le prérendu découvre l'URL tout
 * seul (voir `vite.config.ts`).
 *
 * Son illustration vit dans `../covers.json` : une entrée par slug, puis
 * `npm run post:image -- <slug>` pour la faire générer par OpenRouter.
 */

import type { Post } from './post'

import { post as faireJouerSesTicketsParUnAgent } from './faire-jouer-ses-tickets-par-un-agent'
import { post as jsonLdLeContratQueLeFrontAttendait } from './json-ld-le-contrat-que-le-front-attendait'
import { post as suivreSaConsommationClaudeCodeSousLinux } from './suivre-sa-consommation-claude-code-sous-linux'
import { post as unPortfolioTanstackStartSurGithubPages } from './un-portfolio-tanstack-start-sur-github-pages'

export type { Post, PostCover } from './post'
export { formatDate, getCover } from './post'

export const posts: Array<Post> = [
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
