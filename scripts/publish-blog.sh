# Publication du blog en une commande, depuis n'importe où.
#
# À sourcer depuis ~/.bashrc :
#
#     source ~/salvadorcardona.github.io/scripts/publish-blog.sh
#
# Puis, après avoir écrit un article dans Notion :
#
#     mePublishBlog                       # message de commit par défaut
#     mePublishBlog "Publie « Mon titre »"
#     mePublishBlog --yes                 # sans confirmation
#
# Le jeton Notion ne vit pas dans le .bashrc — un dotfile finit souvent
# versionné. Il est lu depuis ~/.config/cardona-blog/env :
#
#     mkdir -p ~/.config/cardona-blog
#     echo 'export NOTION_TOKEN=ntn_...' > ~/.config/cardona-blog/env
#     chmod 600 ~/.config/cardona-blog/env

mePublishBlog() {
  local repo="${BLOG_REPO:-$HOME/salvadorcardona.github.io}"
  local env_file="$HOME/.config/cardona-blog/env"
  local assume_yes=0
  local message=""

  while [ $# -gt 0 ]; do
    case "$1" in
      --yes | -y) assume_yes=1 ;;
      *) message="$1" ;;
    esac
    shift
  done

  [ -d "$repo/.git" ] || {
    echo "Dépôt introuvable : $repo" >&2
    echo "Indiquer le bon chemin avec : export BLOG_REPO=/chemin/vers/le/depot" >&2
    return 1
  }

  # shellcheck source=/dev/null
  [ -f "$env_file" ] && . "$env_file"
  [ -n "$NOTION_TOKEN" ] || {
    echo "NOTION_TOKEN manquant. Le poser dans $env_file :" >&2
    echo "  echo 'export NOTION_TOKEN=ntn_...' > $env_file && chmod 600 $env_file" >&2
    return 1
  }

  # Tout se passe dans un sous-shell : le répertoire courant de l'appelant et
  # son NOTION_TOKEN ne bougent pas, quoi qu'il arrive en route.
  (
    cd "$repo" || exit 1

    # Publier par-dessus un travail en cours mélangerait deux sujets dans le
    # même commit, et le `git add -A` plus bas emporterait tout.
    if [ -n "$(git status --porcelain)" ]; then
      echo "Le dépôt a des modifications non validées. Les traiter d'abord :" >&2
      git status --short >&2
      exit 1
    fi

    echo "==> Mise à jour de main"
    git checkout --quiet main || exit 1
    git pull --quiet --ff-only origin main || exit 1

    echo "==> Synchronisation depuis Notion"
    npm run --silent posts:sync || exit 1

    if [ -z "$(git status --porcelain)" ]; then
      echo "Rien à publier : le dépôt est déjà à jour avec Notion."
      exit 0
    fi

    echo
    echo "==> Ce qui va être publié"
    git status --short
    echo

    echo "==> Vérification"
    npm run --silent typecheck || exit 1
    npm run --silent build > /dev/null || {
      echo "Le build a échoué — rien n'est publié." >&2
      exit 1
    }
    echo "typecheck et build : ok"

    if [ "$assume_yes" -eq 0 ]; then
      printf '\nPublier sur main et déclencher le déploiement ? [o/N] '
      read -r reply
      case "$reply" in
        o | O | y | Y) ;;
        *)
          echo "Annulé. Les fichiers synchronisés sont conservés, non validés."
          exit 1
          ;;
      esac
    fi

    git add -A || exit 1
    git commit --quiet -m "${message:-Synchronise les articles depuis Notion}" || exit 1
    git push --quiet origin main || exit 1

    echo
    echo "Publié. Le déploiement tourne :"
    echo "  https://github.com/SalvadorCardona/salvadorcardona.github.io/actions"
    echo "  https://cardona.digital"
  )
}
