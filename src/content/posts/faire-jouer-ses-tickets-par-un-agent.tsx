import type { Post } from './post'

export const post: Post = {
  slug: 'faire-jouer-ses-tickets-par-un-agent',
  title: 'Faire jouer ses tickets par un agent',
  date: '2026-06-02',
  excerpt:
    'Un ticket Notion, une session d’agent, une pull request. Ce que j’ai appris en industrialisant la boucle — et ce qui n’a pas marché.',
  tags: ['Agents LLM', 'Automatisation', 'Claude Code'],
  readingTime: 5,
  body: (
    <>
      <p>
        L’idée de départ tient en une phrase : un ticket entre dans la colonne
        « à faire », un agent le prend, une pull request en sort. Pas de chat,
        pas de copier-coller de contexte, pas d’humain qui joue les
        intermédiaires entre l’outil de suivi et l’éditeur.
      </p>

      <h2>La boucle</h2>
      <ol>
        <li>Lire le ticket et son contexte projet depuis Notion.</li>
        <li>Ouvrir un espace de travail isolé et jetable.</li>
        <li>Lancer une session d’agent avec ce contexte, et rien d’autre.</li>
        <li>Ouvrir une pull request, remettre le lien sur le ticket.</li>
      </ol>
      <p>
        Le point important est le troisième : <strong>une session par
        ticket</strong>. La tentation est de garder une session longue qui
        enchaîne le travail — elle finit toujours par mélanger deux sujets et
        par produire un diff que personne ne veut relire.
      </p>

      <h2>Ce qui n’a pas marché</h2>
      <p>
        <strong>Les tickets vagues.</strong> Un agent ne pose pas de question
        au bon moment ; il comble. Un ticket qui dit « améliorer la page
        profil » produit un diff plausible et inutile. Le travail de cadrage
        n’a pas disparu, il s’est déplacé : il est maintenant entièrement dans
        le ticket.
      </p>
      <p>
        <strong>L’absence de garde-fou automatique.</strong> Tant que la
        vérification reposait sur ma relecture, la boucle n’allait pas plus
        vite qu’avant. Ce qui a changé les choses, c’est de faire tourner
        lint + types + tests à l’intérieur de la session, avant l’ouverture de
        la PR — l’agent corrige ses propres erreurs pendant qu’il a encore le
        contexte en tête.
      </p>
      <p>
        <strong>Faire confiance au récit.</strong> Un agent qui dit « c’est
        fait et testé » se trompe parfois. La seule chose qui compte, c’est la
        sortie de commande dans les logs de session.
      </p>

      <h2>Ce que ça a vraiment changé</h2>
      <p>
        Pas la vitesse d’écriture du code — la vitesse de démarrage. Les tâches
        qui traînaient parce qu’elles demandaient trente minutes de remise en
        contexte pour dix minutes de travail effectif partent maintenant toutes
        seules. Le reste du temps est passé là où il sert : à décider quoi
        construire.
      </p>
    </>
  ),
}
