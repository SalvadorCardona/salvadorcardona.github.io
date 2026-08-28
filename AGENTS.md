# Notes pour agents

Portfolio statique : TanStack Start prérendu au build, publié sur GitHub Pages.

## Règles du projet

- **Site statique, sans exception.** Pas de server function, pas de route API,
  pas d'appel réseau au runtime. Tout doit survivre à un `npm run build` suivi
  d'un simple serveur de fichiers.
- **Contenu en dur.** Le contenu vit dans `src/content/` (`profile.ts` pour le
  CV, `posts.tsx` pour les articles). Ne pas introduire de CMS ni de chargement
  de fichiers Markdown.
- **`base` reste `/`.** Le dépôt est un *user site* (`<pseudo>.github.io`),
  servi à la racine. Ne pas ajouter de `basepath`.
- **Ne pas activer `spa.enabled`** dans `vite.config.ts` : cela remplace la page
  d'accueil par une coquille vide. Le repli 404 passe par la route `/404` et
  `scripts/postbuild.mjs`.
- **Ne pas supprimer `public/.nojekyll`.**

## Vérification avant de conclure

```bash
npm run typecheck
npm run build      # échoue si une page attendue manque
```

Le build doit annoncer 7 pages prérendues et écrire `dist/client/404.html`.
Pour inspecter le rendu réel : `npm run serve`.
