/**
 * Source unique de vérité du portfolio.
 *
 * Tout le contenu du site vient d'ici : accueil, contact, pied de page.
 * Aucun CMS, aucune base de données — on édite ce fichier, on commit, le site
 * se redéploie.
 *
 * Les expériences reprennent le profil LinkedIn (relevé de septembre 2026),
 * du plus récent au plus ancien. Les entrées marquées « À COMPLÉTER » sont des
 * gabarits vides : elles ne s'affichent pas tant qu'elles ne sont pas remplies
 * (voir `isFilled`).
 */

export const profile = {
  name: 'Salvador Cardona',
  role: 'Développeur web full-stack indépendant',
  /** Accroche courte, sous le nom. */
  tagline:
    'Treize ans d’applications web. Lead developer chez Animalink, à Lyon.',
  intro:
    'Je conçois et développe des applications web de bout en bout : des API Symfony structurées, ' +
    'des interfaces React qui tiennent dans le temps, et l’outillage qui va autour. ' +
    'Depuis deux ans, j’y ajoute l’IA appliquée : des agents et des automatisations branchés ' +
    'sur de vraies API, pas des démos.',
  /**
   * Ce que je vends, en une phrase. Sert de description SEO à l'accueil —
   * tenue sous 160 caractères, la limite avant troncature dans les résultats
   * Google.
   */
  pitch:
    'Développeur web indépendant à Lyon : applications sur mesure ' +
    '(Symfony, React, TypeScript), audit de sécurité, intégration IA. ' +
    'Treize ans d’expérience.',
  location: 'Lyon, France',
  /** Zone d'intervention, telle qu'affichée. */
  area: 'Lyon · à distance',
  yearsOfExperience: 13,
  availability:
    'Ouvert à de nouvelles missions : développement web, audit, intégration IA — à Lyon ou à distance.',
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
    title: 'Back-end',
    items: [
      'PHP 8',
      'Symfony 7',
      'API Platform',
      'JSON-LD / Hydra',
      'PostgreSQL',
      'Elasticsearch',
      'Mercure',
      'Node.js',
      'Python',
    ],
  },
  {
    title: 'Front-end',
    items: [
      'TypeScript',
      'React 19',
      'TanStack Router / Start',
      'TanStack Query',
      'Vue',
      'Angular',
      'Tailwind CSS',
      'shadcn/ui',
      'Three.js',
    ],
  },
  {
    title: 'IA appliquée',
    items: [
      'Agents LLM',
      'Claude Code',
      'MCP',
      'n8n',
      'Ollama',
      'OpenRouter',
      'Mistral',
      'Whisper',
      'Prompt engineering',
    ],
  },
  {
    title: 'Architecture & infra',
    items: [
      'Clean Architecture',
      'CQRS / DDD',
      'Docker',
      'Terraform',
      'AWS',
      'GitHub Actions',
      'Linux',
      'Vitest / PHPUnit',
    ],
  },
]

export type Experience = {
  company: string
  role: string
  period: string
  /** Contexte métier en une ligne, puis ce qui a été fait. */
  description: string
  stack: Array<string>
}

export const experiences: Array<Experience> = [
  {
    company: 'Animalink',
    role: 'Lead developer',
    period: 'Janvier 2024 — aujourd’hui',
    description:
      'Application web et mobile pour le soin animalier. Nouvelle plateforme construite de bout en bout : ' +
      'API REST sous API Platform en Clean Architecture et CQRS, recherche Elasticsearch, SPA React typée depuis ' +
      'le schéma de l’API, infrastructure AWS provisionnée en Terraform. Côté IA : agents n8n branchés sur ' +
      'l’API, analyse documentaire avec Mistral, chatbot produit.',
    stack: [
      'Symfony 7',
      'API Platform',
      'React',
      'TypeScript',
      'Elasticsearch',
      'AWS',
      'Terraform',
      'n8n',
    ],
  },
  {
    company: 'Enkate',
    role: 'Développeur back-end',
    period: 'Février — juin 2023',
    description:
      'Studio de jeu vidéo lyonnais. API REST sous API Platform et Symfony 6 (Clean Architecture, CQRS, DDD), ' +
      'ajout d’une API web sur le serveur .NET existant, TMA C# côté Unity, découpage en micro-services et ' +
      'dockerisation complète.',
    stack: ['Symfony 6', 'API Platform', 'C# / .NET', 'Unity', 'Docker'],
  },
  {
    company: 'Greenweez',
    role: 'Développeur full-stack',
    period: 'Août 2022 — janvier 2023',
    description:
      'Marketplace du bio. API REST sous API Platform, migration du socle e-commerce vers Sylius, ' +
      'front SSR sous Next.js pour un catalogue lisible par les moteurs de recherche.',
    stack: ['Symfony 6', 'Sylius', 'Next.js', 'React', 'Docker'],
  },
  {
    company: 'BeeTrip',
    role: 'Développeur full-stack',
    period: 'Février — juillet 2022',
    description:
      'Marketplace des outils du BTP. Intégration du SDK Wizaplace pour la brique marketplace, API sous ' +
      'API Platform, SPA Vue.js, conseil sur les choix techniques.',
    stack: ['Symfony 6', 'API Platform', 'Vue.js', 'TypeScript', 'Wizaplace'],
  },
  {
    company: 'QANTIS.co',
    role: 'Développeur full-stack',
    period: 'Septembre 2021 — janvier 2022',
    description:
      'Marketplace B2B du BTP. SPA Vue 3 et TypeScript, API REST sous API Platform, tests unitaires et ' +
      'fonctionnels sur les deux stacks.',
    stack: ['Vue 3', 'TypeScript', 'Symfony 6', 'API Platform'],
  },
  {
    company: 'Bedrock Streaming',
    role: 'Développeur back-end Symfony',
    period: 'Février — août 2021',
    description:
      'Éditeur des plateformes de streaming de TF1 et M6. Évolutions de l’API Symfony 5 en DDD, ' +
      'tests unitaires et fonctionnels, travaux sur plusieurs services AWS.',
    stack: ['Symfony 5', 'PHP', 'DDD', 'AWS'],
  },
  {
    company: 'Jacquet Metal Service',
    role: 'Développeur full-stack',
    period: 'Août 2019 — février 2021',
    description:
      'Marketplace B2B de la métallurgie. Socle Sylius et API Platform, SPA Angular, migration de la base ' +
      'de données d’Oracle vers PostgreSQL.',
    stack: ['Symfony', 'Sylius', 'API Platform', 'Angular', 'PostgreSQL'],
  },
  {
    company: 'Wizaplace',
    role: 'Développeur full-stack',
    period: 'Décembre 2017 — août 2019',
    description:
      'Éditeur de solution marketplace. Développement du SDK PHP utilisé par les intégrateurs, ' +
      'marketplaces clientes sous Symfony 4, fronts Vue 2, Vuex et Nuxt.',
    stack: ['Symfony 4', 'PHP', 'Vue 2', 'Nuxt'],
  },
  {
    company: 'EDD',
    role: 'Développeur full-stack et formateur',
    period: 'Octobre 2018 — janvier 2019',
    description:
      'Indexation de médias (vidéo, presse, radio) dans une base documentaire, en parallèle de Wizaplace. ' +
      'Front Vue 2, back Symfony 4, et formation de l’équipe pour qu’elle reprenne la main.',
    stack: ['Symfony 4', 'Vue 2', 'PostgreSQL'],
  },
  {
    company: 'Agence Kali',
    role: 'Développeur full-stack',
    period: 'Septembre — décembre 2017',
    description:
      'Agence web lyonnaise. Application interne d’auto-formation (API Slim, front Angular), ' +
      'maintenance de sites WordPress et Drupal.',
    stack: ['PHP', 'Slim', 'Angular', 'WordPress', 'Drupal'],
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
    name: 'whisper-desk',
    description:
      'Dictée vocale hors-ligne pour Linux, WSL et macOS : un raccourci clavier, un overlay, et le texte est dans le presse-papiers.',
    url: 'https://github.com/SalvadorCardona/whisper-desk',
    tags: ['Python', 'Whisper', 'Linux', 'macOS'],
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
