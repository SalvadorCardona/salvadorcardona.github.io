/**
 * Les articles du blog, écrits en dur.
 *
 * Un article = une entrée de ce tableau. Le corps est du JSX : pas de parseur
 * Markdown, pas de fichiers à charger, pas d'appel réseau. Tout part dans le
 * bundle et est prérendu au build.
 *
 * Pour ajouter un article : copier une entrée, changer `slug`, écrire le
 * `body`. Le prérendu découvre l'URL tout seul (voir `vite.config.ts`).
 */

import type { ReactNode } from 'react'

export type Post = {
  slug: string
  title: string
  /** Format ISO `AAAA-MM-JJ`, utilisé pour le tri et la balise <time>. */
  date: string
  /** Résumé affiché sur la liste et dans les métadonnées SEO. */
  excerpt: string
  tags: Array<string>
  /** Durée de lecture indicative, en minutes. */
  readingTime: number
  body: ReactNode
}

export const posts: Array<Post> = [
  {
    slug: 'un-portfolio-tanstack-start-sur-github-pages',
    title: 'Un portfolio TanStack Start sur GitHub Pages',
    date: '2026-08-28',
    excerpt:
      'TanStack Start est un framework full-stack. GitHub Pages ne sert que des fichiers. Voilà comment les deux se rejoignent, sans serveur et sans compromis sur le référencement.',
    tags: ['TanStack Start', 'GitHub Pages', 'Prérendu'],
    readingTime: 6,
    body: (
      <>
        <p>
          TanStack Start est un framework full-stack : rendu côté serveur, server
          functions, routes API. GitHub Pages, lui, ne sait faire qu’une chose —
          servir des fichiers statiques depuis un CDN. À première vue, les deux
          ne devraient pas se rencontrer.
        </p>
        <p>
          Ils se rencontrent quand même, parce que Start sait figer son rendu au
          build. Le plugin Vite expose une option <code>prerender</code> qui
          parcourt les routes, exécute le rendu serveur une bonne fois pour
          toutes, et écrit un fichier HTML par URL. Ce n’est plus un serveur,
          c’est un dossier.
        </p>

        <h2>Le principe : figer le rendu au build</h2>
        <p>
          On active le prérendu dans <code>vite.config.ts</code>, et on laisse le
          crawler suivre les liens internes :
        </p>
        <pre>
          <code>{`tanstackStart({
  prerender: {
    enabled: true,
    crawlLinks: true,
    autoSubfolderIndex: true,
    failOnError: true,
  },
})`}</code>
        </pre>
        <p>
          <code>crawlLinks</code> extrait les <code>&lt;a href&gt;</code> du HTML
          généré et enfile les URL trouvées. Comme la page d’accueil pointe vers
          le blog, et que le blog liste tous les articles, une seule racine
          suffit à couvrir le site entier. Aucune liste de routes à maintenir à
          la main : ajouter un article suffit à le faire prérendre.
        </p>
        <p>
          <code>autoSubfolderIndex</code> écrit <code>/blog/index.html</code>{' '}
          plutôt que <code>/blog.html</code>. C’est exactement ce qu’attend un
          hébergeur statique pour résoudre <code>/blog</code> sans réécriture.
        </p>

        <h2>Le piège du chemin de base</h2>
        <p>
          C’est là que la plupart des tentatives se cassent. Un dépôt de projet
          sur GitHub Pages est servi depuis <code>/mon-repo/</code>, pas depuis
          la racine. Il faut alors accorder le <code>base</code> de Vite et le{' '}
          <code>basepath</code> du routeur — et même comme ça, les rapports de
          bugs sur le sujet s’accumulent : assets qui repartent à la racine,
          routes internes <code>__tsr/*</code> qui ignorent le préfixe.
        </p>
        <p>
          La solution n’est pas de se battre avec le préfixe. C’est de le
          supprimer : un dépôt nommé <code>pseudo.github.io</code> est servi à la
          racine du domaine. Le <code>base</code> reste <code>/</code>, le
          routeur n’a rien à savoir, et une classe entière de bugs disparaît
          avant d’exister.
        </p>

        <h2>Les deux fichiers qu’on oublie toujours</h2>
        <p>
          <strong>
            <code>.nojekyll</code>
          </strong>{' '}
          — sans lui, GitHub Pages fait passer le site par Jekyll, qui ignore
          silencieusement tout fichier ou dossier commençant par un underscore.
          Or Start en produit : <code>_shell.html</code> en mode SPA, et le
          dossier d’assets client selon la configuration. Quand ça arrive, on
          récupère du HTML nu — aucun style, aucun JS — et rien dans les logs
          pour l’expliquer. Un fichier vide à la racine règle l’affaire, et coûte
          zéro.
        </p>
        <p>
          <strong>
            <code>404.html</code>
          </strong>{' '}
          — Pages n’a pas de règle de réécriture. Toute URL inconnue tombe sur ce
          fichier. En y copiant le shell applicatif, le routeur client reprend la
          main et affiche la bonne page ou une vraie 404 maison, au lieu de la
          page d’erreur de GitHub.
        </p>

        <h2>Ce qu’on perd, et pourquoi ça ne fait rien</h2>
        <p>
          Un site figé n’a plus de server functions, plus de routes API, plus de
          formulaire qui poste vers son propre backend. Pour un portfolio, ce
          n’est pas une contrainte : le contenu est écrit en dur, il change quand
          on commit, et un formulaire de contact se remplace très bien par un
          lien <code>mailto:</code>.
        </p>
        <p>
          Ce qu’on garde, c’est l’essentiel : du HTML complet servi au premier
          octet — donc indexable, donc rapide —, puis une navigation client
          instantanée une fois le bundle chargé. Hébergement gratuit, TLS inclus,
          aucun serveur à surveiller.
        </p>
      </>
    ),
  },
  {
    slug: 'json-ld-le-contrat-que-le-front-attendait',
    title: 'JSON-LD : le contrat que le front attendait',
    date: '2026-07-15',
    excerpt:
      'Une API qui décrit ses propres ressources permet d’écrire des composants qui ne connaissent aucune ressource en particulier. Retour sur plusieurs années à construire des fronts génériques.',
    tags: ['JSON-LD', 'Hydra', 'React', 'API Platform'],
    readingTime: 7,
    body: (
      <>
        <p>
          La plupart des fronts d’application de gestion sont un copier-coller
          géant. Une liste de clients, une liste de factures, une liste de
          produits : trois écrans qui font la même chose, écrits trois fois,
          maintenus trois fois, cassés trois fois.
        </p>
        <p>
          On s’en accommode parce que le JSON classique ne dit rien de lui-même.{' '}
          <code>{`{ "id": 12, "name": "Dupont" }`}</code> : impossible de savoir
          quel type c’est, quels champs existent vraiment, quelles opérations
          sont autorisées. Le front doit tout redire en dur — donc tout redire à
          chaque écran.
        </p>

        <h2>Ce que change une ressource qui se présente</h2>
        <p>
          JSON-LD ajoute le contexte manquant. Chaque ressource porte son
          identifiant global et son type :
        </p>
        <pre>
          <code>{`{
  "@context": "/api/contexts/Client",
  "@id": "/api/clients/12",
  "@type": "Client",
  "name": "Dupont",
  "invoices": [{ "@id": "/api/invoices/88" }]
}`}</code>
        </pre>
        <p>
          Trois lignes, et tout devient possible. <code>@id</code> est une URL :
          c’est à la fois la clé de cache et l’adresse de rechargement. Une
          relation n’est plus un entier opaque, c’est un lien qu’on peut suivre.
          Et <code>@type</code> permet au front de demander « comment j’affiche
          ça ? » sans savoir à l’avance ce que « ça » est.
        </p>
        <p>
          Hydra, la couche au-dessus, ajoute les opérations disponibles et la
          pagination. L’API ne renvoie plus seulement des données : elle renvoie
          ce qu’on a le droit d’en faire.
        </p>

        <h2>Un registre plutôt que des conditions</h2>
        <p>
          À partir de là, la brique centrale du front devient un registre : on
          associe des métadonnées d’affichage à un type d’IRI, et les composants
          interrogent ce registre au lieu de tester le type à la main. Un
          composant de liste ne connaît plus aucune ressource ; il connaît la
          forme d’une collection Hydra.
        </p>
        <p>
          Le même raisonnement s’applique aux formulaires. Le schéma décrit les
          champs, leurs types, ce qui est requis ; le formulaire se construit à
          partir de ça. On n’écrit plus des formulaires, on écrit les quelques
          contrôleurs de champs qui manquent.
        </p>

        <h2>Où la magie s’arrête</h2>
        <p>
          Une couche générique est excellente pour les 80 % d’écrans qui se
          ressemblent — et devient une prison pour les 20 % restants. Le tableau
          de bord métier, l’écran avec sa règle de gestion tordue, la vue qui
          agrège cinq ressources : ceux-là s’écrivent à la main, et c’est très
          bien.
        </p>
        <p>
          La règle qui a le mieux tenu chez moi : la couche générique doit
          toujours pouvoir être court-circuitée. Le jour où il faut la contourner
          par une option de configuration, c’est qu’il fallait écrire l’écran à
          la main.
        </p>
      </>
    ),
  },
  {
    slug: 'faire-jouer-ses-tickets-par-un-agent',
    title: 'Faire jouer ses tickets par un agent',
    date: '2026-06-02',
    excerpt:
      'Un ticket Notion, une session d’agent, une pull request. Ce que j’ai appris en industrialisant la boucle — et ce qui n’a pas marché.',
    tags: ['Agents LLM', 'Automatisation', 'Claude Code'],
    readingTime: 5,
    body: (
      <>
        <p>
          L’idée de départ tient en une phrase : un ticket entre dans la colonne
          « à faire », un agent le prend, une pull request en sort. Pas de chat,
          pas de copier-coller de contexte, pas d’humain qui joue les
          intermédiaires entre l’outil de suivi et l’éditeur.
        </p>

        <h2>La boucle</h2>
        <ol>
          <li>Lire le ticket et son contexte projet depuis Notion.</li>
          <li>Ouvrir un espace de travail isolé et jetable.</li>
          <li>Lancer une session d’agent avec ce contexte, et rien d’autre.</li>
          <li>Ouvrir une pull request, remettre le lien sur le ticket.</li>
        </ol>
        <p>
          Le point important est le troisième : <strong>une session par
          ticket</strong>. La tentation est de garder une session longue qui
          enchaîne le travail — elle finit toujours par mélanger deux sujets et
          par produire un diff que personne ne veut relire.
        </p>

        <h2>Ce qui n’a pas marché</h2>
        <p>
          <strong>Les tickets vagues.</strong> Un agent ne pose pas de question
          au bon moment ; il comble. Un ticket qui dit « améliorer la page
          profil » produit un diff plausible et inutile. Le travail de cadrage
          n’a pas disparu, il s’est déplacé : il est maintenant entièrement dans
          le ticket.
        </p>
        <p>
          <strong>L’absence de garde-fou automatique.</strong> Tant que la
          vérification reposait sur ma relecture, la boucle n’allait pas plus
          vite qu’avant. Ce qui a changé les choses, c’est de faire tourner
          lint + types + tests à l’intérieur de la session, avant l’ouverture de
          la PR — l’agent corrige ses propres erreurs pendant qu’il a encore le
          contexte en tête.
        </p>
        <p>
          <strong>Faire confiance au récit.</strong> Un agent qui dit « c’est
          fait et testé » se trompe parfois. La seule chose qui compte, c’est la
          sortie de commande dans les logs de session.
        </p>

        <h2>Ce que ça a vraiment changé</h2>
        <p>
          Pas la vitesse d’écriture du code — la vitesse de démarrage. Les tâches
          qui traînaient parce qu’elles demandaient trente minutes de remise en
          contexte pour dix minutes de travail effectif partent maintenant toutes
          seules. Le reste du temps est passé là où il sert : à décider quoi
          construire.
        </p>
      </>
    ),
  },
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

export function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })
}
