/**
 * Source unique de vérité du portfolio.
 *
 * Tout le contenu du site vient d'ici : accueil, contact, pied de page.
 * Aucun CMS, aucune base de données — on édite ce fichier, on commit, le site
 * se redéploie.
 *
 * Le contenu est aligné sur le profil LinkedIn refondu le 7 septembre 2026 :
 * même titre, même stack, mêmes expériences — reformulés pour le web, jamais
 * copiés mot pour mot. Les expériences vont du plus récent au plus ancien.
 * Les entrées marquées « À COMPLÉTER » sont des gabarits vides : elles ne
 * s'affichent pas tant qu'elles ne sont pas remplies (voir `isFilled`).
 */

export const profile = {
  name: 'Salvador Cardona',
  role: 'Développeur web full-stack indépendant',
  /**
   * Le titre LinkedIn, sans le rôle qui le précède. Affiché sous le titre du
   * hero et repris dans le `<title>` de l'accueil.
   */
  headline:
    'Symfony / API Platform · React & TypeScript · IA appliquée : agents, LLM, outillage',
  /**
   * Présentation, un paragraphe par entrée. Reprend les faits de la section
   * « Infos » LinkedIn : la stack, ce qui a changé côté IA, et où ça tourne.
   */
  about: [
    'Développeur web depuis 2013, indépendant à Lyon. Symfony et API Platform côté serveur, ' +
      'React et TypeScript côté navigateur, JSON-LD entre les deux : le contrat d’API décrit ' +
      'assez la donnée pour que le front en génère ses types, ses formulaires et ses vues.',
    'Ces derniers mois, c’est sur l’IA appliquée que j’ai le plus progressé, avec des outils ' +
      'publics que j’utilise tous les jours : ticket-runner transforme un ticket Notion en session ' +
      'd’agent puis en pull request, gnome-claude-usage affiche la consommation Claude Code dans ' +
      'GNOME Shell, whisper-desk dicte hors-ligne sous Linux, WSL et macOS. Chez Animalink, ce ' +
      'sont des agents n8n branchés sur l’API Symfony, de l’analyse documentaire avec Mistral et ' +
      'un chatbot produit.',
  ],
  /**
   * Ce que je vends, en une phrase. Sert de description SEO à l'accueil —
   * tenue sous 160 caractères, la limite avant troncature dans les résultats
   * Google.
   */
  pitch:
    'Développeur web full-stack indépendant à Lyon : Symfony / API Platform, ' +
    'React & TypeScript, IA appliquée (agents, LLM, outillage). Treize ans d’expérience.',
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

/**
 * Le bloc « STACK » de la section Infos LinkedIn, dans le même ordre, plus les
 * compétences IA déclarées là-bas (MCP, LLM) et les entrées corrigées
 * (Next.js, Sylius). Modifier ici et sur LinkedIn ensemble.
 */
export const skills: Array<SkillGroup> = [
  {
    title: 'Back',
    items: [
      'PHP 8.4',
      'Symfony 7',
      'API Platform',
      'JSON-LD / Hydra',
      'Python',
      'Node.js',
      'Mercure',
      'Elasticsearch',
      'PostgreSQL',
      'Sylius',
    ],
  },
  {
    title: 'Front',
    items: [
      'TypeScript',
      'React 19',
      'TanStack Router / Start & Query',
      'Vue',
      'Angular',
      'Tailwind',
      'shadcn/ui',
      'Three.js',
      'Next.js',
    ],
  },
  {
    title: 'IA',
    items: [
      'Claude Code',
      'Ollama',
      'OpenRouter',
      'Mistral',
      'n8n',
      'Whisper',
      'Prompt engineering',
      'MCP',
      'LLM',
    ],
  },
  {
    title: 'Infra',
    items: ['Docker', 'Terraform', 'AWS', 'GitHub Actions', 'Linux'],
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
    company: 'SalvadorCardona (GitHub)',
    role: 'Open source — outillage et agents IA',
    period: 'Janvier 2024 — aujourd’hui',
    description:
      'Sur mon temps propre, des outils qui font travailler des agents LLM sur des tâches réelles, et ' +
      'l’écosystème front qui va avec. ticket-runner : un ticket Notion devient une session Claude Code ' +
      'dans une worktree git jetable, avec une pull request à l’arrivée. gnome-claude-usage : extension ' +
      'GNOME Shell publiée sur extensions.gnome.org, qui lit la consommation Claude Code depuis la CLI ' +
      'officielle. whisper-desk : dictée vocale hors-ligne, sur GPU ou CPU, pour Linux, WSL et macOS. ' +
      'trader-ia : arène de paper trading S&P 500 entre agents traders. Et neuf paquets pour consommer ' +
      'une API JSON-LD / Hydra sans réécrire le même CRUD : react-resource-view, react-data-form, ' +
      'jsonld-api-client, jsonld-repository, jsonld-item, resource-registry, react-jwt-session, ' +
      'react-mini-i18n, ssr-safe-storage.',
    stack: [
      'Python',
      'TypeScript',
      'React',
      'Claude Code',
      'MCP',
      'Ollama',
      'OpenRouter',
      'faster-whisper',
      'n8n',
      'Notion API',
      'GitHub Actions',
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
    url: 'https://cardona.digital/ticket-runner/',
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
    url: 'https://cardona.digital/whisper-desk/',
    tags: ['Python', 'Whisper', 'Linux', 'macOS'],
    featured: true,
  },
  {
    name: 'gnome-claude-usage',
    description:
      'Indicateur GNOME Shell pour la consommation Claude Code : un camembert dans la barre, les limites et heures de reset au clic.',
    url: 'https://github.com/SalvadorCardona/gnome-claude-usage',
    tags: ['GNOME Shell', 'JavaScript', 'Python'],
    featured: true,
  },
  {
    name: 'react-data-form',
    description:
      'Formulaires React pilotés par la donnée : construction déclarative, contrôleurs de champs, groupes et étapes — pensés pour API Platform.',
    url: 'https://github.com/SalvadorCardona/react-data-form',
    tags: ['React', 'TypeScript', 'Formulaires'],
    featured: true,
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
