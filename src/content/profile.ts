/**
 * Source unique de vérité du portfolio.
 *
 * Tout le contenu du site vient d'ici : accueil, contact, pied de page.
 * Aucun CMS, aucune base de données — on édite ce fichier, on commit, le site
 * se redéploie.
 *
 * Les entrées marquées « À COMPLÉTER » sont des gabarits vides : elles ne
 * s'affichent pas tant qu'elles ne sont pas remplies (voir `isFilled`).
 */

export const profile = {
  name: 'Salvador Cardona',
  role: 'Développeur web full-stack',
  tagline: '13 ans à construire des applications web. Aujourd’hui sur Animalink.',
  intro:
    'Je conçois et développe des applications web de bout en bout : des API structurées, ' +
    'des interfaces React qui tiennent dans le temps, et l’outillage qui va autour. ' +
    'J’aime les architectures explicites, les contrats de données clairs, et les outils ' +
    'qu’on ouvre trois ans plus tard sans avoir peur.',
  location: 'France',
  availability: 'Ouvert aux échanges autour de projets web et IA.',
} as const

export const links = {
  email: 'cardona.salvador2022@gmail.com',
  github: 'https://github.com/SalvadorCardona',
  linkedin: 'https://www.linkedin.com/in/salvador-cardona-70911113a/',
  x: 'https://x.com/salvadevme',
  instagram: 'https://www.instagram.com/salvadorcardona81/',
} as const

export type SkillGroup = {
  title: string
  items: Array<string>
}

export const skills: Array<SkillGroup> = [
  {
    title: 'Front-end',
    items: [
      'TypeScript',
      'React 19',
      'TanStack Router / Start',
      'TanStack Query',
      'Angular',
      'Tailwind CSS',
      'Vite',
      'Three.js',
    ],
  },
  {
    title: 'Back-end',
    items: [
      'PHP',
      'Symfony',
      'API Platform',
      'JSON-LD / Hydra',
      'Node.js',
      'Python',
      'REST',
      'Mercure',
    ],
  },
  {
    title: 'Données & IA',
    items: [
      'Ollama',
      'OpenRouter',
      'Agents LLM',
      'Claude Code',
      'Prompt engineering',
      'Whisper',
    ],
  },
  {
    title: 'Outillage & infra',
    items: [
      'Docker',
      'Git / GitHub Actions',
      'Linux',
      'Vitest',
      'Makefile',
      'CI/CD',
    ],
  },
]

export type Experience = {
  company: string
  role: string
  period: string
  description: string
  stack: Array<string>
}

export const experiences: Array<Experience> = [
  {
    company: 'Animalink',
    role: 'Développeur web full-stack',
    period: 'Aujourd’hui',
    description:
      'Conception et développement de la plateforme : API JSON-LD, interfaces React, ' +
      'et l’outillage interne qui accélère l’équipe au quotidien.',
    stack: ['TypeScript', 'React', 'Symfony', 'API Platform', 'Docker'],
  },
  {
    company: 'À COMPLÉTER',
    role: 'À COMPLÉTER',
    period: 'À COMPLÉTER',
    description: 'À COMPLÉTER',
    stack: [],
  },
]

export type Education = {
  school: string
  degree: string
  year: string
  detail?: string
}

export const education: Array<Education> = [
  {
    school: 'À COMPLÉTER',
    degree: 'À COMPLÉTER',
    year: 'À COMPLÉTER',
  },
]

export type Project = {
  name: string
  description: string
  url: string
  tags: Array<string>
  featured?: boolean
}

export const projects: Array<Project> = [
  {
    name: 'ticket-runner',
    description:
      'Vos tickets Notion, joués par Claude Code : une session par ticket, une pull request à l’arrivée.',
    url: 'https://github.com/SalvadorCardona/ticket-runner',
    tags: ['Python', 'Agents LLM', 'Notion API'],
    featured: true,
  },
  {
    name: 'trader-ia',
    description:
      'Arène de paper trading S&P 500 : plusieurs agents traders IA s’affrontent avec 1 000 € chacun.',
    url: 'https://github.com/SalvadorCardona/trader-ia',
    tags: ['TypeScript', 'Docker', 'LLM'],
    featured: true,
  },
  {
    name: 'react-resource-view',
    description:
      'Vues CRUD pour API JSON-LD / Hydra : liste, lecture, création, édition et suppression — en table, cartes, colonnes, split, calendrier ou timeline.',
    url: 'https://github.com/SalvadorCardona/react-resource-view',
    tags: ['React', 'TypeScript', 'JSON-LD'],
    featured: true,
  },
  {
    name: 'linux-whisper',
    description:
      'Dictée vocale hors-ligne pour Linux : un raccourci clavier, un overlay, et le texte est dans le presse-papiers.',
    url: 'https://github.com/SalvadorCardona/linux-whisper',
    tags: ['Python', 'Whisper', 'Linux'],
    featured: true,
  },
  {
    name: 'gnome-claude-usage',
    description:
      'Indicateur GNOME Shell pour la consommation Claude Code : un camembert dans la barre, les limites et heures de reset au clic.',
    url: 'https://github.com/SalvadorCardona/gnome-claude-usage',
    tags: ['GNOME Shell', 'JavaScript', 'Python'],
  },
  {
    name: 'react-data-form',
    description:
      'Formulaires React pilotés par la donnée : construction déclarative, contrôleurs de champs, groupes et étapes — pensés pour API Platform.',
    url: 'https://github.com/SalvadorCardona/react-data-form',
    tags: ['React', 'TypeScript', 'Formulaires'],
  },
  {
    name: 'jsonld-api-client',
    description:
      'Client typé pour API JSON-LD / Hydra : openapi-fetch avec en-têtes d’auth et de scope, cache d’IRI, abonnements Mercure.',
    url: 'https://github.com/SalvadorCardona/jsonld-api-client',
    tags: ['TypeScript', 'JSON-LD', 'Mercure'],
  },
  {
    name: 'react-mini-i18n',
    description:
      'Traduction React réduite à l’essentiel : un dictionnaire clé → texte, une fonction translate, un composant Trans et un provider.',
    url: 'https://github.com/SalvadorCardona/react-mini-i18n',
    tags: ['React', 'i18n'],
  },
]

/** Une entrée est affichée seulement si elle ne contient plus de gabarit vide. */
export function isFilled(value: string): boolean {
  return value.trim().length > 0 && !value.includes('À COMPLÉTER')
}
