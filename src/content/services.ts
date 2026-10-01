/**
 * Les prestations proposées : une entrée par page `/services/<slug>`, plus les
 * interventions ponctuelles listées sur `/services`.
 *
 * Tout est en dur, comme le reste du contenu. Les pages service partagent
 * le même gabarit (`ServicePage`) : changer un texte ici suffit, la structure
 * HTML et les données structurées (JSON-LD) suivent.
 *
 * Rédaction pensée pour le référencement : le titre porte la requête visée,
 * la description tient en moins de 160 caractères, chaque section répond à une
 * question qu'un client se pose vraiment, et la FAQ est reprise mot pour mot
 * dans le balisage `FAQPage`.
 */

export type ServiceIcon = 'code' | 'shield' | 'sparkles' | 'api' | 'workflow' | 'compass'

export type ServiceIllustration =
  | 'web-development'
  | 'security-audit'
  | 'ai-integration'
  | 'ai-training'

export type ServiceFaq = {
  question: string
  answer: string
}

export type ServiceStep = {
  title: string
  description: string
}

export type Service = {
  /** Segment d'URL après `/services/`. Ne plus le changer une fois publié. */
  slug: string
  /** Nom court, pour les cartes, le menu et le fil d'Ariane. */
  name: string
  /** Balise <title> et H1. Porte la requête visée. */
  title: string
  /** Balise <meta name="description">, moins de 160 caractères. */
  description: string
  /** Deux lignes sur la carte de l'accueil. */
  excerpt: string
  icon: ServiceIcon
  /** Le dessin du livrable, en tête de la carte et de la page. */
  illustration: ServiceIllustration
  /** Accroche sous le H1. */
  lead: string
  /** Le problème que ça résout, en deux ou trois paragraphes. */
  context: Array<string>
  /** Les situations où ça sert. */
  forWho: Array<string>
  /** Ce que comprend la prestation. */
  includes: Array<ServiceStep>
  /** Comment ça se passe, dans l'ordre. */
  process: Array<ServiceStep>
  /** Ce que le client reçoit à la fin. */
  deliverables: Array<string>
  /** Les technologies employées, aussi dans le JSON-LD. */
  stack: Array<string>
  faq: Array<ServiceFaq>
  /** Slugs d'articles du blog à lier en fin de page. */
  relatedPosts: Array<string>
}

export const services: Array<Service> = [
  {
    slug: 'developpement-web',
    name: 'Développement web',
    title: 'Développement web sur mesure : Symfony, React et TypeScript',
    description:
      'Développeur web freelance à Lyon : applications sur mesure, API REST Symfony / API Platform, interfaces React et TypeScript. Treize ans d’expérience.',
    excerpt:
      'Des applications web de bout en bout : API Symfony structurées, interfaces React typées, et l’outillage qui va avec.',
    icon: 'code',
    illustration: 'web-development',
    lead:
      'Une application web sur mesure, du contrat d’API à l’interface, que votre équipe pourra reprendre et faire évoluer sans moi.',
    context: [
      'Treize ans à construire des applications pour des gens qui vendent quelque chose de compliqué : des marketplaces B2B et B2C, une plateforme de streaming grand public, une application de soin animalier. À chaque fois le même travail de fond : une API qui décrit clairement la donnée, une interface qui la consomme simplement, et des tests qui permettent de modifier le code en confiance.',
      'Symfony et API Platform côté serveur, React et TypeScript côté navigateur, JSON-LD entre les deux. Le front génère ses types, ses formulaires et ses vues depuis le contrat d’API : moins de code écrit à la main, et les deux côtés ne divergent pas.',
      'Je prends aussi bien un projet à zéro qu’une application existante à faire évoluer : reprise de code, montée de version Symfony ou React, refonte d’une API, ajout d’un module.',
    ],
    forWho: [
      'Une start-up ou une PME qui lance un produit web et veut un socle technique propre dès le départ.',
      'Une équipe qui a besoin d’un renfort senior pour un chantier précis : nouvelle API, refonte du front, migration.',
      'Une application existante qui a pris de la dette et qu’il faut remettre d’équerre avant d’aller plus loin.',
      'Une marketplace ou un e-commerce sur Symfony, Sylius ou API Platform.',
    ],
    includes: [
      {
        title: 'Cadrage et architecture',
        description:
          'On part du métier : entités, règles, parcours. J’en tire un modèle de données et un découpage clair (Clean Architecture, CQRS quand ça se justifie).',
      },
      {
        title: 'API REST sous Symfony et API Platform',
        description:
          'Une API documentée, versionnable, sécurisée, avec JSON-LD et Hydra pour que le contrat soit lisible par un humain comme par une machine.',
      },
      {
        title: 'Interfaces React et TypeScript',
        description:
          'Des SPA typées de bout en bout, générées depuis le schéma de l’API : TanStack Router et Query, Tailwind, shadcn/ui. Ou Vue et Angular si c’est déjà votre stack.',
      },
      {
        title: 'Tests, CI et déploiement',
        description:
          'Tests unitaires et fonctionnels, analyse statique bloquante, Docker pour des environnements reproductibles, GitHub Actions, infrastructure AWS décrite en Terraform.',
      },
      {
        title: 'Performance et référencement',
        description:
          'Rendu serveur ou prérendu quand la page doit être indexée, données structurées, Core Web Vitals surveillés.',
      },
    ],
    process: [
      {
        title: 'Un premier échange',
        description:
          'Une heure pour comprendre le besoin, l’existant et les contraintes. Gratuit et sans engagement.',
      },
      {
        title: 'Une proposition écrite',
        description:
          'Périmètre, découpage en lots, estimation et mode de facturation : forfait sur un périmètre fermé, régie sur un chantier ouvert.',
      },
      {
        title: 'Des livraisons courtes',
        description:
          'Une pull request relue par lot, une démonstration à chaque étape, du code que votre équipe peut lire et reprendre.',
      },
      {
        title: 'Une transmission',
        description:
          'Documentation, passation, et si besoin formation de l’équipe qui reprend la main.',
      },
    ],
    deliverables: [
      'Le code source, versionné, testé, avec sa documentation.',
      'Une API documentée (OpenAPI et JSON-LD) et son environnement Docker.',
      'Une chaîne d’intégration continue prête à l’emploi.',
      'Un passage de relais avec l’équipe en place.',
    ],
    stack: [
      'PHP 8',
      'Symfony 7',
      'API Platform',
      'JSON-LD / Hydra',
      'PostgreSQL',
      'Elasticsearch',
      'TypeScript',
      'React 19',
      'TanStack',
      'Tailwind CSS',
      'Docker',
      'Terraform',
      'AWS',
      'GitHub Actions',
    ],
    faq: [
      {
        question: 'Travaillez-vous seulement en Symfony et React ?',
        answer:
          'C’est la stack que je maîtrise le mieux et que je recommande pour un projet neuf. J’ai aussi livré des applications en Vue, Nuxt, Angular, Next.js et Sylius, et j’interviens volontiers sur un existant dans ces technologies.',
      },
      {
        question: 'Comment facturez-vous ?',
        answer:
          'Au forfait sur un périmètre fermé et estimé, ou en régie (au jour) sur un chantier ouvert ou un renfort d’équipe. Le mode est proposé dans le devis, après le premier échange.',
      },
      {
        question: 'Pouvez-vous reprendre une application existante ?',
        answer:
          'Oui. Je commence en général par un audit court pour mesurer l’état du code, des tests et des dépendances, puis on décide ensemble de ce qu’on corrige, de ce qu’on refait et de ce qu’on laisse.',
      },
      {
        question: 'Intervenez-vous à distance ?',
        answer:
          'Oui, la plupart de mes missions se font à distance, avec des points réguliers. Je suis à Lyon et je me déplace pour les phases de cadrage ou les ateliers.',
      },
    ],
    relatedPosts: [
      'json-ld-le-contrat-que-le-front-attendait',
      'un-portfolio-tanstack-start-sur-github-pages',
    ],
  },
  {
    slug: 'audit-securite-application',
    name: 'Audit de sécurité et de qualité',
    title: 'Audit de sécurité et de qualité d’une application web',
    description:
      'Audit de sécurité et de qualité de votre application web : failles OWASP, authentification, API, dépendances, configuration Docker et cloud. Rapport priorisé.',
    excerpt:
      'Un regard extérieur sur votre application : failles, dette technique, dépendances, configuration. Un rapport court, classé par urgence.',
    icon: 'shield',
    illustration: 'security-audit',
    lead:
      'Savoir où en est votre application avant qu’un incident, un client ou un investisseur ne pose la question.',
    context: [
      'La plupart des applications web que j’ai reprises en treize ans avaient les mêmes faiblesses : une authentification bricolée, des droits vérifiés côté interface mais pas côté API, des dépendances jamais mises à jour, des secrets dans le dépôt, un Docker de production qui tourne en root. Rien d’exotique, mais rien que l’équipe n’avait le temps de regarder.',
      'L’audit que je propose est celui d’un développeur qui construit et exploite ce type d’application au quotidien : je lis le code, j’exécute l’application, je teste l’API comme le ferait quelqu’un de mal intentionné, et je restitue ce que j’ai trouvé par ordre d’urgence, avec la correction à faire pour chaque point.',
      'Pour un test d’intrusion certifié ou une mise en conformité réglementaire, je vous oriente vers un prestataire qualifié. Mon audit est le regard technique complet qui précède, et qui souvent suffit.',
    ],
    forWho: [
      'Une application en production qui n’a jamais été relue par quelqu’un d’extérieur à l’équipe.',
      'Une reprise de projet : vous héritez d’un code que vous n’avez pas écrit et voulez savoir ce que vous achetez.',
      'Une levée de fonds, un appel d’offres ou un gros client qui demandent des garanties techniques.',
      'Une équipe qui sent que l’application ralentit ou casse plus souvent, sans savoir par où commencer.',
    ],
    includes: [
      {
        title: 'Sécurité applicative',
        description:
          'Les dix risques OWASP passés en revue sur votre code : injections, contrôle d’accès, authentification et sessions, exposition de données, configuration, validation des entrées.',
      },
      {
        title: 'API et données',
        description:
          'Droits vérifiés endpoint par endpoint, filtrage et pagination, fuites d’information dans les réponses, journalisation, gestion des secrets et des jetons.',
      },
      {
        title: 'Dépendances et chaîne de build',
        description:
          'Inventaire des paquets Composer et npm, vulnérabilités connues, versions en fin de vie, reproductibilité du build, secrets dans l’historique Git.',
      },
      {
        title: 'Infrastructure et déploiement',
        description:
          'Images Docker, variables d’environnement, réseau, sauvegardes, configuration AWS ou serveur, en-têtes HTTP, TLS.',
      },
      {
        title: 'Qualité et maintenabilité',
        description:
          'Architecture, couverture de tests, dette technique, points de fragilité, performance des requêtes. Ce qui rendra la prochaine évolution coûteuse.',
      },
    ],
    process: [
      {
        title: 'Cadrage',
        description:
          'On définit le périmètre (une application, une API, un module) et ce qui vous inquiète le plus. Accès au dépôt et à un environnement de test.',
      },
      {
        title: 'Analyse',
        description:
          'Lecture du code, exécution, tests manuels et outillés sur l’application. En général une à deux semaines selon la taille.',
      },
      {
        title: 'Restitution',
        description:
          'Un rapport classé par gravité et par effort, et une réunion de restitution avec l’équipe pour expliquer chaque point et répondre aux questions.',
      },
      {
        title: 'Correction, si vous le souhaitez',
        description:
          'Je peux corriger moi-même les points critiques ou accompagner l’équipe qui le fait, puis vérifier le résultat.',
      },
    ],
    deliverables: [
      'Un rapport écrit : constats, preuves, gravité, effort de correction, recommandation pour chacun.',
      'Un plan de remédiation priorisé, réaliste pour votre équipe.',
      'Une réunion de restitution, enregistrée si vous le souhaitez.',
      'Une contre-vérification après correction, en option.',
    ],
    stack: [
      'OWASP Top 10',
      'Symfony',
      'API Platform',
      'React',
      'Node.js',
      'PostgreSQL',
      'Docker',
      'AWS',
      'GitHub Actions',
      'Composer / npm audit',
      'PHPStan',
      'ESLint',
    ],
    faq: [
      {
        question: 'Est-ce un test d’intrusion (pentest) ?',
        answer:
          'Non. Un pentest est mené en boîte noire par un prestataire spécialisé, souvent qualifié. Mon audit se fait avec accès au code et à l’application, il est plus large (qualité, dette, infrastructure) et il précède utilement un pentest, dont il réduit le nombre de constats.',
      },
      {
        question: 'Combien de temps dure un audit ?',
        answer:
          'Entre trois jours pour une API ou un module, et deux semaines pour une application complète avec son infrastructure. La durée est fixée au cadrage, le prix est forfaitaire.',
      },
      {
        question: 'Que se passe-t-il avec les informations que je vous confie ?',
        answer:
          'Un accord de confidentialité est signé avant tout accès. Je travaille sur un environnement de test, jamais sur vos données de production, et je supprime les accès à la fin de la mission.',
      },
      {
        question: 'Pouvez-vous auditer une application que vous n’avez pas écrite, dans une autre stack ?',
        answer:
          'Oui pour PHP (Symfony, Laravel, WordPress), Node.js et les fronts JavaScript. Pour une autre stack, je le dis au cadrage si ce n’est pas raisonnable.',
      },
    ],
    relatedPosts: ['json-ld-le-contrat-que-le-front-attendait'],
  },
  {
    slug: 'integration-ia',
    name: 'Intégration IA',
    title: 'Intégration de l’IA dans vos outils : agents LLM, automatisations, assistants',
    description:
      'Intégration de l’IA dans votre application : agents LLM branchés sur vos API, n8n, OCR, RAG, transcription Whisper, chatbot. Livré en production.',
    excerpt:
      'Des agents et des automatisations branchés sur vos API et vos données : ce qui fait gagner du temps à l’équipe, en production.',
    icon: 'sparkles',
    illustration: 'ai-integration',
    lead:
      'Faire entrer un modèle de langage dans un outil existant sans casser ce qui marche pour les humains.',
    context: [
      'Une API bien conçue est déjà une API pilotable par un agent. C’est ce que m’ont appris deux ans à brancher des modèles de langage sur de vraies applications : chez Animalink, des agents n8n qui passent par l’API Symfony avec les mêmes droits qu’un utilisateur, de l’analyse documentaire avec Mistral, un chatbot produit. Sur mon temps libre, des outils publics comme ticket-runner, qui joue un ticket Notion dans une session d’agent et en sort une pull request.',
      'Le travail intéressant n’est pas dans le prompt. Il est dans ce qui l’entoure : quelles données le modèle voit, ce qu’il a le droit de faire, comment on vérifie sa sortie, ce qui se passe quand il se trompe, et combien ça coûte par appel. C’est du travail de développeur, et c’est ce que je fais.',
      'Je choisis le modèle en fonction du besoin et de vos contraintes : API hébergée (Claude, Mistral, OpenRouter) quand la qualité prime, modèle local avec Ollama quand la donnée ne doit pas sortir.',
    ],
    forWho: [
      'Une équipe qui répète chaque jour une tâche de lecture, de tri ou de rédaction que l’IA peut faire à sa place, sous contrôle.',
      'Un produit qui veut proposer un assistant à ses utilisateurs, branché sur ses vraies données.',
      'Une application existante à rendre pilotable par des agents : API, outils MCP, webhooks.',
      'Une entreprise qui veut essayer l’IA sur un cas précis, avec un budget et un délai fermés, avant de généraliser.',
    ],
    includes: [
      {
        title: 'Choix du cas d’usage',
        description:
          'On part d’une tâche mesurable : combien de temps elle prend, combien de fois par jour, ce qu’une erreur coûte. C’est ce qui décide si ça vaut le coup.',
      },
      {
        title: 'Agents branchés sur vos API',
        description:
          'Des agents qui lisent et écrivent dans votre système par ses API, avec des droits limités et une trace de chaque action. Serveurs MCP pour exposer vos outils à Claude ou à d’autres modèles.',
      },
      {
        title: 'Automatisations n8n',
        description:
          'Des flux entre vos outils (CRM, messagerie, Notion, ERP) avec une étape de modèle de langage là où elle apporte quelque chose, et une validation humaine là où il le faut.',
      },
      {
        title: 'Analyse de documents et recherche',
        description:
          'Extraction d’informations dans des PDF, des mails, des formulaires, OCR des documents scannés ; recherche augmentée (RAG) sur votre documentation ; transcription audio avec Whisper.',
      },
      {
        title: 'Assistants et chatbots',
        description:
          'Un assistant dans votre produit, qui répond depuis vos données et sait dire quand il ne sait pas.',
      },
      {
        title: 'Hébergement et coûts',
        description:
          'Modèles locaux (Ollama) ou API hébergées, suivi de la consommation, mise en cache, choix du modèle par tâche pour tenir le budget.',
      },
    ],
    process: [
      {
        title: 'Atelier de cadrage',
        description:
          'Une demi-journée pour lister les cas d’usage, les classer par valeur et par risque, et en choisir un.',
      },
      {
        title: 'Prototype en conditions réelles',
        description:
          'Deux à trois semaines pour un premier flux qui tourne sur vos données, avec des mesures : temps gagné, taux d’erreur, coût par exécution.',
      },
      {
        title: 'Mise en production',
        description:
          'Droits, journalisation, supervision, gestion des erreurs, documentation. L’agent devient un composant de votre système comme un autre.',
      },
      {
        title: 'Transmission et formation',
        description:
          'Une formation à la mesure de l’équipe : elle sait relire les prompts, surveiller les coûts et faire évoluer le flux sans moi.',
      },
    ],
    deliverables: [
      'Un cas d’usage cadré avec ses indicateurs de succès.',
      'Un agent ou un flux en production, versionné, supervisé, documenté.',
      'Un tableau de bord des coûts et des erreurs.',
      'Une équipe formée à le faire vivre.',
    ],
    stack: [
      'Claude',
      'Mistral',
      'OpenRouter',
      'Ollama',
      'MCP',
      'n8n',
      'Whisper',
      'RAG',
      'OCR',
      'Python',
      'TypeScript',
      'Symfony',
      'PostgreSQL',
      'Docker',
    ],
    faq: [
      {
        question: 'Mes données doivent-elles sortir de l’entreprise ?',
        answer:
          'Pas nécessairement. Un modèle local avec Ollama tourne sur votre serveur et ne transmet rien. Quand une API hébergée est préférable, on choisit un fournisseur et un contrat compatibles avec vos obligations, et on limite ce qui lui est envoyé.',
      },
      {
        question: 'Combien coûte un agent en fonctionnement ?',
        answer:
          'Ça dépend du modèle et du volume : de quelques centimes à quelques euros par exécution. Le prototype mesure ce coût dès le départ, et le choix du modèle par tâche permet de le tenir.',
      },
      {
        question: 'Faut-il que mon application ait déjà une API ?',
        answer:
          'C’est plus simple, mais pas obligatoire. Si elle n’en a pas, l’exposer proprement est souvent la première étape, et elle sert ensuite bien au-delà de l’IA.',
      },
      {
        question: 'Et si le modèle se trompe ?',
        answer:
          'Il se trompera. Le flux est conçu pour ça : droits limités, validation humaine sur les actions sensibles, trace de chaque action pour pouvoir revenir en arrière, et mesure du taux d’erreur pour décider ce qu’on automatise.',
      },
    ],
    relatedPosts: [
      'faire-jouer-ses-tickets-par-un-agent',
      'suivre-sa-consommation-claude-code-sous-linux',
    ],
  },
  {
    slug: 'formation-ia',
    name: 'Formation IA',
    title: 'Formation IA à Lyon : agents, LLM et outils pour développeurs et équipes métier',
    description:
      'Formation IA à Lyon ou à distance : Claude Code en équipe, agents LLM et MCP, RAG, n8n, Whisper, Ollama. Intra-entreprise, d’une demi-journée à trois jours.',
    excerpt:
      'Former vos équipes ou vos stagiaires à l’IA appliquée : assistant de code, agents et MCP, RAG, n8n. Sur vos outils, à Lyon ou à distance.',
    icon: 'compass',
    illustration: 'ai-training',
    lead:
      'Des développeurs et des équipes métier qui repartent en sachant se servir de l’IA sur leur propre travail, pas seulement en ayant vu une démonstration.',
    context: [
      'Les outils d’IA sont entrés dans les équipes plus vite que la façon de s’en servir. Un assistant de code mal utilisé produit du code que personne ne relit ; un modèle de langage branché sans garde-fou sur une API fait ce qu’on ne lui a pas demandé. La formation que je propose part de ces usages concrets, pas d’une présentation générale de l’IA.',
      'J’enseigne ce que je pratique : chez Animalink, des agents n8n branchés sur l’API Symfony, de l’analyse documentaire avec Mistral, un chatbot produit ; sur mon temps libre, des outils publics comme ticket-runner, qui fait jouer un ticket Notion par Claude Code jusqu’à la pull request, ou Whisper Desk, une dictée vocale hors ligne. Les exercices viennent de là, et de vos propres outils.',
      'Le programme se compose à partir de modules, selon le public : des développeurs qui veulent intégrer un modèle dans leur code, ou des équipes métier qui veulent automatiser une tâche sans écrire d’application. J’interviens aussi pour le compte d’un organisme de formation, sur un module de son programme ou sur un module que nous construisons ensemble.',
    ],
    forWho: [
      'Une équipe de développement qui utilise déjà un assistant de code, chacun à sa manière, et veut des pratiques communes : contexte, relecture, sécurité.',
      'Une équipe technique qui doit brancher un modèle de langage sur son application : API, agents, outils MCP, recherche dans sa documentation.',
      'Une équipe métier qui veut automatiser une tâche répétitive avec n8n, ou transcrire et résumer ses réunions, sans attendre les développeurs.',
      'Un organisme de formation, dans la région lyonnaise ou à distance, qui cherche un intervenant développeur pour un module IA.',
    ],
    includes: [
      {
        title: 'Claude Code en équipe',
        description:
          'Utiliser un assistant de code au quotidien : lui donner le bon contexte (CLAUDE.md, conventions), découper une tâche, relire ce qu’il produit, fixer ce qu’il a le droit de faire.',
      },
      {
        title: 'Brancher un LLM sur une API',
        description:
          'Appeler un modèle depuis son code, lui donner des outils, construire un agent qui agit par vos API avec des droits limités, exposer ses outils par un serveur MCP.',
      },
      {
        title: 'RAG sur sa documentation',
        description:
          'Faire répondre un modèle depuis vos documents : découpage, indexation, recherche, citation des sources, et mesure de la qualité des réponses.',
      },
      {
        title: 'Automatisations n8n',
        description:
          'Construire un flux entre vos outils (CRM, messagerie, Notion) avec une étape de modèle de langage là où elle apporte quelque chose, et une validation humaine là où il le faut.',
      },
      {
        title: 'Transcription avec Whisper',
        description:
          'Transcrire réunions, entretiens ou dictées, en local ou par API, puis en tirer un compte rendu ou une liste d’actions.',
      },
      {
        title: 'IA locale avec Ollama',
        description:
          'Faire tourner un modèle sur un poste ou un serveur de l’entreprise quand la donnée ne doit pas sortir : choix du modèle, matériel nécessaire, limites.',
      },
    ],
    process: [
      {
        title: 'Un premier échange',
        description:
          'Une heure pour connaître le public, son niveau, ses outils et ce qu’il doit savoir faire à la fin. Gratuit et sans engagement.',
      },
      {
        title: 'Un programme écrit',
        description:
          'Les modules retenus, les objectifs, la durée (d’une demi-journée à trois jours) et le lieu : dans vos locaux, à Lyon et dans la région, ou à distance.',
      },
      {
        title: 'Des sessions pratiques',
        description:
          'Peu de diapositives, beaucoup d’exercices : sur vos outils et vos données quand c’est possible, sur des exemples préparés sinon.',
      },
      {
        title: 'Des supports qui restent',
        description:
          'Les supports, les exercices et leurs corrigés restent à l’équipe, pour refaire et aller plus loin après la session.',
      },
    ],
    deliverables: [
      'Un programme écrit, adapté au public et à ses outils.',
      'Les supports de la formation, remis aux participants.',
      'Des exercices sur vos propres outils, avec leurs corrigés.',
      'Les exemples de code et de flux réalisés pendant la session.',
    ],
    stack: [
      'Claude Code',
      'Claude',
      'Mistral',
      'OpenRouter',
      'MCP',
      'RAG',
      'n8n',
      'Whisper',
      'Ollama',
      'Python',
      'TypeScript',
    ],
    faq: [
      {
        question: 'Quelle durée prévoir ?',
        answer:
          'D’une demi-journée pour prendre en main un outil à trois jours pour un parcours complet, du premier appel à un modèle jusqu’à un agent branché sur une API. La durée est fixée au premier échange, selon le public et les objectifs.',
      },
      {
        question: 'Faut-il savoir programmer ?',
        answer:
          'Pas pour tous les modules. Les automatisations n8n, la transcription et l’usage d’un assistant s’adressent aussi aux équipes métier. Brancher un modèle sur une API, le RAG ou un serveur MCP demandent en revanche des bases de développement.',
      },
      {
        question: 'La formation se fait-elle sur place ou à distance ?',
        answer:
          'Les deux. En intra-entreprise, dans vos locaux à Lyon et dans la région, ou à distance pour une équipe répartie.',
      },
      {
        question: 'Intervenez-vous pour un organisme de formation ?',
        answer:
          'Oui, comme intervenant sur un module IA de votre programme, ou pour construire ce module avec vous. Le contenu, la durée et le format se calent au premier échange.',
      },
      {
        question: 'Les exercices peuvent-ils se faire sur nos données ?',
        answer:
          'Oui, c’est même préférable : on travaille sur des documents ou un jeu de données de test choisis avec vous. Si rien ne doit sortir de l’entreprise, les exercices se font avec un modèle local (Ollama).',
      },
    ],
    relatedPosts: [
      'faire-jouer-ses-tickets-par-un-agent',
      'suivre-sa-consommation-claude-code-sous-linux',
    ],
  },
]

/**
 * Les interventions plus courtes, sans page dédiée : elles vivent sur
 * `/services#interventions` et sur les cartes de l'accueil.
 */
export type Intervention = {
  id: string
  name: string
  excerpt: string
  icon: ServiceIcon
  /** Le service principal auquel elle se rattache. */
  service: Service['slug']
}

export const interventions: Array<Intervention> = [
  {
    id: 'api',
    name: 'API REST et architecture back-end',
    excerpt:
      'Concevoir ou refondre une API Symfony / API Platform : contrat JSON-LD, droits, performance, documentation.',
    icon: 'api',
    service: 'developpement-web',
  },
  {
    id: 'automatisation',
    name: 'Automatisation et agents',
    excerpt:
      'Relier vos outils avec n8n, ajouter un agent là où une tâche répétitive coûte du temps, exposer vos API à des modèles via MCP.',
    icon: 'workflow',
    service: 'integration-ia',
  },
  {
    id: 'conseil',
    name: 'Conseil technique et formation',
    excerpt:
      'Choix de stack, relecture d’architecture, accompagnement d’une équipe sur Symfony, React ou les agents LLM.',
    icon: 'compass',
    service: 'formation-ia',
  },
]

export function getService(slug: string): Service | undefined {
  return services.find((service) => service.slug === slug)
}

export function servicePath(slug: string): string {
  return `/services/${slug}`
}
