# Notes pour agents

Portfolio statique : TanStack Start prérendu au build, publié sur GitHub Pages.

## Règles du projet

- **Site statique, sans exception.** Pas de server function, pas de route API,
  pas d'appel réseau au runtime. Tout doit survivre à un `npm run build` suivi
  d'un simple serveur de fichiers.
- **Les articles viennent de Notion.** La database « Blog Salvador Cardona »
  est la source de vérité. `npm run posts:sync` la lit et régénère
  `src/content/posts/` ; l'appel réseau a lieu là, à la main, jamais au build
  ni au runtime. Le contenu reste versionné dans Git.
- **On publie avec `npm run posts:publish`.** La commande ne fait que
  déclencher le workflow `publish-blog.yml`, qui synchronise, vérifie, commite
  sur `main` et lance le déploiement. Le jeton Notion vit dans le secret de
  dépôt `NOTION_TOKEN`, pas sur le poste ; en local, `posts:sync` reste bon
  pour relire un article avant de publier.
- **Ne pas éditer `src/content/posts/<slug>.tsx` ni `index.ts`** : ils portent
  un en-tête « généré », et la synchronisation suivante écrase toute
  modification. Pour corriger un article, corriger la page Notion. Seul
  `posts/post.ts` (le type `Post`, `getCover`, `formatDate`) est écrit à la
  main — un article importe son type de là, jamais de l'index, sinon le cycle
  est là.
- **Les expériences viennent aussi de Notion.** La database « Experience
  Salvador Cardona » est la source de vérité. `npm run experiences:sync` la
  lit et régénère `src/content/experiences.json` ; l'appel réseau a lieu là, à
  la main ou depuis `publish-experiences.yml`, jamais au build ni au runtime.
  Le workflow se relance à la demande et tous les jours (`workflow_dispatch` +
  `schedule`), le jeton Notion venant du même secret `NOTION_TOKEN`.
- **Ne pas éditer `src/content/experiences.json` à la main** : la prochaine
  synchronisation l'écrase (un JSON ne peut pas porter d'en-tête « généré », ce
  qui est noté en commentaire dans `experiences.ts`, qui l'importe). Pour
  corriger une expérience, corriger la page Notion. Seul `experiences.ts` (le
  type `Experience`, le tri, la durée calculée, le repli sur les initiales)
  est écrit à la main.
- **Le reste du contenu est en dur** dans `src/content/` : `profile.ts` pour le
  CV (hors expériences), `services.ts` pour les prestations, `agency.ts` pour
  les abonnements de l'agence Cardona, `covers.json` pour les illustrations. Pas d'autre CMS, pas de chargement de fichiers Markdown.
- **Une page service = une entrée dans `services.ts` + une route d'une ligne**
  dans `src/routes/services/<slug>.tsx`, qui rend le gabarit commun
  `components/ServicePage.tsx`. Ajouter le chemin à `REQUIRED_PAGES` dans
  `scripts/postbuild.mjs`. Le contenu et la FAQ sont repris tels quels dans le
  JSON-LD (`Service`, `FAQPage`, `BreadcrumbList`) : ne pas dupliquer, éditer
  la donnée.
- **Un article = une illustration.** Deux sources possibles : la couverture de
  la page Notion, rapatriée par `posts:sync` ; ou, à défaut, une image générée
  par `npm run post:image -- <slug>` depuis le `prompt` de `covers.json`. Dans
  les deux cas l'image atterrit dans `public/blog/` et est versionnée — voir
  « Son illustration » dans le README.
- **Le logo d'une expérience est optionnel.** Rapatrié par `experiences:sync`
  dans `public/experiences/` quand la propriété `logo` est renseignée dans
  Notion ; sinon la carte affiche les initiales de l'entreprise
  (`companyInitials` dans `experiences.ts`). Les URL de fichiers Notion
  expirent en environ une heure : ne jamais les garder telles quelles.
- **`base` reste `/`.** Le dépôt est un *user site* (`<pseudo>.github.io`),
  servi à la racine. Ne pas ajouter de `basepath`.
- **Ne pas activer `spa.enabled`** dans `vite.config.ts` : cela remplace la page
  d'accueil par une coquille vide. Le repli 404 passe par la route `/404` et
  `scripts/postbuild.mjs`.
- **Ne pas supprimer `public/.nojekyll`.**
- **`public/banner.png` est l'image de partage par défaut** (`og:image` et
  `twitter:image`, dans `src/lib/seo.ts`), et la bannière en tête du README. Le
  visuel vient du dépôt `SalvadorCardona/brand-assets` : le refaire là-bas, puis
  recopier le fichier ici — le site ne charge aucune image distante.
- **Les visuels des projets viennent du même dépôt `brand-assets`.** Chaque
  entrée de `projects` (`profile.ts`) porte un champ `brand` : le nom du dossier
  `projects/<dépôt>/` là-bas, et de `public/projects/<dépôt>/` ici. On y recopie
  `icon.png` redimensionnée en 128 px et `banner.png` convertie en `banner.jpg`
  de 1200 px de large ; sans ces deux fichiers, la carte du projet affiche une
  image cassée.
- **Ne pas supprimer `public/CNAME`** ni le désynchroniser de `SITE_URL`
  (`src/lib/seo.ts`) : il porte le domaine personnalisé `cardona.digital`.

## Vérification avant de conclure

```bash
npm run posts:sync         # si le contenu Notion a changé ; demande NOTION_TOKEN
npm run experiences:sync   # idem, pour les expériences ; demande NOTION_TOKEN
npm run typecheck
npm run build        # échoue si une page attendue manque
```

Le build doit annoncer les pages fixes (`/`, `/services` et ses trois pages
service, `/agence`, `/projets`, `/blog`, `/contact`, `/404`) plus un article par
`src/content/posts/<slug>.tsx`, et écrire `dist/client/404.html`. Il échoue si une page attendue manque, ou si une
illustration déclarée dans `covers.json` ou un logo déclaré dans
`experiences.json` n'a pas suivi.
Pour inspecter le rendu réel : `npm run serve`.
