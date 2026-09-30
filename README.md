![salvadorcardona.github.io](https://raw.githubusercontent.com/SalvadorCardona/brand-assets/main/projects/salvadorcardona.github.io/banner.png)

# salvadorcardona.github.io

Portfolio et blog de Salvador Cardona.
En ligne : <https://cardona.digital>

TanStack Start rendu côté serveur par Nitro, dans un conteneur Docker déployé
sur Dokploy. Pas de base de données : les articles sont rédigés dans Notion,
puis figés dans le dépôt par un script lancé à la main. Le serveur ne sert qu'à
rendre les pages et à envoyer les e-mails du formulaire de contact (API Brevo).

Avant toute modification, lire [`AGENTS.md`](AGENTS.md) : les règles du projet —
contenu en dur, rien de sensible dans le dépôt ni dans l'image, configuration
par variables d'environnement — et les commandes à lancer pour vérifier son travail.

## Démarrer

```bash
npm install
npm run dev        # http://localhost:3000
```

| Commande            | Effet                                                      |
| ------------------- | ---------------------------------------------------------- |
| `npm run dev`       | Serveur de développement                                    |
| `npm run build`     | Build serveur dans `.output/`, puis contrôle de chaque page |
| `npm run serve`     | Lance le serveur construit, comme dans le conteneur         |
| `npm run typecheck` | Vérification TypeScript                                    |
| `npm run posts:publish` | Publie le blog : Notion, puis commit sur `main`, via GitHub Actions |
| `npm run posts:sync`| Régénère les articles depuis Notion, en local (aperçu)       |
| `npm run post:image`| Génère avec OpenRouter les illustrations d'articles manquantes |
| `npm run experiences:sync` | Régénère les expériences depuis Notion, en local (aperçu) |

Pour valider un build avant de pousser : `npm run build && npm run serve`.

## Modifier le contenu

Les articles et les expériences s'écrivent dans Notion (voir ci-dessous). Le
reste vit dans `src/content/`.

- **`profile.ts`** — identité, liens, technologies, diplômes, projets. Les
  entrées contenant `À COMPLÉTER` ne s'affichent pas : elles servent de
  gabarit. Un projet porte son dépôt (`url`) et, s'ils existent, son site en
  ligne (`site`) et sa documentation (`docs`) : la section projets de
  `/qui-suis-je` les liste tous. L'ancienne page `/projets` y renvoie.
- **`services.ts`** — les prestations (`/services/<slug>`) et les interventions
  ponctuelles. Chaque prestation porte son titre, sa description SEO, son
  contenu section par section et sa FAQ ; le gabarit
  `src/components/ServicePage.tsx` en fait la page et les données structurées.
  Pour en ajouter une : une entrée ici, une route d'une ligne dans
  `src/routes/services/`, et son chemin dans `scripts/postbuild.mjs`.
- **`agency.ts`** — l'agence Cardona, qui fait l'accueil (`/`) : la
  signature, les métiers, les chiffres clés, les deux abonnements mensuels, ce
  qu'ils comprennent, les engagements et la FAQ. Les prix y sont
  écrits une seule fois et alimentent aussi le JSON-LD de la page.
- **`posts/`** — les articles du blog, un fichier par article. **Ces fichiers
  sont générés** : ils portent un en-tête qui le rappelle, et `npm run
  posts:sync` les écrase. Seul `post.ts` (le type `Post`, `getCover`,
  `formatDate`) s'écrit à la main.
- **`covers.json`** — l'illustration de chaque article : une entrée par `slug`,
  avec son texte alternatif et, si l'image a été générée, le prompt qui a servi.
- **`experiences.json`** — les expériences de la section `/#experiences`.
  **Ce fichier est généré** par `npm run experiences:sync` : pas d'en-tête
  « ne pas éditer » possible dans du JSON, mais la règle est la même que pour
  les articles. Le type `Experience`, le tri, la durée calculée et le repli
  sur les initiales s'écrivent à la main dans `experiences.ts`, qui l'importe.

### Écrire un article

Les articles vivent dans la database Notion
[Blog Salvador Cardona](https://salvadorcardona.notion.site/Blog-Salvador-Cardona-3cf451680af4803f83fdd0cf0d824fa6),
qui fait foi. Le dépôt n'en est que le reflet, et le contenu reste figé dans
le dépôt : rien n'appelle Notion au build ni au runtime.

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
4. Publier :

   ```bash
   npm run posts:publish
   ```

L'article apparaît sur `/blog`, et le prérendu découvre son URL en suivant les
liens de cette page — aucune route à déclarer.

#### Ce que fait `posts:publish`

Rien en local : la commande déclenche le workflow
[`publish-blog.yml`](.github/workflows/publish-blog.yml), qui synchronise depuis
Notion, vérifie (`typecheck`, `build`), commite sur `main` et lance le
déploiement. Si Notion n'a rien de neuf, il le dit et ne commite pas ; si la
vérification échoue, rien n'est publié.

```bash
npm run posts:publish                          # message de commit par défaut
npm run posts:publish -- "Publie « Mon titre »"
npm run posts:publish -- --no-watch            # sans attendre la fin du run
```

Elle suit le run jusqu'au bout et se termine en erreur s'il échoue. Il faut
donc [GitHub CLI](https://cli.github.com) authentifié une fois (`gh auth
login`) — mais pas le jeton Notion, qui ne quitte plus GitHub. Le workflow se
lance aussi à la main depuis l'onglet **Actions → Publier le blog**.

Le jeton vient d'une intégration Notion partagée avec la database (sur la page
de la database : menu `···` → « Connections » → l'intégration), et se pose une
fois dans **Settings → Secrets and variables → Actions**, sous le nom
`NOTION_TOKEN` :

```bash
gh secret set NOTION_TOKEN   # colle le jeton, sans le laisser dans l'historique
```

Il n'est utilisé que par la synchronisation, jamais par le site.

Pour relire un article avant publication, la synchronisation tourne aussi en
local — elle demande alors le jeton dans l'environnement, et écrit les mêmes
fichiers :

```bash
NOTION_TOKEN=ntn_... npm run posts:sync
npm run dev
```

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
`public/blog/` de la même façon, et rien n'est appelé au
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

### Ajouter ou modifier une expérience

Les expériences vivent dans la database Notion **Experience Salvador
Cardona**, qui fait foi. Le dépôt n'en est que le reflet
(`src/content/experiences.json`), et le contenu reste figé dans le dépôt :
rien n'appelle Notion au build ni au runtime, seule la synchronisation le
fait, à la main ou depuis le workflow planifié.

1. Créer une page dans la database et remplir ses propriétés :

   | Propriété    | Rôle                                                        |
   | ------------ | ------------------------------------------------------------ |
   | `Name`       | Le titre interne de la page (non affiché tel quel)           |
   | `entreprise` | Le nom de l'entreprise                                       |
   | `poste`      | L'intitulé du poste                                          |
   | `start date` | Début de la mission, pour le tri et la durée calculée        |
   | `end date`   | Fin de la mission — laisser vide pour une mission en cours (« aujourd'hui ») |
   | `lieu`       | La ville affichée                                             |
   | `technologie`| Les tags de technologies affichés                            |
   | `logo`       | Le logo de l'entreprise (fichier). Vide → repli sur les initiales |

2. Écrire le corps de la page : un résumé en paragraphe(s), puis des titres de
   section — `⌨️ BACKEND`, `🖥️ FRONTEND`, `📶 INFRASTRUCTURE`, `🤖 IA`,
   `🧭 CONSEIL & MÉTHODE` — chacun suivi de ses puces. L'émoji est optionnel et
   n'est pas repris à l'affichage ; le reste du titre l'est, ce qui permet de
   préciser la stack entre parenthèses ou après un tiret. Un bloc non pris en
   charge (autre que paragraphe, titre ou liste à puces) est signalé et ignoré
   par la synchronisation, pas silencieusement perdu.
3. Synchroniser et publier :

   ```bash
   npm run experiences:sync   # en local, avec NOTION_TOKEN dans l'environnement
   ```

   En local ça ne fait qu'écrire les fichiers, à commiter et pousser comme
   n'importe quel changement. Pour publier sans les manipuler à la main,
   lancer le workflow
   [`publish-experiences.yml`](.github/workflows/publish-experiences.yml)
   depuis l'onglet **Actions → Publier les expériences** : il synchronise,
   vérifie (`typecheck`, `build`), commite sur `main` et lance le déploiement
   — le même enchaînement que `posts:publish` pour le blog. Il se relance
   aussi tout seul chaque jour, pour rattraper une modification faite dans
   Notion sans y repenser.

Le jeton `NOTION_TOKEN` est le même que pour le blog : une intégration Notion
partagée avec la database (sur la page de la database : menu `···` →
« Connections » → l'intégration), posée une fois dans **Settings → Secrets
and variables → Actions**. Il n'est utilisé que par la synchronisation,
jamais par le site — et jamais commité : si l'appel à Notion échoue, la
synchronisation s'arrête avant d'écrire quoi que ce soit, plutôt que de
publier une page à moitié remplie.

Ce que la synchronisation fait, en plus d'écrire `experiences.json` :

- elle rapatrie les logos dans `public/experiences/` — comme les images
  d'articles, les URL de fichiers Notion sont signées et expirent en environ
  une heure, les garder telles quelles casserait le site après coup ;
- elle supprime du dépôt les logos qui ne sont plus référencés par aucune
  expérience.

## Fonctionnement du build

`vite.config.ts` ajoute le plugin Nitro (preset `node-server`) à TanStack
Start. `vite build` écrit `.output/` : `server/index.mjs`, qui rend chaque page
à la requête et exécute les server functions, et `public/`, les fichiers
statiques. Rien n'est prérendu : le sitemap est une route
(`src/routes/sitemap[.]xml.ts`) construite depuis le contenu.

`scripts/postbuild.mjs` démarre ensuite le serveur construit et demande chaque
page attendue et chaque URL du sitemap : le build échoue plutôt que de livrer
un site amputé.

Le mode SPA de Start reste désactivé : activé, il remplace la page d'accueil par
une coquille vide et lui fait perdre son HTML.

## Déploiement

Le site tourne sur Dokploy, construit depuis le `Dockerfile` à chaque push sur
`main` ; `publish-blog.yml` et `publish-experiences.yml` n'ont donc qu'à
commiter. Les réglages Dokploy, les variables d'environnement, le domaine et
le proxy des sous-sites GitHub Pages (`/whisper-desk/`, `/ticket-runner/`…)
sont décrits pas à pas dans [`DEPLOY.md`](DEPLOY.md).

En local, avec Docker :

```bash
cp .env.example .env    # facultatif : Brevo, Turnstile
docker compose up --build
```

## Pile

React 19 · TanStack Start · TanStack Router · Vite · Tailwind CSS v4 ·
TypeScript
