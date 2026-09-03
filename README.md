# salvadorcardona.github.io

Portfolio et blog de Salvador Cardona.
En ligne : <https://cardona.digital>

TanStack Start, entièrement prérendu au build et publié sur GitHub Pages. Pas de
serveur, pas de base de données interrogée en ligne : les articles sont rédigés
dans Notion, puis figés dans le dépôt par un script lancé à la main. Le site
publié ne dépend de rien d'autre que de ses fichiers.

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
| `npm run posts:sync`| Régénère les articles depuis la database Notion              |
| `npm run post:image`| Génère avec OpenRouter les illustrations d'articles manquantes |

Pour valider un build avant de pousser : `npm run build && npm run serve`.

## Modifier le contenu

Les articles s'écrivent dans Notion (voir ci-dessous). Le reste vit dans
`src/content/`.

- **`profile.ts`** — identité, liens, technologies, expériences, diplômes,
  projets. Les entrées contenant `À COMPLÉTER` ne s'affichent pas : elles
  servent de gabarit.
- **`services.ts`** — les prestations (`/services/<slug>`) et les interventions
  ponctuelles. Chaque prestation porte son titre, sa description SEO, son
  contenu section par section et sa FAQ ; le gabarit
  `src/components/ServicePage.tsx` en fait la page et les données structurées.
  Pour en ajouter une : une entrée ici, une route d'une ligne dans
  `src/routes/services/`, et son chemin dans `scripts/postbuild.mjs`.
- **`posts/`** — les articles du blog, un fichier par article. **Ces fichiers
  sont générés** : ils portent un en-tête qui le rappelle, et `npm run
  posts:sync` les écrase. Seul `post.ts` (le type `Post`, `getCover`,
  `formatDate`) s'écrit à la main.
- **`covers.json`** — l'illustration de chaque article : une entrée par `slug`,
  avec son texte alternatif et, si l'image a été générée, le prompt qui a servi.

### Écrire un article

Les articles vivent dans la database Notion
[Blog Salvador Cardona](https://salvadorcardona.notion.site/Blog-Salvador-Cardona-3cf451680af4803f83fdd0cf0d824fa6),
qui fait foi. Le dépôt n'en est que le reflet, et le site reste entièrement
statique : rien n'appelle Notion au build ni au runtime.

1. Créer une page dans la database et remplir ses propriétés :

   | Propriété     | Rôle                                                        |
   | ------------- | ----------------------------------------------------------- |
   | `Title`       | Le titre affiché                                            |
   | `slug`        | L'URL `/blog/<slug>` et le nom du fichier. Ne plus le changer une fois publié |
   | `Date`        | Date de publication, pour le tri et la balise `<time>`      |
   | `excerpt`     | Le résumé sur `/blog` et dans les métadonnées SEO           |
   | `tags`        | Les étiquettes affichées et filtrables                      |
   | `readingTime` | Durée de lecture indicative, en minutes                     |
   | `status`      | `Publié` pour partir sur le site, `Brouillon` sinon         |
   | `coverAlt`    | Ce que montre la couverture, pour les lecteurs d'écran      |

2. Écrire le corps dans la page. Sont pris en charge : paragraphes, titres,
   listes à puces et numérotées, citations, blocs de code, traits de
   séparation et images légendées, avec gras, italique, barré, code inline et
   liens. Un bloc non pris en charge est signalé et ignoré par la
   synchronisation, pas silencieusement perdu.
3. Poser une couverture sur la page Notion (menu « Add cover »), en 1024 × 576.
4. Synchroniser :

   ```bash
   export NOTION_TOKEN=ntn_...   # https://www.notion.com/my-integrations
   npm run posts:sync
   ```

L'article apparaît sur `/blog`, et le prérendu découvre son URL en suivant les
liens de cette page — aucune route à déclarer.

Le jeton vient d'une intégration Notion partagée avec la database (sur la page
de la database : menu `···` → « Connections » → l'intégration). Il n'est
utilisé que par ce script, jamais par le site.

#### `mePublishBlog`, les étapes 4 à 6 en une commande

`scripts/publish-blog.sh` définit une fonction shell qui enchaîne le tout. À
ajouter une fois à son `~/.bashrc` :

```bash
source ~/salvadorcardona.github.io/scripts/publish-blog.sh
```

Le jeton ne va pas dans le `.bashrc` — un dotfile finit souvent versionné — mais
dans un fichier lu par la fonction :

```bash
mkdir -p ~/.config/cardona-blog
echo 'export NOTION_TOKEN=ntn_...' > ~/.config/cardona-blog/env
chmod 600 ~/.config/cardona-blog/env
```

Ensuite, depuis n'importe quel répertoire :

```bash
mePublishBlog                         # message de commit par défaut
mePublishBlog "Publie « Mon titre »"  # message choisi
mePublishBlog --yes                   # sans demander confirmation
```

Elle repart de `main` à jour, synchronise, montre ce qui a changé, lance
`typecheck` et `build`, demande confirmation, puis commite et pousse — ce qui
déclenche le déploiement.

Elle s'arrête sans rien publier si le dépôt a des modifications en cours (le
`git add -A` final les emporterait), si le jeton manque, ou si la vérification
échoue. Si Notion n'a rien de neuf, elle le dit et ne commite pas. Le dépôt est
attendu dans `~/salvadorcardona.github.io` ; ailleurs, poser
`export BLOG_REPO=/chemin/vers/le/depot`.

Ce que la synchronisation fait, en plus d'écrire les articles :

- elle rapatrie les images dans `public/blog/` — les URL de fichiers Notion
  sont signées et expirent au bout de quelques heures, les garder casserait le
  site le lendemain ;
- elle lit les dimensions réelles de chaque image et les inscrit dans le
  `<img>`, pour que la page ne saute pas au chargement ;
- elle pose une plaque sombre derrière les images à canal alpha, sans quoi une
  capture claire sur fond transparent devient illisible ;
- elle supprime du dépôt les articles qui ne sont plus en `Publié`.

### Son illustration

Le plus simple est de poser une couverture sur la page Notion : `posts:sync` la
rapatrie dans `public/blog/` et remplit `covers.json` tout seul.

Reste la voie alternative, pour fabriquer une illustration quand on n'en a pas :
la générer avec OpenRouter à partir d'un prompt. Elle est versionnée dans
`public/blog/` de la même façon, et le site reste statique — aucun appel au
build ni au runtime, le script se lance à la main.

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
