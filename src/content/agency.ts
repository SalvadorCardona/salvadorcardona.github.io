/**
 * L'agence Cardona : la même personne que le reste du site, mais vendue
 * autrement. Là où `services.ts` décrit des missions facturées au forfait ou
 * en régie, on trouve ici deux abonnements mensuels à prix affiché.
 *
 * Tout est en dur, comme le reste du contenu, et repris tel quel dans le
 * JSON-LD de l'accueil (`ProfessionalService`, `Offer`, `FAQPage`) : ne pas
 * dupliquer les textes dans la route, éditer la donnée.
 */

import type { Service, ServiceIcon } from './services'

export type AgencyOffer = {
  /** Ancre sur la page, et clé de liste. Ne plus la changer une fois publiée. */
  id: string
  name: string
  /** Une ligne sous le nom, ce que l'abonnement fait pour le client. */
  tagline: string
  /** Prix mensuel en euros, hors taxes. Repris dans le JSON-LD. */
  price: number
  /** Ce que le prix couvre, en une phrase courte, sous le montant. */
  priceNote: string
  icon: ServiceIcon
  /** À qui l'abonnement s'adresse. */
  forWho: string
  /** Ce que comprend l'abonnement, un élément par ligne. */
  includes: Array<string>
  /** Le délai annoncé avant la première mise en ligne. */
  delivery: string
}

export const agency = {
  name: 'Cardona',
  /** La signature, sous le logo et en tête de l'accueil. */
  tagline: 'Agence digitale à Lyon',
  /** Ce qu'on vend, en une ligne : sert d'accroche et de description SEO. */
  pitch:
    'Agence digitale à Lyon : sites vitrines, ' +
    'applications métier et visibilité en ligne, au forfait mensuel dès 30 €.',
  /** Le renvoi vers l'accueil depuis les autres pages : les deux prix, en une ligne. */
  teaser:
    'L’agence Cardona : site vitrine à 30 € par mois, application métier à 100 € par mois',
  lead:
    'On conçoit, on écrit, on code et on fait vivre votre présence en ligne. Un abonnement mensuel, zéro facture de départ, et un interlocuteur qui construit lui-même ce qu’il vous propose.',
  /** Le positionnement, en deux ou trois paragraphes. */
  about: [
    'Cardona est une agence digitale lyonnaise, à taille humaine. On prend en charge la présence web d’une entreprise de bout en bout : l’image, les textes, le site, le nom de domaine, l’hébergement, les mises à jour, et l’application métier quand le besoin dépasse la vitrine. Pas de commercial, pas de chef de projet qui relaie : vous parlez directement à celui qui construit.',
    'Le modèle est volontairement simple. Deux abonnements, deux prix affichés, aucune facture de départ : la conception est étalée dans le mensuel plutôt que réglée d’un bloc. Vous savez ce que le web vous coûte chaque mois, et vous pouvez arrêter après la première année.',
    'Les missions plus lourdes — refonte d’une application existante, audit de sécurité, intégration de l’IA — restent facturées au forfait ou en régie sur les pages service. L’abonnement couvre ce qui vit dans la durée.',
  ],
  /** Les mots qui défilent dans le bandeau orange de l'accueil. */
  keywords: [
    'Sites vitrines',
    'Applications métier',
    'Intégration IA',
    'Identité web',
    'Rédaction',
    'Référencement',
    'Hébergement',
    'Maintenance',
  ],
} as const

/** Un chiffre clé de l'accueil : la valeur en gros, sa légende dessous. */
export type AgencyFigure = {
  value: string
  label: string
}

export const figures: Array<AgencyFigure> = [
  { value: '13 ans', label: 'de métier sur le web, depuis 2013' },
  { value: '30 €', label: 'par mois pour un site vitrine, tout compris' },
  { value: '2 sem.', label: 'pour être en ligne, contenus reçus' },
  { value: '0 €', label: 'de frais de mise en route' },
]

/** Ce que fait l'agence, en quatre métiers, sur l'accueil. */
export type AgencyExpertise = {
  title: string
  description: string
  icon: ServiceIcon
}

export const expertises: Array<AgencyExpertise> = [
  {
    title: 'Image & site vitrine',
    description:
      'Une identité web qui vous ressemble, des pages qui donnent envie d’appeler. Pensé pour le téléphone d’abord, là où vos clients vous cherchent.',
    icon: 'compass',
  },
  {
    title: 'Contenus & visibilité',
    description:
      'Des textes clairs, écrits pour vos clients et pour Google. Fiche d’établissement, référencement local, statistiques sans traceur publicitaire.',
    icon: 'sparkles',
  },
  {
    title: 'Applications sur mesure',
    description:
      'Le tableur qui fait tourner votre activité devient un outil taillé pour votre métier : vos écrans, vos droits, votre vocabulaire.',
    icon: 'code',
  },
  {
    title: 'Suivi & sérénité',
    description:
      'Hébergement, sauvegardes, sécurité, modifications à la demande. Votre site ne vieillit pas dans un coin : on s’en occupe chaque mois.',
    icon: 'shield',
  },
]

/**
 * Les deux publics, juste sous le hero : les petites entreprises, qui
 * prennent un abonnement, et les équipes qui cherchent un lead dev, en
 * mission au forfait ou en régie (les pages `/services`).
 */
export type AgencyAudience = {
  eyebrow: string
  title: string
  description: string
}

export const audiences: { business: AgencyAudience; tech: AgencyAudience } = {
  business: {
    eyebrow: 'Petites entreprises',
    title: 'Votre site ou votre application, au mois.',
    description:
      'Artisans, commerçants, indépendants : abonnement Vitrine à 30 €, Application à 100 € HT par mois, création comprise.',
  },
  tech: {
    eyebrow: 'Équipes tech et produits',
    title: 'Un lead dev IA freelance, au forfait ou en régie.',
    description:
      'Treize ans de développement web, de l’API au déploiement, et des modèles de langage mis en production dans de vraies applications.',
  },
}

/**
 * Les expertises du lead dev, en étiquettes sous le bloc « équipes tech ».
 * Chacune renvoie à la page service qui en parle : n'ajouter une étiquette
 * que si la page la décrit, et seulement sur une référence réelle.
 */
export type AgencyTechSkill = {
  label: string
  /** Le détail entre parenthèses, quand l'étiquette regroupe plusieurs outils. */
  detail?: string
  service: Service['slug']
}

export const techSkills: Array<AgencyTechSkill> = [
  {
    label: 'IA en production',
    detail: 'RAG, OCR, Whisper, agents, MCP',
    service: 'integration-ia',
  },
  { label: 'React & TypeScript', service: 'developpement-web' },
  { label: 'Symfony / API Platform', service: 'developpement-web' },
  {
    label: 'DevOps',
    detail: 'Docker, CI, AWS',
    service: 'developpement-web',
  },
  { label: 'Formation IA', service: 'integration-ia' },
]

/**
 * Une réalisation de la pile de cartes du hero : une capture d'un site ou
 * d'une application livrés, jamais une maquette. `image` est le nom de base
 * des fichiers de `public/realisations/`, déclinés en AVIF et WebP à deux
 * largeurs — 480 et 800 px pour une capture `desktop` (8:7), 180 et 360 px
 * pour une capture `mobile` (1:2), affichée dans un cadre de téléphone.
 */
export type AgencyWork = {
  name: string
  kind: string
  url: string
  image: string
  format: 'desktop' | 'mobile'
  alt: string
}

export const works: Array<AgencyWork> = [
  {
    name: 'Opoil',
    kind: 'Plateforme de rendez-vous',
    url: 'https://opoil.app',
    image: 'opoil-accueil',
    format: 'desktop',
    alt: 'Page d’accueil d’Opoil, l’annuaire des professionnels animaliers avec sa recherche par métier et par ville.',
  },
  {
    name: 'Opoil',
    kind: 'Fiche d’établissement',
    url: 'https://opoil.app/etablissement/le-bon-pas-lyon',
    image: 'opoil-fiche',
    format: 'mobile',
    alt: 'Fiche d’un éducateur canin dans l’application Opoil, sur téléphone, avec le bouton de demande de rendez-vous.',
  },
  {
    name: 'Le Bon Pas',
    kind: 'Site vitrine de démonstration',
    url: 'https://le-bon-pas.opoil.app',
    image: 'le-bon-pas',
    format: 'desktop',
    alt: 'Site vitrine de démonstration d’un éducateur canin lyonnais : titre, boutons de réservation et photo du Vieux Lyon.',
  },
  {
    name: 'react-resource-view',
    kind: 'Site de bibliothèque',
    url: 'https://cardona.digital/react-resource-view/',
    image: 'react-resource-view',
    format: 'desktop',
    alt: 'Page d’accueil de react-resource-view, bibliothèque React de formulaires et d’écrans d’administration.',
  },
  {
    name: 'whisper-desk',
    kind: 'Site d’application',
    url: 'https://cardona.digital/whisper-desk/',
    image: 'whisper-desk',
    format: 'mobile',
    alt: 'Site de whisper-desk, l’outil de dictée vocale hors ligne, sur téléphone.',
  },
  {
    name: 'ticket-runner',
    kind: 'Site d’application',
    url: 'https://cardona.digital/ticket-runner/',
    image: 'ticket-runner',
    format: 'desktop',
    alt: 'Page d’accueil de ticket-runner avec sa mascotte et un tableau de tickets.',
  },
  {
    name: 'ticket-runner',
    kind: 'Console web',
    url: 'https://cardona.digital/ticket-runner/#console',
    image: 'ticket-runner-console',
    format: 'desktop',
    alt: 'La console web de ticket-runner : le menu, le tableau des tickets et la conversation avec l’espace de travail.',
  },
]

export const offers: Array<AgencyOffer> = [
  {
    id: 'vitrine',
    name: 'Vitrine',
    tagline:
      'Un site qui vous représente, mis en ligne et tenu à jour, pour que vos clients vous trouvent.',
    price: 30,
    priceNote: 'par mois, tout compris',
    icon: 'compass',
    forWho:
      'Artisan, commerçant, profession libérale ou jeune entreprise qui n’a pas de site, ou qui en a un que plus personne ne met à jour.',
    includes: [
      'La conception et la rédaction du site, jusqu’à cinq pages.',
      'Le nom de domaine et l’hébergement, à notre nom ou au vôtre.',
      'Un site rapide, lisible sur téléphone, accessible et pensé pour le référencement.',
      'Le formulaire de contact, la carte, les horaires, les liens vers vos réseaux.',
      'Les modifications de contenu à la demande : textes, photos, tarifs, horaires.',
      'Les mises à jour techniques, les sauvegardes et la surveillance de la disponibilité.',
      'Les statistiques de fréquentation, sans cookie ni traceur publicitaire.',
    ],
    delivery: 'En ligne sous deux semaines après réception de vos contenus.',
  },
  {
    id: 'application',
    name: 'Application',
    tagline:
      'Un outil sur mesure pour votre métier : ce que vous faites aujourd’hui dans un tableur, en mieux.',
    price: 100,
    priceNote: 'par mois, tout compris',
    icon: 'code',
    forWho:
      'Une entreprise dont l’activité tient dans des fichiers partagés, des mails et des tableurs, et qui veut un outil qui lui ressemble sans payer un projet à cinq chiffres.',
    includes: [
      'Tout ce que comprend l’abonnement Vitrine.',
      'Une application web sur mesure : vos données, vos écrans, votre vocabulaire.',
      'Des comptes et des droits : votre équipe, vos clients, chacun ne voit que ce qui le concerne.',
      'Une API pour brancher vos autres outils, et de l’automatisation là où une tâche se répète.',
      'Une journée d’évolutions par mois, reportable sur le trimestre : un nouvel écran, un nouveau champ, un nouvel export.',
      'La supervision, les sauvegardes quotidiennes et la restauration en cas d’incident.',
      'Un point tous les mois sur ce qui a été livré et ce qui vient ensuite.',
    ],
    delivery:
      'Une première version utilisable en un mois, puis des livraisons régulières.',
  },
]

/** Ce qui vaut pour les deux abonnements, affiché une fois sous les forfaits. */
export const commitments: Array<string> = [
  'Aucun frais de mise en route : la création est comprise dans le mensuel.',
  'Un engagement d’un an, puis mois par mois — vous partez avec votre nom de domaine et votre contenu.',
  'Un seul interlocuteur, joignable par mail, qui répond sous deux jours ouvrés.',
  'Le code et les données vous appartiennent : on vous les remet sur simple demande.',
]

export type AgencyStep = {
  title: string
  description: string
}

export const steps: Array<AgencyStep> = [
  {
    title: 'Un appel',
    description:
      'Une heure pour comprendre votre activité, ce que vos clients cherchent et ce qui vous fait perdre du temps. Gratuit, sans engagement.',
  },
  {
    title: 'Une maquette',
    description:
      'On vous montre à quoi ressemblera le site ou l’application avant d’écrire la moindre ligne, et on ajuste jusqu’à ce que ce soit juste.',
  },
  {
    title: 'La mise en ligne',
    description:
      'Domaine, hébergement, référencement, statistiques : on s’occupe de tout, vous n’avez aucun compte à créer.',
  },
  {
    title: 'La suite',
    description:
      'Chaque mois, vos demandes sont traitées, les mises à jour posées, les sauvegardes vérifiées. Vous ne repayez rien.',
  },
]

export type AgencyFaq = {
  question: string
  answer: string
}

export const faq: Array<AgencyFaq> = [
  {
    question: 'Pourquoi un abonnement plutôt qu’un devis ?',
    answer:
      'Parce qu’un site n’est pas fini le jour de sa mise en ligne. Le devis classique fait payer cher la création, puis laisse le site vieillir faute de budget pour l’entretenir. L’abonnement étale la création et paie l’entretien : sur trois ans, la Vitrine revient à 1 080 € HT, création, hébergement et mises à jour comprises.',
  },
  {
    question: 'Que se passe-t-il si j’arrête ?',
    answer:
      'Vous récupérez votre nom de domaine, vos contenus, vos données et le code source. On vous accompagne pour transférer l’hébergement où vous voulez. Rien n’est retenu.',
  },
  {
    question: 'Trente euros par mois, comment est-ce possible ?',
    answer:
      'Parce qu’il n’y a personne entre vous et celui qui construit : pas de commercial, pas de locaux prestigieux à faire vivre, pas de licence de CMS. Les sites vitrine sont construits sur une base que nous maîtrisons et réutilisons, et l’hébergement d’un site statique coûte quelques euros par mois.',
  },
  {
    question: 'Puis-je passer de la Vitrine à l’Application ?',
    answer:
      'Oui, c’est même le chemin habituel : on commence par la présence web, et l’application arrive quand un besoin métier se précise. Le changement prend effet au mois suivant, sans refaire le site.',
  },
  {
    question: 'Et si mon besoin dépasse ces deux forfaits ?',
    answer:
      'On en parle et on vous fait une proposition classique, au forfait ou en régie : reprise d’une application existante, audit de sécurité, intégration de l’IA. Les pages service décrivent ces prestations.',
  },
]
