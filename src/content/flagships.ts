/**
 * Les trois projets phares de l'agence Hermez : Ponos, React Resource View
 * (avec React Data Form) et Leadz. Ils sont mis en avant sur l'accueil comme
 * preuve de savoir-faire.
 *
 * Tout est en dur, et chaque fait est vérifiable : les versions et les dates
 * viennent des releases GitHub, relevées le `FLAGSHIPS_CHECKED_AT`. Rien ne
 * s'invente ici (ni étoiles, ni clients, ni chiffres d'usage) ; Leadz, dont le
 * dépôt est privé, n'a donc ni lien GitHub ni chiffre de dépôt. À remettre à
 * jour à la main après une release.
 */

/** Le jour où versions et dates ont été relevées sur GitHub. */
export const FLAGSHIPS_CHECKED_AT = '16 octobre 2026'

export type FlagshipRepo = {
  /** Libellé du lien : « Dépôt GitHub », ou le nom de la librairie. */
  label: string
  url: string
  /** Dernière version publiée, avec le « v » de son tag. */
  version: string
  /** Date de cette release, en toutes lettres. */
  releasedAt: string
  /** Nombre de releases publiées sur GitHub. */
  releases: number
}

export type Flagship = {
  id: string
  name: string
  /** Le dossier de `public/projects/` qui porte l'icône et la bannière. */
  brand: string
  tagline: string
  /** Ce que fait le projet, en une ou deux phrases. */
  summary: string
  /** Ce qui le rend remarquable techniquement. */
  highlights: Array<string>
  stack: Array<string>
  site: { label: string; url: string }
  /** Les dépôts publics ; vide quand le code n'est pas public. */
  repos: Array<FlagshipRepo>
  /** Dit pourquoi aucun dépôt n'est lié, quand il n'y en a pas. */
  privateNote?: string
}

export const flagships: Array<Flagship> = [
  {
    id: 'ponos',
    name: 'Ponos',
    brand: 'ticket-runner',
    tagline: 'Écrivez le ticket, il revient fait.',
    summary:
      'Ponos est le harnais auto-hébergé que l’agence a conçu autour de Claude Code : il exécute vos tâches, de code ou non, avec Notion et GitHub (Telegram et Slack en option).',
    highlights: [
      'Chaque tâche tourne sur son propre worktree git : la copie de travail n’est jamais touchée.',
      'Une tâche de code revient en pull request, une tâche rédactionnelle est écrite dans la page du ticket.',
      'Une question qu’il ne veut pas deviner est posée sur Telegram ou Slack ; la réponse relance la tâche.',
    ],
    stack: ['Python', 'Claude Code', 'Notion API', 'GitHub', 'Git worktrees'],
    site: { label: 'the-ponos.app', url: 'https://the-ponos.app/' },
    repos: [
      {
        label: 'Dépôt GitHub',
        url: 'https://github.com/SalvadorCardona/ponos',
        version: 'v0.1.0',
        releasedAt: '12 octobre 2026',
        releases: 1,
      },
    ],
  },
  {
    id: 'react-resource-view',
    name: 'React Resource View',
    brand: 'react-resource-view',
    tagline: 'Des vues CRUD qui ne dépendent pas de l’API.',
    summary:
      'L’agence a conçu et publie en open source React Resource View et React Data Form : on déclare une ressource, ses champs et sa mise en page, et les bibliothèques rendent liste, détail, création, édition et suppression.',
    highlights: [
      'Six mises en page pour une même ressource : tableau, cartes, colonnes, vue scindée, calendrier et frise.',
      'Formulaires pilotés par la donnée : champs, groupes et étapes se décrivent comme un objet.',
      'Pensées pour les API JSON-LD / Hydra (API Platform), et utilisées dans les applications de l’agence, dont Leadz.',
    ],
    stack: ['React', 'TypeScript', 'JSON-LD / Hydra', 'Tailwind CSS'],
    site: {
      label: 'hermez.dev/react-resource-view',
      url: 'https://hermez.dev/react-resource-view/',
    },
    repos: [
      {
        label: 'react-resource-view',
        url: 'https://github.com/SalvadorCardona/react-resource-view',
        version: 'v1.0.0',
        releasedAt: '16 octobre 2026',
        releases: 11,
      },
      {
        label: 'react-data-form',
        url: 'https://github.com/SalvadorCardona/react-data-form',
        version: 'v0.2.1',
        releasedAt: '8 octobre 2026',
        releases: 2,
      },
    ],
  },
  {
    id: 'leadz',
    name: 'Leadz',
    brand: 'leadz-ninja',
    tagline: 'Trouve les leads que les autres ne voient pas.',
    summary:
      'Leadz est l’outil de recherche et de qualification de leads que l’agence a conçu et fait évoluer : un scraper autonome parcourt le web, puis une IA range ce qu’il trouve dans une base d’entreprises qualifiées.',
    highlights: [
      'Le secteur n’est pas câblé dans le code : chaque dossier de recherche décrit sa cible (villes, métiers, vocabulaire).',
      'Cartographie par IA en sortie structurée, avec un repli heuristique déterministe ; la donnée déclarée par le site prime sur la donnée devinée.',
      'Déduplication floue des entreprises, API documentée et interface en PWA.',
    ],
    stack: [
      'PHP 8.4',
      'Symfony 8',
      'FrankenPHP',
      'API Platform',
      'PostgreSQL',
      'TanStack Start',
    ],
    site: { label: 'leadz.ninja', url: 'https://leadz.ninja/' },
    repos: [],
    privateNote: 'Le code de Leadz est privé : pas de dépôt public à consulter.',
  },
]
