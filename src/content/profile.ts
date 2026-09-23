/**
 * Source unique de vérité du portfolio, à l'exception des expériences (voir
 * `content/experiences.ts`, alimenté depuis Notion) et des articles (voir
 * `content/posts/`).
 *
 * Tout le reste du contenu vient d'ici : accueil, contact, pied de page.
 * Aucun autre CMS, aucune base de données — on édite ce fichier, on commit,
 * le site se redéploie.
 *
 * Le contenu est aligné sur le profil LinkedIn, relu le 8 septembre 2026 :
 * même titre, même stack, mêmes diplômes — reformulés pour le web, jamais
 * copiés mot pour mot. `education` reprend la section « Formation », dans le
 * même ordre et avec les mêmes dates : une entrée absente de LinkedIn n'a rien
 * à faire ici, et inversement. Les entrées marquées « À COMPLÉTER » sont des
 * gabarits vides : elles ne s'affichent pas tant qu'elles ne sont pas remplies
 * (voir `isFilled`).
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
      'd’agent puis en pull request, Claude Usage affiche la consommation Claude Code dans ' +
      'GNOME Shell, Whisper Desk dicte hors ligne sous Linux, WSL et macOS. Chez Animalink, ' +
      'j’ai branché des agents n8n sur l’API Symfony, mis en place de l’analyse documentaire ' +
      'avec Mistral et un chatbot produit.',
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
    'Ouvert à de nouvelles missions : développement web, audit, intégration IA, à Lyon ou à distance.',
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

export type Education = {
  school: string
  degree: string
  year: string
  detail?: string
}

export const education: Array<Education> = [
  {
    school: 'Université Lumière Lyon 2',
    degree: 'Master en génie informatique',
    year: '2013 — 2015',
    detail: 'Niveau Bac +4.',
  },
  {
    school: 'IUT de Saint-Raphaël',
    degree: 'DUT informatique',
    year: '2011 — 2013',
    detail: 'En alternance.',
  },
]

/**
 * Un projet : son dépôt, et — quand ils existent — le site en ligne et la
 * documentation publiée. Les trois liens alimentent la page `/projets`, qui
 * sert de point d'entrée vers tous les dépôts.
 */
export type Project = {
  name: string
  description: string
  /**
   * Le dossier de `public/projects/` qui porte l'icône et la bannière du
   * projet. Il porte le nom du dépôt, comme dans `SalvadorCardona/brand-assets`
   * d'où les visuels sont recopiés — voir AGENTS.md.
   */
  brand: string
  /** Le dépôt GitHub : c'est le lien principal, tout projet en a un. */
  url: string
  /** Le site en ligne, pour les projets qui tournent quelque part. */
  site?: string
  /** La documentation publiée, pour les librairies qui en ont une. */
  docs?: string
  tags: Array<string>
  /** Affiché sur l'accueil ; les autres n'apparaissent que sur `/projets`. */
  featured?: boolean
}

export const projects: Array<Project> = [
  {
    name: 'ticket-runner',
    description:
      'Vos tickets Notion, joués par Claude Code : une session par ticket, une pull request à l’arrivée.',
    brand: 'ticket-runner',
    url: 'https://github.com/SalvadorCardona/ticket-runner',
    docs: 'https://cardona.digital/ticket-runner/',
    tags: ['Python', 'Agents LLM', 'Notion API'],
    featured: true,
  },
  {
    name: 'React Resource View',
    description:
      'Vues CRUD pour API JSON-LD / Hydra : on déclare une ressource et le package génère liste, détail, création, édition et suppression, câblés à l’API et à l’URL.',
    brand: 'react-resource-view',
    url: 'https://github.com/SalvadorCardona/react-resource-view',
    docs: 'https://cardona.digital/react-resource-view/',
    tags: ['React', 'TypeScript', 'JSON-LD'],
    featured: true,
  },
  {
    name: 'Whisper Desk',
    description:
      'Dictée vocale hors ligne pour Linux, WSL et macOS : un raccourci clavier, un overlay, et le texte est dans le presse-papiers.',
    brand: 'whisper-desk',
    url: 'https://github.com/SalvadorCardona/whisper-desk',
    docs: 'https://cardona.digital/whisper-desk/',
    tags: ['Python', 'Whisper', 'Linux', 'macOS'],
    featured: true,
  },
  {
    name: 'Lead Finder',
    description:
      'Génération de leads du monde animalier : un scraper autonome parcourt le web, archive les contenus bruts, puis les mappe par IA vers une base d’entreprises qualifiées.',
    brand: 'animalink-lead',
    url: 'https://github.com/SalvadorCardona/animalink-lead',
    site: 'https://leads.animalink.fr',
    tags: ['Symfony 8', 'FrankenPHP', 'Scraping', 'LLM'],
  },
  {
    name: 'Claude Usage',
    description:
      'Extension GNOME Shell affichant la consommation Claude Code en graphique circulaire dans la barre supérieure, avec le détail des limites hebdomadaires au clic. Sans clé d’API.',
    brand: 'gnome-claude-usage',
    url: 'https://github.com/SalvadorCardona/gnome-claude-usage',
    tags: ['GNOME Shell', 'GJS', 'Python'],
    featured: true,
  },
  {
    name: 'React Data Form',
    description:
      'Formulaires React pilotés par la donnée : on décrit le formulaire comme un objet, la librairie rend les champs, tient l’état, valide et remonte les erreurs de l’API.',
    brand: 'react-data-form',
    url: 'https://github.com/SalvadorCardona/react-data-form',
    docs: 'https://cardona.digital/react-data-form/',
    tags: ['React', 'TypeScript', 'Formulaires'],
    featured: true,
  },
  {
    name: 'jsonld-api-client',
    description:
      'Client typé pour API JSON-LD / Hydra : openapi-fetch avec en-têtes d’auth et de scope, cache d’IRI, abonnements Mercure.',
    brand: 'jsonld-api-client',
    url: 'https://github.com/SalvadorCardona/jsonld-api-client',
    tags: ['TypeScript', 'JSON-LD', 'Mercure'],
  },
  {
    name: 'react-mini-i18n',
    description:
      'Traduction React réduite à l’essentiel : un dictionnaire clé → texte, une fonction translate, un composant Trans et un provider.',
    brand: 'react-mini-i18n',
    url: 'https://github.com/SalvadorCardona/react-mini-i18n',
    tags: ['React', 'i18n'],
  },
]

/** L'icône carrée du projet, servie depuis `public/projects/`. */
export function projectIcon(project: Project): string {
  return `/projects/${project.brand}/icon.png`
}

/** La bannière du projet, au format 21:9, servie depuis `public/projects/`. */
export function projectBanner(project: Project): string {
  return `/projects/${project.brand}/banner.jpg`
}

/** Une entrée est affichée seulement si elle ne contient plus de gabarit vide. */
export function isFilled(value: string): boolean {
  return value.trim().length > 0 && !value.includes('À COMPLÉTER')
}
