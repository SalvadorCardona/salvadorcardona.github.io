/**
 * Généré par `npm run posts:sync` depuis la database Notion « Blog Salvador Cardona ».
 * Ne pas éditer à la main : la prochaine synchronisation écrase ce fichier.
 */

import type { Post } from './post'

export const post: Post = {
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
      <h2>
        Ce que change une ressource qui se présente
      </h2>
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
        Trois lignes, et tout devient possible. <code>{`@id`}</code> est une
        URL : c’est à la fois la clé de cache et l’adresse de rechargement.
        Une relation n’est plus un entier opaque, c’est un lien qu’on peut
        suivre. Et <code>{`@type`}</code> permet au front de demander «
        comment j’affiche ça ? » sans savoir à l’avance ce que « ça » est.
      </p>
      <p>
        Hydra, la couche au-dessus, ajoute les opérations disponibles et la
        pagination. L’API ne renvoie plus seulement des données : elle renvoie
        ce qu’on a le droit d’en faire.
      </p>
      <h2>
        Un registre plutôt que des conditions
      </h2>
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
      <h2>
        Où la magie s’arrête
      </h2>
      <p>
        Une couche générique est excellente pour les 80 % d’écrans qui se
        ressemblent — et devient une prison pour les 20 % restants. Le tableau
        de bord métier, l’écran avec sa règle de gestion tordue, la vue qui
        agrège cinq ressources : ceux-là s’écrivent à la main, et c’est très
        bien.
      </p>
      <p>
        La règle qui a le mieux tenu chez moi : la couche générique doit
        toujours pouvoir être court-circuitée. Le jour où il faut la
        contourner par une option de configuration, c’est qu’il fallait écrire
        l’écran à la main.
      </p>
    </>
  ),
}
