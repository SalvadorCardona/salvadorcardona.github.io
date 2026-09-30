# CLAUDE.md

Ce fichier complète [`AGENTS.md`](AGENTS.md), qui porte les règles du projet
(rendu serveur, articles depuis Notion, contenu généré, variables
d'environnement). Le lire d'abord : ce document ne les répète pas.

## Le projet

Site de l'agence Cardona (portfolio et blog de Salvador Cardona), publié sur
`cardona.digital` par Dokploy, dans un conteneur Docker. Les pages sont rendues
côté serveur par Nitro ; le serveur envoie aussi les e-mails du formulaire de
contact par l'API transactionnelle Brevo. Réglages de production : [`DEPLOY.md`](DEPLOY.md).

## Stack

- **TanStack Start** (React 19) + **Vite 8**, rendu serveur par **Nitro**
  (preset `node-server`, version bêta épinglée).
- **TypeScript** en mode strict (`tsconfig.json` : `strict`, `noUnusedLocals`,
  `noUnusedParameters`).
- **Tailwind CSS 4** (`@tailwindcss/vite`).
- **Node 22** (version utilisée en CI), **npm** (`package-lock.json` fait foi
  — pas de pnpm ni yarn malgré le bloc `pnpm` résiduel du `package.json`).
- Pas de framework de test, pas de linter configuré : ne pas en inventer, ne
  pas ajouter de script `test` ou `lint` sans que ce soit demandé.

## Commandes

```bash
npm install           # installation
npm run dev            # serveur de dev, http://localhost:3000
npm run build           # vite build && node scripts/postbuild.mjs (.output/)
npm run serve           # lance le serveur construit
docker compose up --build  # l'image de production, en local
npm run typecheck        # tsc --noEmit
npm run generate-routes   # régénère src/routeTree.gen.ts (tsr generate)
npm run posts:sync        # rapatrie les articles depuis Notion
npm run posts:publish      # déclenche le workflow publish-blog.yml
```

`generate-routes` est à relancer après l'ajout ou le retrait d'une route dans
`src/routes/` ; `routeTree.gen.ts` est lui-même un fichier généré, ne pas
l'éditer à la main.

## Arborescence utile

```
src/
  routes/        fichiers = routes (TanStack Router, routage par fichiers)
  routes/blog/    liste + page d'article ($slug.tsx)
  routes/services/ une route par prestation, un gabarit commun
  components/    composants partagés (ServicePage, SiteHeader, SiteFooter…)
  content/       contenu en dur : profile.ts, services.ts, covers.json
  content/posts/  articles générés depuis Notion (voir AGENTS.md)
  lib/seo.ts     constantes SEO (SITE_URL, JSON-LD, images de partage)
  lib/contact.ts formulaire de contact : validation partagée, server functions
scripts/         scripts Node lancés à la main (sync, publish, images, postbuild)
public/          statique servi tel quel (favicons, banner.png, blog/)
deploy/traefik/  proxy Traefik des sous-sites GitHub Pages
Dockerfile, compose.yaml, .env.example   image et variables d'environnement
```

## Conventions de code

- Import interne via l'alias `#/*` (ou `@/*`, équivalent) plutôt que des
  chemins relatifs profonds, par ex. `#/content/profile`.
- Une page service suit toujours le même schéma : entrée dans `services.ts` +
  route d'une ligne qui rend `ServicePage` (détail dans `AGENTS.md`).
- Les articles importent le type `Post` et les helpers depuis
  `content/posts/post.ts`, jamais depuis `content/posts/index.ts`.
- Pas de composant ni de fichier ajouté « au cas où » : un seul consommateur
  suffit à justifier une fonction, pas une abstraction générique.

## Conventions de commit

- Messages en français, à l'impératif, résumant l'intention plutôt que le
  détail technique (ex. « Ajoute la page Projets qui renvoie vers tous les
  dépôts »).
- Le préfixe `type(scope): …` (ex. `docs(profile): …`) apparaît sur certains
  commits ponctuels, mais n'est pas systématique — ne pas l'imposer partout.

## Pièges connus

- `src/content/posts/<slug>.tsx` et `index.ts` sont générés : toute
  modification manuelle est écrasée par le prochain `posts:sync` (voir
  AGENTS.md pour la procédure correcte).
- `npm run build` échoue volontairement si une page ne rend pas en 200 sur le
  serveur construit ou si une illustration déclarée dans `covers.json` est
  absente : un échec de build est souvent un contenu incomplet, pas un bug de
  build.
- `process.env` ne se lit que dans le `handler` d'une server function : ailleurs,
  le code part aussi dans le bundle client, où la variable n'existe pas.
- Le bloc `pnpm.onlyBuiltDependencies` dans `package.json` est un résidu :
  l'installation du projet se fait avec `npm`.
