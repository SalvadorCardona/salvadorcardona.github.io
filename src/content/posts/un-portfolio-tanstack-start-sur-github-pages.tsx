import type { Post } from './post'

export const post: Post = {
  slug: 'un-portfolio-tanstack-start-sur-github-pages',
  title: 'Un portfolio TanStack Start sur GitHub Pages',
  date: '2026-08-28',
  excerpt:
    'TanStack Start est un framework full-stack. GitHub Pages ne sert que des fichiers. Voilà comment les deux se rejoignent, sans serveur et sans compromis sur le référencement.',
  tags: ['TanStack Start', 'GitHub Pages', 'Prérendu'],
  readingTime: 6,
  body: (
    <>
      <p>
        TanStack Start est un framework full-stack : rendu côté serveur, server
        functions, routes API. GitHub Pages, lui, ne sait faire qu’une chose —
        servir des fichiers statiques depuis un CDN. À première vue, les deux
        ne devraient pas se rencontrer.
      </p>
      <p>
        Ils se rencontrent quand même, parce que Start sait figer son rendu au
        build. Le plugin Vite expose une option <code>prerender</code> qui
        parcourt les routes, exécute le rendu serveur une bonne fois pour
        toutes, et écrit un fichier HTML par URL. Ce n’est plus un serveur,
        c’est un dossier.
      </p>

      <h2>Le principe : figer le rendu au build</h2>
      <p>
        On active le prérendu dans <code>vite.config.ts</code>, et on laisse le
        crawler suivre les liens internes :
      </p>
      <pre>
        <code>{`tanstackStart({
prerender: {
  enabled: true,
  crawlLinks: true,
  autoSubfolderIndex: true,
  failOnError: true,
},
})`}</code>
      </pre>
      <p>
        <code>crawlLinks</code> extrait les <code>&lt;a href&gt;</code> du HTML
        généré et enfile les URL trouvées. Comme la page d’accueil pointe vers
        le blog, et que le blog liste tous les articles, une seule racine
        suffit à couvrir le site entier. Aucune liste de routes à maintenir à
        la main : ajouter un article suffit à le faire prérendre.
      </p>
      <p>
        <code>autoSubfolderIndex</code> écrit <code>/blog/index.html</code>{' '}
        plutôt que <code>/blog.html</code>. C’est exactement ce qu’attend un
        hébergeur statique pour résoudre <code>/blog</code> sans réécriture.
      </p>

      <h2>Le piège du chemin de base</h2>
      <p>
        C’est là que la plupart des tentatives se cassent. Un dépôt de projet
        sur GitHub Pages est servi depuis <code>/mon-repo/</code>, pas depuis
        la racine. Il faut alors accorder le <code>base</code> de Vite et le{' '}
        <code>basepath</code> du routeur — et même comme ça, les rapports de
        bugs sur le sujet s’accumulent : assets qui repartent à la racine,
        routes internes <code>__tsr/*</code> qui ignorent le préfixe.
      </p>
      <p>
        La solution n’est pas de se battre avec le préfixe. C’est de le
        supprimer : un dépôt nommé <code>pseudo.github.io</code> est servi à la
        racine du domaine. Le <code>base</code> reste <code>/</code>, le
        routeur n’a rien à savoir, et une classe entière de bugs disparaît
        avant d’exister.
      </p>

      <h2>Les deux fichiers qu’on oublie toujours</h2>
      <p>
        <strong>
          <code>.nojekyll</code>
        </strong>{' '}
        — sans lui, GitHub Pages fait passer le site par Jekyll, qui ignore
        silencieusement tout fichier ou dossier commençant par un underscore.
        Or Start en produit : <code>_shell.html</code> en mode SPA, et le
        dossier d’assets client selon la configuration. Quand ça arrive, on
        récupère du HTML nu — aucun style, aucun JS — et rien dans les logs
        pour l’expliquer. Un fichier vide à la racine règle l’affaire, et coûte
        zéro.
      </p>
      <p>
        <strong>
          <code>404.html</code>
        </strong>{' '}
        — Pages n’a pas de règle de réécriture. Toute URL inconnue tombe sur ce
        fichier. En y copiant le shell applicatif, le routeur client reprend la
        main et affiche la bonne page ou une vraie 404 maison, au lieu de la
        page d’erreur de GitHub.
      </p>

      <h2>Ce qu’on perd, et pourquoi ça ne fait rien</h2>
      <p>
        Un site figé n’a plus de server functions, plus de routes API, plus de
        formulaire qui poste vers son propre backend. Pour un portfolio, ce
        n’est pas une contrainte : le contenu est écrit en dur, il change quand
        on commit, et un formulaire de contact se remplace très bien par un
        lien <code>mailto:</code>.
      </p>
      <p>
        Ce qu’on garde, c’est l’essentiel : du HTML complet servi au premier
        octet — donc indexable, donc rapide —, puis une navigation client
        instantanée une fois le bundle chargé. Hébergement gratuit, TLS inclus,
        aucun serveur à surveiller.
      </p>
    </>
  ),
}
