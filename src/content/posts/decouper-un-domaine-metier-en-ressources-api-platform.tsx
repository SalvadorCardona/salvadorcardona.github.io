/**
 * Généré par `npm run posts:sync` depuis la database Notion « Blog Salvador Cardona ».
 * Ne pas éditer à la main : la prochaine synchronisation écrase ce fichier.
 */

import type { Post } from './post'

export const post: Post = {
  slug: 'decouper-un-domaine-metier-en-ressources-api-platform',
  title: 'Découper un domaine métier en ressources API Platform',
  date: '2026-09-04',
  excerpt:
    'Praticien, créneau, rendez-vous, acte, produit : sur une marketplace de rendez-vous vétérinaires, la découpe en ressources décide de tout ce qui vient après. Quatre séparations qui ont tenu, et la règle qui les explique.',
  tags: ['API Platform', 'Hydra', 'JSON-LD'],
  readingTime: 8,
  body: (
    <>
      <p>
        Sur une marketplace de rendez-vous, tout le monde voit les mêmes
        objets : un praticien, un créneau, un rendez-vous, un acte, un
        produit. La difficulté n'est pas de les nommer, elle est de décider
        lesquels sont la même chose.
      </p>
      <p>
        Sur Animalink — réservation chez les professionnels de l'animal, avec
        panier et paiement après la consultation — je m'en suis rendu compte à
        mes dépens. Voici les quatre découpes qui ont tenu, et la règle qui
        les explique toutes.
      </p>
      <h2>
        Le catalogue n'est pas l'agenda
      </h2>
      <p>
        La première tentation est de faire du rendez-vous une simple
        occurrence de la prestation. Le pro déclare « consultation, 30
        minutes, 45 € », le client réserve, et le rendez-vous se contente de
        pointer vers la prestation.
      </p>
      <p>
        Ça marche jusqu'au premier changement de tarif. Le pro passe la
        consultation à 50 €, et tous les rendez-vous déjà pris — y compris
        ceux d'hier — changent de prix. La facture d'un client se met à
        dépendre de ce que le pro fera la semaine prochaine.
      </p>
      <p>
        Il y a donc deux ressources, et elles n'ont pas le même rythme. <code>{`CompanyService`}</code>{' '}
        est le catalogue : durée, tarif, options, horaires d'ouverture, tout
        ce que le pro modifie quand il veut. <code>{`CalendarEvent`}</code>{' '}
        est ce qui a été réservé, et il fige à la création ce dont il a
        besoin.
      </p>
      <pre>
        <code>{`#[ApiProperty(description: 'Prix de base du service (snapshot à la création).')]
public ?int \$price = null,

#[ApiProperty(description: 'Prix total calculé, options comprises.', writable: false)]
#[CurrentUserPriceCalculated(collection: 'participants', userProperty: 'user')]
public ?int \$priceCalculated = null,`}</code>
      </pre>
      <p>
        Le principe qui en sort : une ressource qui vit dans le temps ne
        pointe pas vers une donnée qui bouge, elle en prend une copie. La même
        règle se retrouve un cran plus loin, dans le panier. Chaque ligne
        stocke son propre prix, sa TVA et son libellé, et ne va chercher le
        nom du produit que si le libellé est vide. Un produit renommé ne
        réécrit pas les factures passées.
      </p>
      <h2>
        La même entité, plusieurs ressources
      </h2>
      <p>
        Un rendez-vous est lu par trois personnes qui n'ont pas les mêmes
        droits : le propriétaire de l'animal, le professionnel, et le visiteur
        anonyme qui tombe sur la page publique d'une clinique.
      </p>
      <p>
        Le réflexe est d'écrire une ressource et de trier ensuite, dans un
        voter ou un normalizer. API Platform permet mieux : plusieurs <code>{`#[ApiResource]`}</code>{' '}
        sur la même classe.
      </p>
      <pre>
        <code>{`#[ApiResource(
    operations: [new Get(), new GetCollection(...), new Patch()],
    normalizationContext: ['groups' => ['calendar-event:read'], 'openapi_definition_name' => 'read'],
)]
#[ApiResource(
    routePrefix: '/public',
    operations: [
        new GetCollection(
            order: ['startDate' => 'ASC'],
            stateOptions: new Options(handleLinks: PublicFeaturedCalendarEventLinksHandler::class),
        ),
    ],
    normalizationContext: ['groups' => ['calendar-event:read'], 'openapi_definition_name' => 'publicRead'],
)]
class CalendarEvent`}</code>
      </pre>
      <p>
        La collection publique ne partage rien avec la privée sauf la table :
        préfixe d'URL, opérations et contexte de sérialisation lui
        appartiennent, et son <code>{`LinksHandler`}</code> force <code>{`featured
        = true`}</code> côté serveur. Le visiteur ne peut pas demander autre
        chose que ce qui est publié, parce que ce n'est pas un paramètre qu'on
        lui laisse.
      </p>
      <p>
        Le même mécanisme sépare l'API du propriétaire (<code>{`routePrefix:
        '/user'`}</code>) de celle du pro (<code>{`/pro`}</code>). Une
        ressource n'est pas une table : c'est un point de vue sur une table.
      </p>
      <h2>
        Les verbes qui ne sont pas du CRUD
      </h2>
      <p>
        Réserver, rejoindre un rendez-vous de groupe, valider, annuler,
        clôturer : ce ne sont pas des écritures de champ, ce sont des
        transitions.
      </p>
      <p>
        Écrites comme un <code>{`PATCH`}</code> sur <code>{`state`}</code>,
        elles laissent le client décider de la transition, et la règle métier
        finit éparpillée entre un validateur, un listener et le front. Je les
        déclare donc comme des opérations nommées, avec leur propre DTO
        d'entrée et leur processor.
      </p>
      <pre>
        <code>{`new Post(
    uriTemplate: '/create_stay',
    routePrefix: '/user',
    security: "is_granted('ROLE_USER')",
    input: CreateStayByUserCommand::class,
    name: 'create_stay',
    processor: CreateStayByUserCommandHandler::class,
),`}</code>
      </pre>
      <p>
        Ce qui entre n'est plus une ressource partielle mais une commande :{' '}
        <code>{`CreateStayByUserCommand`}</code> porte exactement les champs
        du formulaire de séjour, pas les vingt-cinq propriétés d'un
        rendez-vous. Le handler contient la règle et se teste seul. Et comme
        l'opération est déclarée, elle apparaît dans la documentation Hydra :
        le front sait qu'elle existe sans qu'on le lui dise.
      </p>
      <p>
        La contrepartie est réelle — ces opérations se multiplient, et une
        entité finit avec dix <code>{`POST`}</code> déclarés. La question à se
        poser avant d'en ajouter une : est-ce que ça fait passer une ressource
        d'un état à un autre selon une règle qu'un client ne doit pas pouvoir
        contourner ? Si oui, c'est une opération. Sinon, c'est un <code>{`PATCH`}</code>.
      </p>
      <h2>
        Quand une relation devient une ressource
      </h2>
      <p>
        Un animal fréquente plusieurs cliniques. Chacune tient sa propre note
        sur lui, et n'a rien à savoir de ce que les autres écrivent.
      </p>
      <p>
        Un <code>{`ManyToMany`}</code> ne peut pas porter ça. Dès que la
        jointure a une donnée à elle, elle devient une ressource : ici <code>{`AnimalCompany`}</code>,
        qui porte le lien et la note privée du pro. Même chose pour la
        participation à un rendez-vous, qui a son propre état — donc sa propre
        ressource, pas une colonne.
      </p>
      <p>
        Le cas le plus instructif est le client. Un pro crée des fiches pour
        des gens qui n'ont pas de compte, et certains s'inscrivent plus tard.
        Deux identités qui se rejoignent, sans qu'on sache quand.
      </p>
      <pre>
        <code>{`#[ORM\\Column(length: 180, nullable: true)]
public ?string \$email = null {
    get => \$this->user->email ?? \$this->email;
},

#[ORM\\ManyToOne]
public ?User \$user = null,`}</code>
      </pre>
      <p>
        <code>{`CompanyCustomer`}</code> garde ses propres champs, et les
        hooks de propriété de PHP 8.4 laissent le compte utilisateur prendre
        le dessus dès qu'il existe. Le pro continue de voir sa fiche ; le jour
        où le client s'inscrit, l'email exposé devient celui du compte, sans
        migration ni écran de fusion. Les deux restent des ressources
        distinctes — elles n'ont ni le même auteur, ni le même cycle de vie.
      </p>
      <h2>
        La règle qui reste
      </h2>
      <p>
        Après coup, ces quatre découpes disent la même chose. Je ne sépare pas
        deux ressources parce que ce sont deux concepts métier : le métier en
        voit partout, et une API qui suit le vocabulaire des réunions finit
        avec quarante ressources dont personne ne se sert.
      </p>
      <p>
        Je les sépare quand elles répondent différemment à trois questions :
        qui l'écrit, qui le lit, et à quel rythme ça change. Le catalogue et
        l'agenda ne changent pas au même rythme. Le rendez-vous public et le
        rendez-vous privé n'ont pas les mêmes lecteurs. La fiche client et le
        compte utilisateur n'ont pas le même auteur.
      </p>
      <p>
        Trois questions, et la moitié des discussions de modélisation tombent.
        Ce qui reste difficile, ce sont les ressources qui répondent pareil
        aux trois et qu'on garde séparées par habitude. Celles-là, je les
        fusionne.
      </p>
    </>
  ),
}
