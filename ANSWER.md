# Repositionnement agence — compte rendu d'audit

Ticket : « Portfolio — Repositionner cardona.digital en site d'agence de
développement ». Le site est servi sur `hermez.dev` depuis le 16/10/2026 et la
marque est désormais **Hermez** (elle remplace « l'agence Cardona ») : les
textes parlent donc de l'agence Hermez.

## Ce qui a été audité

Toutes les pages rendues par le build (accueil, services et leurs quatre
pages, blog et articles, contact, notre équipe, abonnement mensuel, site
vitrine Lyon), plus les anciennes adresses (`/rendez-vous`, `/projets`,
`/agence`, `/qui-suis-je`) :

- crawl des liens internes du serveur construit : 73 adresses, toutes en 200
  (83 après les ajouts) ; redirections 301 vérifiées par le postbuild ;
- liens externes : voir « Failles laissées » ;
- `<title>`, description, canonique, `og:image`, un seul `h1`, `lang="fr"` sur
  chaque page ;
- console du navigateur sur l'accueil, le contact et un article : aucune
  erreur ;
- accessibilité de l'accueil : aucune image sans `alt`, aucun lien ou bouton
  sans nom accessible, pas de débordement horizontal ;
- relecture des textes : voix, promesses, compétences annoncées.

## Failles trouvées et corrigées

| Faille | Correction |
| --- | --- |
| « Premier appel offert », « une heure, gratuit » sur l'accueil, les pages service, `/services`, la page vitrine Lyon, l'abonnement mensuel, le contact et les e-mails Brevo — contraire à la contrainte du ticket | Plus aucune durée ni gratuité promise : « un premier échange, sans engagement » ; la case du formulaire devient « appel découverte (visio) » |
| Textes au « je » freelance : quatre pages service (contexte, FAQ, process), `/services` (« Comment je travaille »), blog (« Ce que j’apprends »), accueil (« Ils m’ont fait confiance », encart « Derrière l’agence ») | Réécrits à la voix de l'agence (« nous », « l’agence Hermez ») |
| Méta descriptions « Développeur web freelance » (`/services/developpement-web`) et « Lead dev freelance » (`/services`) ; bloc « Un lead dev IA freelance » sur l'accueil | Réécrites en « Agence de développement… » |
| Encart des pages service signé « Salvador Cardona, développeur web full-stack indépendant » | « L’agence Hermez, à Lyon » |
| Vue présenté dans l'offre (« Ou Vue et Angular si c’est déjà votre stack », FAQ « livré des applications en Vue, Nuxt… ») | Retiré ; la FAQ pose Symfony / API Platform comme expertise principale. Ni Java ni Vue ne sont annoncés |
| Titres des articles signés « — Salvador Cardona » au lieu de l'agence | Signés « — Agence Hermez » ; l'auteur reste dans le JSON-LD `BlogPosting` |
| Aucune page mentions légales ni politique de confidentialité, alors que le formulaire collecte des données personnelles | `/mentions-legales` et `/confidentialite` (formulaire, Brevo, Hostinger, Cloudflare Turnstile, Umami sans cookie, durée, droits, CNIL), liées en pied de page et depuis le formulaire, au sitemap et vérifiées par le postbuild |
| Méta description de `/site-internet-abonnement-mensuel` à 210 caractères (tronquée par Google) | Ramenée sous 160 |
| Titre de `/notre-equipe` doublé (« …l’agence Hermez à Lyon — Agence Hermez ») | Nouveau titre « À propos : l’agence Hermez et son équipe, à Lyon » |

## Améliorations de repositionnement

- **Références / études de cas** : nouvelle page `/references` (au menu, au
  pied de page, au sitemap) et section « Références » sur l'accueil (trois
  cas). Cinq études problème → solution → résultat écrites à partir des
  expériences Notion : Bedrock Streaming (plateforme de **TF1** et **M6**),
  Animalink, Greenweez, Jacquet Metal Service, Wizaplace. Aucun chiffre
  inventé ; chaque cas dit s'il s'agit d'une mission du lead dev en renfort de
  l'équipe du client. Les logos des grands comptes (EDF, Carrefour, OVHcloud,
  TF1, M6…) sont repris en tête de page.
- **Services** : deux interventions ajoutées sur `/services` —
  « DevOps et Docker » et « Facturation électronique » — à côté des quatre
  prestations existantes (développement web Symfony / API Platform / React,
  audit, intégration IA / RAG / LLM, formation IA).
- **Méthode** : déjà présente (accueil : appel, maquette, mise en ligne,
  suite ; `/services` : comprendre, périmètre écrit, livrer, transmettre) ;
  seuls les textes ont été corrigés.
- **Appels à l'action** : déjà présents sur chaque page vers `/contact` et
  l'appel découverte (`/contact?appel=1`, où redirige `/rendez-vous`).
- **À propos** : `/notre-equipe` devient la page « À propos » de l'agence :
  positionnement complet, engagements, équipe, liens vers services et
  références.

Synchro Notion → GitHub Actions et déploiement Dokploy non touchés ; aucun
fichier généré (`posts/`, `experiences.json`) modifié.

## Failles laissées, ou ce qui reste à décider

1. **opoil.app est en 404** (ainsi que `le-bon-pas.opoil.app` et
   `opoil.app/etablissement/le-bon-pas-lyon`) : trois des six cartes du hero
   pointent vers des sites qui ne répondent pas. C'est un incident du projet
   Opoil, hors de ce dépôt : relancer le déploiement Opoil, ou retirer ces
   cartes de `works` (`agency.ts`).
2. **Mentions légales incomplètes** : forme juridique, numéro SIREN/SIRET,
   adresse du siège (et numéro de TVA si assujetti) ne sont nulle part dans le
   dépôt ; ils sont obligatoires pour un professionnel (LCEN, art. 6-III). À
   fournir pour compléter `src/content/legal.ts`.
3. **EDF, Carrefour, OVHcloud** : aucun de ces trois comptes n'apparaît dans
   les expériences Notion. Leurs logos restent, mais pas d'étude de cas faute
   de faits : ajouter ces missions dans Notion (ou me donner le contexte) pour
   les écrire.
4. **Facturation électronique** : l'intervention est décrite comme du travail
   d'intégration (Factur-X, raccordement à une plateforme agréée), sans
   référence client. À confirmer, ou à transformer en page service complète
   (illustration et image de partage à produire).
5. **`BREVO_LIST_ID`** : s'il est renseigné en production, chaque prospect est
   ajouté à une liste Brevo, ce que contredit la mention « ni utilisées pour de
   la prospection » du formulaire. À vérifier dans Dokploy.
6. **Articles du blog** écrits au « je » : ils viennent de Notion et ne
   s'éditent pas ici. À reprendre dans Notion si la voix d'agence doit s'y
   appliquer aussi.
7. **Champs inutilisés de `profile.ts`** (`role`, `pitch`, `about` au « je »,
   « indépendant ») : plus affichés nulle part ; laissés en l'état, à nettoyer
   dans un ticket dédié.
8. **Responsive mobile** : la fenêtre Chrome n'a pas pu être redimensionnée
   pendant la session ; les nouvelles sections reprennent les grilles
   responsives existantes (une colonne sous `lg`), mais le rendu téléphone
   reste à regarder.
