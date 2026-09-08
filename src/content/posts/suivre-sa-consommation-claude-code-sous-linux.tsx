/**
 * Généré par `npm run posts:sync` depuis la database Notion « Blog Salvador Cardona ».
 * Ne pas éditer à la main : la prochaine synchronisation écrase ce fichier.
 */

import type { Post } from './post'

export const post: Post = {
  slug: 'suivre-sa-consommation-claude-code-sous-linux',
  title: 'Suivre sa consommation Claude Code sous Linux',
  date: '2026-09-01',
  excerpt:
    'Trois limites courent en parallèle, et la seule façon de savoir où j’en suis était de taper /usage au milieu d’une session. J’en ai fait une extension GNOME Shell : un camembert dans la barre, le détail au clic.',
  tags: ['GNOME Shell', 'Claude Code', 'Linux', 'GJS'],
  readingTime: 6,
  body: (
    <>
      <p>
        Un abonnement Claude Code, ce n’est pas un compteur mais trois, qui
        courent en même temps : une fenêtre glissante de cinq heures, une
        limite hebdomadaire tous modèles confondus, et une limite hebdomadaire
        propre au modèle le plus cher. Chacune a son pourcentage, chacune a
        son heure de remise à zéro, et aucune des trois n’est visible nulle
        part quand on travaille.
      </p>
      <p>
        Sur Linux, la seule façon de les lire était de taper <code>{`/usage`}</code>{' '}
        dans une session ouverte. Il faut donc une session ouverte, et il faut
        interrompre ce qu’on y fait pour poser la question. J’ai fini par
        écrire l’extension GNOME Shell qui répond à ma place.
      </p>
      <h2>
        Le problème : une limite qu’on découvre en la touchant
      </h2>
      <p>
        Le vrai coût n’est pas la limite, c’est la surprise. On lance une
        grosse tâche sans savoir qu’il reste dix minutes de fenêtre, et elle
        se fait couper au milieu. Ou l’inverse : on s’auto-rationne toute une
        après-midi alors qu’il restait de la marge, parce qu’on n’a aucune
        idée d’où on en est.
      </p>
      <p>
        Les outils qui existaient reconstituaient la consommation à partir des
        journaux locaux de sessions, en additionnant des jetons. C’est une
        estimation, et elle diverge de ce que le compte affiche réellement.
        Une jauge qui a tort ne rend pas service : on cesse de la regarder au
        premier écart.
      </p>
      <h2>
        Un camembert dans la barre
      </h2>
      <p>
        L’extension pose un anneau dans la barre supérieure, avec le
        pourcentage à côté. C’est tout ce qui reste visible en permanence, et
        c’est suffisant : la couleur et le remplissage se lisent du coin de
        l’œil, sans rien ouvrir.
      </p>
      <figure>
        <img
          src="/blog/claude-usage-panel.png"
          alt="L’indicateur dans la barre : la fenêtre de cinq heures en cours."
          width={360}
          height={108}
          className="mx-auto rounded-lg bg-slate-900"
        />
        <figcaption>L’indicateur dans la barre : la fenêtre de cinq heures en cours.</figcaption>
      </figure>
      <p>
        Au clic, le menu déplie les trois limites — chacune avec son anneau,
        son pourcentage et l’heure à laquelle elle repart de zéro — puis ce
        qui explique le chiffre : le nombre de requêtes et de sessions des
        dernières vingt-quatre heures et des sept derniers jours, la part de
        sessions lancées en parallèle, celle passée au-delà de 150 000 jetons
        de contexte, les compétences et les serveurs MCP les plus sollicités.
      </p>
      <figure>
        <img
          src="/blog/claude-usage-menu-fr.png"
          alt="Le menu ouvert : les trois limites, leur remise à zéro, et ce qui pèse dans la consommation."
          width={420}
          height={590}
          className="mx-auto rounded-lg bg-slate-900"
        />
        <figcaption>Le menu ouvert : les trois limites, leur remise à zéro, et ce qui pèse dans la consommation.</figcaption>
      </figure>
      <p>
        C’est cette deuxième moitié qui a fini par changer ma façon de
        travailler. Voir « 90 % avec quatre sessions ou plus en parallèle »
        explique en une ligne pourquoi une fenêtre part si vite.
      </p>
      <h2>
        D’où viennent les chiffres
      </h2>
      <p>
        De la même commande, jouée en mode non interactif :
      </p>
      <pre>
        <code>{`claude -p "/usage"`}</code>
      </pre>
      <p>
        Ce sont donc les chiffres officiels du compte, pas une reconstitution.
        Et surtout, l’extension ne parle jamais à Anthropic : c’est le CLI qui
        le fait, avec la session dont il dispose déjà. Aucune clé d’API à
        créer, aucun jeton dépensé pour un relevé, et le fichier <code>{`~/.claude/.credentials.json`}</code>{' '}
        n’est jamais ouvert.
      </p>
      <p>
        Contrepartie assumée : sans le CLI installé et connecté, il n’y a rien
        à afficher. Le menu le dit franchement plutôt que de montrer un
        chiffre faux.
      </p>
      <h2>
        Ne jamais bloquer le shell
      </h2>
      <p>
        Un relevé prend environ cinq secondes. Dans GNOME Shell, cette durée
        n’est pas une gêne, c’est une faute : les extensions tournent dans le
        processus du shell, et tout ce qui bloque leur boucle bloque le bureau
        entier — le curseur, les fenêtres, le clavier.
      </p>
      <p>
        Le sous-processus est donc lancé de façon strictement asynchrone, avec
        un délai de garde au cas où le CLI resterait pendu sur un réseau qui
        ne répond pas, et un jeton d’annulation pour couper un relevé devenu
        inutile :
      </p>
      <pre>
        <code>{`const proc = launcher.spawnv([claudePath, '-p', '/usage'])

const timeoutId = GLib.timeout_add_seconds(GLib.PRIORITY_DEFAULT, 60, () => {
proc.force_exit()
return GLib.SOURCE_REMOVE
})

const [stdout, stderr] = await proc.communicate_utf8_async(null, cancellable)`}</code>
      </pre>
      <p>
        Le reste suit la même logique d’économie : un relevé toutes les cinq
        minutes, plus un à l’ouverture du menu si le dernier date de plus
        d’une minute. Deux détails m’ont coûté du temps — le shell hérite d’un{' '}
        <code>{`PATH`}</code> minimal, il faut donc aller chercher le binaire
        là où les installeurs le posent ; et <code>{`claude`}</code> archive
        une session par répertoire visité, d’où un dossier de cache dédié
        comme répertoire de travail plutôt que le dossier personnel.
      </p>
      <h2>
        Parser une sortie qui n’est pas une interface
      </h2>
      <p>
        Le CLI répond en anglais quelle que soit la locale. L’extension lit
        donc l’anglais, mais n’en garde rien : le parseur ne rend que des clés
        et des nombres, et l’affichage est reconstruit dans la langue de
        l’utilisateur.
      </p>
      <p>
        Cette frontière n’est pas de la coquetterie. La sortie de <code>{`/usage`}</code>{' '}
        n’est pas une interface documentée : elle peut changer sans prévenir.
        Une ligne que le parseur ne reconnaît pas est affichée telle quelle
        plutôt que déformée, et la logique de mise en forme n’importe pas
        GNOME — ce qui permet de l’exercer hors du shell, là où les modules{' '}
        <code>{`resource:///`}</code> n’existent pas.
      </p>
      <h2>
        L’installer
      </h2>
      <p>
        Depuis les sources, ce qui marche partout :
      </p>
      <pre>
        <code>{`git clone https://github.com/SalvadorCardona/gnome-claude-usage.git
cd gnome-claude-usage
./install.sh
gnome-extensions enable claude-usage@salvadorcardona.github.io`}</code>
      </pre>
      <p>
        Puis se déconnecter et se reconnecter : GNOME Shell ne découvre une
        extension nouvellement posée qu’au démarrage, et sous Wayland il ne
        peut pas être relancé sur place. L’extension est aussi publiée sur{' '}
        <a href="https://extensions.gnome.org/extension/10785/claude-usage/" target="_blank" rel="noreferrer">extensions.gnome.org</a>,
        pour l’installation en un clic.
      </p>
      <h2>
        Ce que ça change
      </h2>
      <p>
        Rien de spectaculaire, et c’est bien le but : un coup d’œil a remplacé
        une commande. Je sais avant de lancer une grosse tâche si la fenêtre
        tiendra, et je ne découvre plus une limite en la touchant. Le code est
        sur{' '}
        <a href="https://github.com/SalvadorCardona/gnome-claude-usage" target="_blank" rel="noreferrer">GitHub</a>,
        en GPL, et le catalogue de traduction n’attend qu’une copie pour
        d’autres langues que le français.
      </p>
    </>
  ),
}
