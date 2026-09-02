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
- **Ne pas éditer `src/content/posts/<slug>.tsx` ni `index.ts`** : ils portent
  un en-tête « généré », et la synchronisation suivante écrase toute
  modification. Pour corriger un article, corriger la page Notion. Seul
  `posts/post.ts` (le type `Post`, `getCover`, `formatDate`) est écrit à la
  main — un article importe son type de là, jamais de l'index, sinon le cycle
  est là.
- **Le reste du contenu est en dur** dans `src/content/` : `profile.ts` pour le
  CV, `covers.json` pour les illustrations. Pas d'autre CMS, pas de chargement
  de fichiers Markdown.
- **Un article = une illustration.** Deux sources possibles : la couverture de
  la page Notion, rapatriée par `posts:sync` ; ou, à défaut, une image générée
  par `npm run post:image -- <slug>` depuis le `prompt` de `covers.json`. Dans
  les deux cas l'image atterrit dans `public/blog/` et est versionnée — voir
  « Son illustration » dans le README.
- **`base` reste `/`.** Le dépôt est un *user site* (`<pseudo>.github.io`),
  servi à la racine. Ne pas ajouter de `basepath`.
- **Ne pas activer `spa.enabled`** dans `vite.config.ts` : cela remplace la page
  d'accueil par une coquille vide. Le repli 404 passe par la route `/404` et
  `scripts/postbuild.mjs`.
- **Ne pas supprimer `public/.nojekyll`.**
- **Ne pas supprimer `public/CNAME`** ni le désynchroniser de `SITE_URL`
  (`src/lib/seo.ts`) : il porte le domaine personnalisé `cardona.digital`.

## Vérification avant de conclure

```bash
npm run posts:sync   # si le contenu Notion a changé ; demande NOTION_TOKEN
npm run typecheck
npm run build        # échoue si une page attendue manque
```

Le build doit annoncer les quatre pages fixes (`/`, `/blog`, `/contact`, `/404`)
plus un article par `src/content/posts/<slug>.tsx`, et écrire
`dist/client/404.html`. Il échoue si une page attendue manque, ou si une
illustration déclarée dans `covers.json` n'a pas suivi.
Pour inspecter le rendu réel : `npm run serve`.
