# Notes pour agents

Site de l'agence Hermez : TanStack Start rendu côté serveur par Nitro, dans un
conteneur Docker déployé sur Dokploy (voir `DEPLOY.md`).

## Règles du projet

- **Le serveur ne fait que rendre et relayer.** Les pages sont rendues à la
  requête (SSR) ; les seules server functions sont celles du formulaire de
  contact (`src/lib/contact.ts`, qui envoie les e-mails par l'API Brevo, demande
  d'appel découverte comprise). Pas de base de données, pas d'appel à
  Notion au runtime. Toute valeur de configuration passe par une variable
  d'environnement lue dans un `handler` de server function, jamais figée dans
  le code ni dans l'image : la liste est dans `.env.example`, à tenir à jour.
- **Une valeur secrète ne quitte jamais le serveur.** `BREVO_API_KEY` et
  `TURNSTILE_SECRET` restent dans les `handler` ; seule la clé publique
  Turnstile est renvoyée au navigateur. Toute valeur saisie dans le formulaire
  passe par `escapeHtml` avant d'entrer dans un e-mail.
- **Les articles viennent de Notion.** La database « Blog Salvador Cardona »
  est la source de vérité. `npm run posts:sync` la lit et régénère
  `src/content/posts/` ; l'appel réseau a lieu là, à la main, jamais au build
  ni au runtime. Le contenu reste versionné dans Git.
- **On publie avec `npm run posts:publish`.** La commande ne fait que
  déclencher le workflow `publish-blog.yml`, qui synchronise, vérifie et
  commite sur `main` ; Dokploy redéploie sur ce push. Le jeton Notion vit dans le secret de
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
  les abonnements de l'agence Hermez, `team.ts` pour les membres de l'équipe (`/notre-equipe`, la page « À propos »),
  `flagships.ts` pour les trois projets phares de l'accueil (versions et dates relevées sur GitHub, à remettre à jour après une release ; rien d'inventé), `references.ts` pour les études de cas (`/references`, écrites à la main
  depuis les expériences Notion : aucun fait qui n'y figure), `legal.ts` pour
  les mentions légales et la politique de confidentialité, `covers.json` pour les illustrations. Pas d'autre CMS, pas de chargement de fichiers Markdown.
- **Une page service = une entrée dans `services.ts` + une route d'une ligne**
  dans `src/routes/services/<slug>.tsx`, qui rend le gabarit commun
  `components/ServicePage.tsx`. Ajouter le chemin à `REQUIRED_PAGES` dans
  `scripts/postbuild.mjs` ; le sitemap la reprend de `services.ts`. Son image
  de partage est `public/og/<slug>.png` (voir plus bas).
- **Une nouvelle page fixe s'ajoute au sitemap à la main**, dans
  `src/routes/sitemap[.]xml.ts` : rien n'est prérendu, aucun crawl ne la
  découvre. Le contenu et la FAQ sont repris tels quels dans le
  JSON-LD (`Service`, `FAQPage`, `BreadcrumbList`) : ne pas dupliquer, éditer
  la donnée.
- **Un article = une illustration.** Deux sources possibles : la couverture de
  la page Notion, rapatriée par `posts:sync` ; ou, à défaut, une image générée
  par `npm run post:image -- <slug>` depuis le `prompt` de `covers.json`. Dans
  les deux cas l'image atterrit dans `public/blog/`, déclinée en AVIF et WebP
  à 480 et 960 px (`scripts/cover-variants.mjs`), et est versionnée — voir
  « Son illustration » dans le README. Le site affiche les déclinaisons ;
  l'image d'origine reste l'`og:image`.
- **Le logo d'une expérience est optionnel.** Rapatrié par `experiences:sync`
  dans `public/experiences/` quand la propriété `logo` est renseignée dans
  Notion ; sinon la carte affiche les initiales de l'entreprise
  (`companyInitials` dans `experiences.ts`). Les URL de fichiers Notion
  expirent en environ une heure : ne jamais les garder telles quelles.
- **`base` reste `/`.** Le site est servi à la racine de `hermez.dev`. Ne
  pas ajouter de `basepath`.
- **Ne pas réactiver le prérendu** dans `vite.config.ts` : Nitro fige la liste
  des fichiers qu'il sert avant que Start n'écrive les pages prérendues, qui
  ne seraient jamais servies (voir le commentaire du fichier).
- **Ne pas activer `spa.enabled`** dans `vite.config.ts` : cela remplace la page
  d'accueil par une coquille vide. Une URL inconnue reçoit la page 404 de
  `__root.tsx`, avec le statut 404.
- **Les sous-chemins GitHub Pages ne sont pas des routes.** `/whisper-desk/`,
  `/ponos/`, etc. sont renvoyés vers `salvadorcardona.github.io` par
  Traefik (`deploy/traefik/github-pages.yml`) : ne pas créer de route qui porte
  l'un de ces noms.
- **Les images de partage vivent dans `public/og/`**, en PNG de 1200 × 630
  (le 1,91:1 des aperçus LinkedIn, qui rogne tout autre format) :
  `hermez.png` par défaut, `<slug>.png` pour chaque page service, tirée de son
  illustration. `seo()` (`src/lib/seo.ts`) émet `og:image` avec ses
  dimensions et son alternative ; les articles passent leur couverture. Elles
  sont composées avec le logo, la police et les couleurs du site, puis
  capturées en 1200 × 630 : garder le texte loin des bords. La bannière du
  README, elle, reste celle de `SalvadorCardona/brand-assets`.
- **Les visuels des projets viennent du même dépôt `brand-assets`.** Chaque
  entrée de `projects` (`profile.ts`) porte un champ `brand` : le nom du dossier
  `projects/<dépôt>/` là-bas, et de `public/projects/<dépôt>/` ici. On y recopie
  `icon.png` redimensionnée en 128 px et `banner.png` convertie en `banner.jpg`
  de 1200 px de large ; sans ces deux fichiers, la carte du projet affiche une
  image cassée.
- **Un seul thème, clair.** Pas de variante `dark:` : le mode sombre a été
  retiré. La couleur de marque est `brand-*` (`styles.css`), l'orange
  d'Animalink en 500 ; les gris sont `stone-*`. Le logo de l'agence (variante 4D
  « contour ») vient de `SalvadorCardona/brand-assets` (`site/public/hermez/`),
  recopié sans retouche : `public/logo.svg` (logo complet, fond clair),
  `public/logo-symbol-dark.svg` (symbole sur fond foncé), `public/favicon.svg`,
  `favicon.ico`, `favicon-16x16.png`, `favicon-32x32.png`,
  `apple-touch-icon.png`, `public/logo.png` (symbole 512 px, le logo du JSON-LD,
  Google n'acceptant pas de SVG) et `public/og/hermez.png`. Pour le changer,
  le refaire dans Brand Assets puis recopier les fichiers ici.
- **La pile de cartes du hero ne montre que de vraies réalisations.** Chaque
  entrée de `works` (`agency.ts`) pointe vers des captures de
  `public/realisations/`, en AVIF et WebP à deux largeurs (voir le type
  `AgencyWork`). Une maquette générée n'y entre pas sous un nom de client.
- **`SITE_URL` (`src/lib/seo.ts`) reste `https://hermez.dev`**, le domaine
  réglé dans Dokploy : il sert aux URL canoniques, à Open Graph et au sitemap.
  L'ancien domaine `cardona.digital` ne sert plus de pages : Traefik le
  redirige en 301 vers la même adresse sur `hermez.dev`
  (`deploy/traefik/cardona-redirect.yml`). Les sous-domaines d'infra
  (`umami`, `dokploy`…) restent, eux, sur `cardona.digital`.

## Vérification avant de conclure

```bash
npm run posts:sync         # si le contenu Notion a changé ; demande NOTION_TOKEN
npm run experiences:sync   # idem, pour les expériences ; demande NOTION_TOKEN
npm run typecheck
npm run build        # échoue si une page ne rend pas en 200
docker build -t cardona-digital .   # si le Dockerfile ou les dépendances changent
```

Le build écrit `.output/`, puis `scripts/postbuild.mjs` démarre le serveur
construit et vérifie `/healthz`, les pages fixes (`/` — l'agence —,
`/notre-equipe`, `/references`, `/services` et ses quatre pages service, `/blog`,
`/contact`, `/mentions-legales`, `/confidentialite`), les redirections 301 des anciennes adresses (`/rendez-vous`,
`/agence`, `/projets`, `/qui-suis-je`, `/404`) et des slashs finaux (`/blog/`, `/services/`),
chaque URL du sitemap (donc chaque
article) et le 404 d'une adresse inconnue. Il échoue aussi si une illustration
déclarée dans `covers.json` ou un logo déclaré dans `experiences.json` n'a pas
suivi. Pour inspecter le rendu réel : `npm run serve`.
