/**
 * Les références de l'agence, affichées sur `/references` (et les trois
 * premières sur l'accueil) : des études de cas, problème, solution, résultat.
 *
 * Elles sont écrites à la main à partir des expériences de Notion
 * (`experiences.json`, qu'on ne modifie pas ici) : chaque fait doit s'y
 * retrouver. Pas de chiffre inventé, pas de technologie qui n'y figure pas ;
 * une mission menée en renfort de l'équipe du client le dit (`context`).
 */

import type { Service } from './services'

export type Reference = {
  /** Ancre sur `/references`, et clé de liste. Ne plus la changer une fois publiée. */
  id: string
  client: string
  /** Le secteur, en quelques mots. */
  sector: string
  /** L'année ou la période, telle qu'affichée. */
  period: string
  /** Le cadre de la mission : qui faisait quoi. */
  context: string
  /** Les marques connues qu'elle concerne, mises en avant sur la carte. */
  brands?: Array<string>
  problem: string
  solution: Array<string>
  result: string
  stack: Array<string>
  /** La page service qui décrit ce type de mission. */
  service: Service['slug']
}

export const references: Array<Reference> = [
  {
    id: 'bedrock-streaming',
    client: 'Bedrock Streaming',
    sector: 'Streaming vidéo grand public',
    period: '2021',
    context: 'Mission de notre lead dev, en renfort de l’équipe API.',
    brands: ['TF1', 'M6'],
    problem:
      'Bedrock édite la plateforme de streaming de TF1, de M6 et d’autres diffuseurs européens. Des services grand public : chaque évolution de l’API doit arriver sans rien casser de ce qui existe.',
    solution: [
      'Évolutions de l’API Symfony 5, menées en Domain-Driven Design.',
      'Tests unitaires et fonctionnels sur chaque évolution.',
      'Travaux sur plusieurs services AWS de la plateforme.',
    ],
    result:
      'Des évolutions livrées au rythme Scrum de l’équipe, couvertes par les tests, sur une API grand public en production.',
    stack: ['Symfony 5', 'PHP', 'DDD', 'AWS'],
    service: 'developpement-web',
  },
  {
    id: 'animalink',
    client: 'Animalink',
    sector: 'Application de soin animalier',
    period: '2023 — 2026',
    context: 'Lead dev de la nouvelle plateforme, de l’architecture au déploiement.',
    problem:
      'Construire une nouvelle plateforme web et mobile, avec une API assez claire pour qu’une interface et des agents d’IA s’en servent de la même façon.',
    solution: [
      'API REST sous API Platform, en Clean Architecture et CQRS, recherche Elasticsearch.',
      'Interface React entièrement typée : les types TypeScript sont générés depuis le schéma de l’API.',
      'Environnements Docker, CI GitHub Actions, hébergement AWS décrit en Terraform.',
      'Agents n8n branchés sur l’API, OCR et analyse documentaire, chatbot produit.',
    ],
    result:
      'Une plateforme construite et déployée de bout en bout, où les agents passent par les mêmes endpoints et les mêmes droits qu’un utilisateur.',
    stack: ['API Platform', 'Symfony', 'React', 'TypeScript', 'Docker', 'Terraform', 'n8n'],
    service: 'integration-ia',
  },
  {
    id: 'greenweez',
    client: 'Greenweez',
    sector: 'Marketplace bio',
    period: '2022 — 2023',
    context: 'Mission de notre lead dev, en renfort de l’équipe produit.',
    problem:
      'Faire migrer le socle e-commerce de la marketplace sans perdre la visibilité d’un catalogue qui doit rester lisible par les moteurs de recherche.',
    solution: [
      'Migration du socle e-commerce vers Sylius.',
      'API REST sous API Platform et Symfony 6, en Clean Architecture, CQRS et DDD.',
      'Front rendu côté serveur sous Next.js et React.',
      'Découpage en micro-services sur Google Cloud.',
    ],
    result:
      'Un socle e-commerce modernisé, un catalogue rendu côté serveur et indexable, et une API structurée pour la suite.',
    stack: ['Symfony 6', 'API Platform', 'Sylius', 'Next.js', 'GCP'],
    service: 'developpement-web',
  },
  {
    id: 'jacquet-metal-service',
    client: 'Jacquet Metal Service',
    sector: 'Marketplace B2B de la métallurgie',
    period: '2019 — 2021',
    context: 'Mission de notre lead dev, au sein de l’équipe du client.',
    problem:
      'Donner à un acteur de la métallurgie une marketplace B2B, sur une base de données Oracle à faire évoluer.',
    solution: [
      'Socle marketplace sous Sylius, API REST sous API Platform.',
      'Migration de la base de données d’Oracle vers PostgreSQL.',
      'Tests unitaires côté serveur et côté interface.',
    ],
    result:
      'Une marketplace B2B sur un socle open source, et une base de données migrée vers PostgreSQL.',
    stack: ['Symfony', 'API Platform', 'Sylius', 'PostgreSQL'],
    service: 'developpement-web',
  },
  {
    id: 'wizaplace',
    client: 'Wizaplace',
    sector: 'Éditeur SaaS de marketplace',
    period: '2017 — 2019',
    context: 'Mission de notre lead dev, dans l’équipe de l’éditeur.',
    problem:
      'Un éditeur dont la solution de marketplace est revendue à des intégrateurs : son SDK et les marketplaces de ses clients doivent suivre le produit.',
    solution: [
      'Développement et amélioration du SDK PHP de l’éditeur.',
      'Marketplaces clientes sous Symfony 4.',
      'Création d’API REST, tests unitaires PHP.',
    ],
    result:
      'Un SDK plus complet pour les intégrateurs, et des marketplaces clientes livrées sur le socle de l’éditeur.',
    stack: ['Symfony 4', 'PHP', 'API REST'],
    service: 'developpement-web',
  },
]
