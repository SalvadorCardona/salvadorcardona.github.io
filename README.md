# salvadorcardona.github.io

Portfolio et blog de Salvador Cardona.
En ligne : <https://cardona.digital>

TanStack Start, entièrement prérendu au build et publié sur GitHub Pages. Pas de
serveur, pas de base de données, pas de CMS : tout le contenu est écrit en dur
dans le dépôt.

Avant toute modification, lire [`AGENTS.md`](AGENTS.md) : les règles du projet —
site statique sans exception, contenu en dur, réglages GitHub Pages à ne pas
casser — et les commandes à lancer pour vérifier son travail.

## Démarrer

```bash
npm install
npm run dev        # http://localhost:3000
```

| Commande            | Effet                                                      |
| ------------------- | ---------------------------------------------------------- |
| `npm run dev`       | Serveur de développement                                    |
| `npm run build`     | Build statique dans `dist/client` (prérendu + sitemap + 404) |
| `npm run serve`     | Sert `dist/client` comme le fera GitHub Pages               |
| `npm run typecheck` | Vérification TypeScript                                    |
| `npm run post:image`| Génère avec OpenRouter les illustrations d'articles manquantes |

Pour valider un build avant de pousser : `npm run build && npm run serve`.

## Modifier le contenu

Tout se passe dans `src/content/`.

- **`profile.ts`** — identité, liens, technologies, expériences, diplômes,
  projets. Les entrées contenant `À COMPLÉTER` ne s'affichent pas : elles
  servent de gabarit.
- **`posts/`** — les articles du blog, un fichier par article. Le corps est du
  JSX, pas du Markdown. À côté d'eux, `index.ts` liste les articles publiés et
  `post.ts` porte le type `Post` et les utilitaires communs.
- **`covers.json`** — l'illustration de chaque article : une entrée par `slug`,
  avec son texte alternatif et le prompt qui a servi à la générer.

### Ajouter un article

1. Copier un fichier existant de `posts/` sous le nom du nouveau slug, par
   exemple `posts/mon-article.tsx`.
2. Changer `slug` (il doit valoir le nom du fichier), `title`, `date` (format
   `AAAA-MM-JJ`), `excerpt`, `tags` et `readingTime`.
3. Écrire le `body` en JSX. Les styles de lecture viennent de
   `@tailwindcss/typography` : `<h2>`, `<p>`, `<ul>`, `<pre>` suffisent.
4. Ajouter l'import et l'entrée correspondante dans `posts/index.ts`. L'ordre
   du tableau est libre : l'affichage trie par date.
5. Ajouter son illustration (voir ci-dessous).

L'article apparaît sur `/blog`, et le prérendu découvre son URL en suivant les
liens de cette page — aucune route à déclarer, seulement l'entrée dans
`posts/index.ts`.

### Son illustration

Chaque article a une image, générée une fois par OpenRouter et versionnée dans
`public/blog/`. Le site reste statique : aucun appel n'est fait au build ni au
runtime, le script se lance à la main.

1. Ajouter une entrée dans `src/content/covers.json`, avec la même clé que le
   `slug` de l'article :

   ```json
   "mon-article": {
     "alt": "Ce que montre l'image, pour les lecteurs d'écran.",
     "prompt": "A stream of cascading document pages freezing into a grid"
   }
   ```

   Le prompt décrit seulement le *sujet* : le style commun à toutes les
   couvertures — aplats géométriques, ardoise et bleu ciel, sans texte — est
   ajouté par le script. Il s'écrit en anglais, mieux suivi par les modèles
   d'image.

2. Générer :

   ```bash
   export OPENROUTER_API_KEY=sk-or-...   # https://openrouter.ai/keys
   npm run post:image                    # toutes les images manquantes
   npm run post:image -- mon-article     # un seul article
   npm run post:image -- mon-article --force   # refaire une image existante
   ```

Le script écrit `public/blog/<slug>.<ext>` et note le nom du fichier dans
`covers.json` : c'est ce champ `file` qui fait apparaître l'image sur `/blog`,
en tête de l'article et dans les cartes de partage. Tant qu'il est absent,
l'article s'affiche simplement sans illustration.

Le modèle par défaut est `black-forest-labs/flux.2-flex` (~0,05 $ l'image), à
changer avec `OPENROUTER_IMAGE_MODEL`.

## Fonctionnement du build

`vite.config.ts` active le prérendu du plugin TanStack Start. Chaque route est
rendue une fois au build et écrite en HTML complet, puis reprise par le routeur
client une fois le bundle chargé.

Quatre points sont propres à GitHub Pages :

- **`base: '/'`** — le dépôt s'appelle `salvadorcardona.github.io`, il est donc
  servi à la racine du domaine. Un dépôt de projet imposerait `/<repo>/` et la
  gestion du `basepath` dans le routeur, encore fragile côté Start.
- **`public/CNAME`** — déclare le domaine personnalisé `cardona.digital`. Il
  part avec le build et garde le domaine inscrit dans le dépôt plutôt que
  seulement dans les réglages GitHub.
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

### Domaine

Le site est servi sur `cardona.digital`, dont le DNS est géré chez Hostinger.
Trois réglages, faits une seule fois :

1. **Settings → Pages → Custom domain : `cardona.digital`**, puis **Enforce
   HTTPS** une fois le certificat émis (quelques minutes après la propagation).
2. **DNS Hostinger — apex** : quatre enregistrements `A` sur `@` vers
   `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   (les serveurs Pages), et un `CNAME` `www` vers `salvadorcardona.github.io`.
3. **Ne pas toucher aux autres enregistrements** : `trader.cardona.digital`
   (Trader IA) a son propre enregistrement et reste inchangé.

C'est le réglage **Settings → Pages** qui fait foi ; `public/CNAME` doit rester
aligné dessus, comme `SITE_URL` dans `src/lib/seo.ts`.

## Pile

React 19 · TanStack Start · TanStack Router · Vite · Tailwind CSS v4 ·
TypeScript
