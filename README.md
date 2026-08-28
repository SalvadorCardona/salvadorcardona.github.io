# salvadorcardona.github.io

Portfolio et blog de Salvador Cardona.
En ligne : <https://salvadorcardona.github.io>

TanStack Start, entièrement prérendu au build et publié sur GitHub Pages. Pas de
serveur, pas de base de données, pas de CMS : tout le contenu est écrit en dur
dans le dépôt.

## Démarrer

```bash
npm install
npm run dev        # http://localhost:3000
```

| Commande            | Effet                                                      |
| ------------------- | ---------------------------------------------------------- |
| `npm run dev`       | Serveur de développement                                    |
| `npm run build`     | Build statique dans `dist/client` (prérendu + sitemap + 404) |
| `npm run serve`     | Sert `dist/client` comme le fera GitHub Pages                |
| `npm run typecheck` | Vérification TypeScript                                     |

Pour valider un build avant de pousser : `npm run build && npm run serve`.

## Modifier le contenu

Tout se passe dans `src/content/`.

- **`profile.ts`** — identité, liens, technologies, expériences, diplômes,
  projets. Les entrées contenant `À COMPLÉTER` ne s'affichent pas : elles
  servent de gabarit.
- **`posts.tsx`** — les articles du blog. Un article = une entrée du tableau
  `posts`. Le corps est du JSX, pas du Markdown.

### Ajouter un article

1. Copier une entrée existante dans `posts.tsx`.
2. Changer `slug`, `title`, `date` (format `AAAA-MM-JJ`), `excerpt`, `tags` et
   `readingTime`.
3. Écrire le `body` en JSX. Les styles de lecture viennent de
   `@tailwindcss/typography` : `<h2>`, `<p>`, `<ul>`, `<pre>` suffisent.

Rien d'autre à faire. L'article apparaît sur `/blog`, et le prérendu découvre
son URL en suivant les liens de l'index — aucune liste de routes à maintenir.

## Fonctionnement du build

`vite.config.ts` active le prérendu du plugin TanStack Start. Chaque route est
rendue une fois au build et écrite en HTML complet, puis reprise par le routeur
client une fois le bundle chargé.

Trois points sont propres à GitHub Pages :

- **`base: '/'`** — le dépôt s'appelle `salvadorcardona.github.io`, il est donc
  servi à la racine du domaine. Un dépôt de projet imposerait `/<repo>/` et la
  gestion du `basepath` dans le routeur, encore fragile côté Start.
- **`public/.nojekyll`** — sans ce fichier, Pages fait passer le site par
  Jekyll, qui ignore silencieusement tout chemin commençant par un underscore.
- **`404.html`** — Pages n'a pas de règle de réécriture. La route `/404` est
  prérendue puis déplacée à la racine par `scripts/postbuild.mjs`.

Le mode SPA de Start reste désactivé : activé, il remplace la page d'accueil par
une coquille vide et lui fait perdre son HTML.

`scripts/postbuild.mjs` échoue si une page attendue manque — le déploiement
s'arrête plutôt que de publier un site amputé.

## Déploiement

`.github/workflows/deploy.yml` construit et publie à chaque push sur `main`.
Source des Pages à régler une fois : **Settings → Pages → Source : GitHub
Actions**.

## Pile

React 19 · TanStack Start · TanStack Router · Vite · Tailwind CSS v4 ·
TypeScript
