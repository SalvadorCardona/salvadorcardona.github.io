# Notes pour agents

Portfolio statique : TanStack Start prérendu au build, publié sur GitHub Pages.

## Règles du projet

- **Site statique, sans exception.** Pas de server function, pas de route API,
  pas d'appel réseau au runtime. Tout doit survivre à un `npm run build` suivi
  d'un simple serveur de fichiers.
- **Contenu en dur.** Le contenu vit dans `src/content/` (`profile.ts` pour le
  CV, `posts.tsx` pour les articles, `covers.json` pour leurs illustrations).
  Ne pas introduire de CMS ni de chargement de fichiers Markdown.
- **Un article = une illustration.** Tout article ajouté à `posts.tsx` reçoit
  son entrée dans `covers.json` (`alt` + `prompt`), puis son image via
  `npm run post:image -- <slug>` : elle est générée par OpenRouter, écrite dans
  `public/blog/` et versionnée. La génération se fait à la main, jamais au
  build — voir « Son illustration » dans le README.
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
npm run typecheck
npm run build      # échoue si une page attendue manque
```

Le build doit annoncer 7 pages prérendues et écrire `dist/client/404.html`. Il
échoue aussi si une illustration déclarée dans `covers.json` n'a pas suivi.
Pour inspecter le rendu réel : `npm run serve`.
