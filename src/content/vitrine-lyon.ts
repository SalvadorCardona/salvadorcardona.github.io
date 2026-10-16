/**
 * La page locale `/creation-site-vitrine-lyon` : l'offre Vitrine de l'agence
 * (`agency.ts`), racontée pour la requête « création site vitrine Lyon ».
 *
 * Le prix, ce qui est compris et le délai viennent de l'offre `vitrine` : ici
 * ne vit que ce qui est propre à la page. Tout est repris tel quel dans le
 * JSON-LD de la route (`Service`, `FAQPage`) : éditer la donnée, pas la route.
 */

export const vitrineLyon = {
  path: '/creation-site-vitrine-lyon',
  /** Balise <title> et H1 : porte la requête visée. */
  title: 'Création de site vitrine à Lyon, dès 30 € HT par mois',
  /** Balise <meta name="description">, moins de 160 caractères. */
  description:
    'Création de site vitrine à Lyon et dans la métropole : conception, hébergement et mises à jour compris, 30 € HT par mois, en ligne sous deux semaines.',
  lead:
    'Artisans, commerçants, indépendants : l’agence Hermez crée votre site vitrine à Lyon et dans la métropole, le met en ligne et le tient à jour. Un abonnement de 30 € HT par mois, sans frais de départ ni engagement.',
  /** Les métiers et les situations, un élément par ligne. */
  forWho: [
    'Artisans lyonnais — plombier, électricien, coiffeur, photographe — que leurs clients cherchent sur Google avant d’appeler.',
    'Commerçants de quartier, de la Croix-Rousse à la Part-Dieu, qui veulent afficher horaires, adresse et carte à jour.',
    'Indépendants et professions libérales de la métropole : consultant, thérapeute, avocat, coach, éducateur canin.',
    'Jeunes entreprises lyonnaises qui n’ont pas encore de site, ou dont le site n’a plus été touché depuis des années.',
  ],
  /** Les communes citées sur la page : la métropole, pas seulement Lyon. */
  cities: [
    'Lyon',
    'Villeurbanne',
    'Caluire-et-Cuire',
    'Vénissieux',
    'Bron',
    'Écully',
    'Tassin-la-Demi-Lune',
    'Oullins',
    'Saint-Priest',
    'Rillieux-la-Pape',
  ],
  /** Les captures de `works` (`agency.ts`) montrées en exemples, par `image`. */
  workImages: ['le-bon-pas', 'opoil-accueil'],
  faq: [
    {
      question: 'Combien coûte la création d’un site vitrine à Lyon ?',
      answer:
        '30 € HT par mois, sans frais de mise en route : la conception et la rédaction du site, le nom de domaine, l’hébergement, les mises à jour et les modifications de contenu sont compris. Sur trois ans, cela revient à 1 080 € HT, sans autre facture.',
    },
    {
      question: 'En combien de temps mon site est-il en ligne ?',
      answer:
        'Sous deux semaines après réception de vos contenus : textes, photos, logo, horaires. Si vous n’en avez pas, on vous aide à les rédiger lors du premier appel.',
    },
    {
      question: 'Vous déplacez-vous ?',
      answer:
        'Le premier échange, d’une heure et gratuit, peut se tenir à Lyon ou dans la métropole si vous préférez nous rencontrer, ou par visioconférence. Le reste du projet se déroule à distance : maquette, mise en ligne et modifications se font par mail, sans que vous ayez à vous déplacer.',
    },
    {
      question: 'Et si je suis à Villeurbanne, à Caluire ou ailleurs dans la métropole ?',
      answer:
        'C’est le même abonnement et le même prix, que vous soyez à Lyon, à Villeurbanne, à Caluire-et-Cuire, à Vénissieux, à Bron ou à Écully. Le site est travaillé pour le référencement local : votre commune et votre métier apparaissent là où vos clients les cherchent.',
    },
    {
      question: 'Que se passe-t-il si j’arrête ?',
      answer:
        'Vous arrêtez quand vous voulez, sans durée minimale. Vous repartez avec votre nom de domaine, vos contenus et vos données, et on vous aide à transférer l’hébergement où vous voulez.',
    },
    {
      question: 'Puis-je modifier mon site après la mise en ligne ?',
      answer:
        'Oui, c’est compris dans l’abonnement : textes, photos, tarifs et horaires sont modifiés à la demande, par simple mail.',
    },
  ],
}
