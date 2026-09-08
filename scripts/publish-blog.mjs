/**
 * Publie le blog : déclenche le workflow « Publier le blog » sur GitHub.
 *
 *   npm run posts:publish                          # message de commit par défaut
 *   npm run posts:publish -- "Publie « Mon titre »"
 *   npm run posts:publish -- --no-watch            # sans suivre le run
 *
 * Rien ne tourne en local : c'est l'Action qui lit Notion, commite les
 * articles sur `main` et déclenche le déploiement. Le jeton Notion vit dans
 * les secrets du dépôt, pas sur le poste — il n'y a donc rien à exporter avant
 * d'appeler cette commande, seulement un `gh auth login` fait une fois.
 *
 * Voir `.github/workflows/publish-blog.yml`.
 */

import { spawnSync } from 'node:child_process'
import process from 'node:process'

const WORKFLOW = 'publish-blog.yml'
const BRANCH = 'main'
/** Le run apparaît quelques secondes après le dispatch, jamais instantanément. */
const POLL_INTERVAL = 2000
const POLL_ATTEMPTS = 15

function fail(message) {
  console.error(`[posts:publish] ${message}`)
  process.exit(1)
}

/**
 * Lance `gh` et rend sa sortie. Un échec arrête la publication, sauf si
 * `tolerant` : là, l'appelant décide — plusieurs échecs de `gh` se racontent
 * mieux que par leur message brut.
 */
function gh(args, { stream = false, tolerant = false } = {}) {
  const result = spawnSync('gh', args, {
    encoding: 'utf8',
    stdio: stream ? 'inherit' : ['ignore', 'pipe', 'pipe'],
  })

  if (result.error?.code === 'ENOENT') {
    fail(
      'GitHub CLI introuvable. L’installer depuis https://cli.github.com, ' +
        'puis s’authentifier avec `gh auth login`.',
    )
  }
  if (result.error) fail(result.error.message)
  if (result.status !== 0 && !tolerant) {
    fail(`\`gh ${args.join(' ')}\` a échoué :\n${(result.stderr ?? '').trim()}`)
  }

  return {
    status: result.status,
    stdout: (result.stdout ?? '').trim(),
    stderr: (result.stderr ?? '').trim(),
  }
}

/**
 * L'identifiant du dernier run du workflow, ou une chaîne vide s'il n'y en a
 * pas — GitHub répond aussi 404 tant que le workflow n'est pas sur `main`, et
 * c'est `gh workflow run` qui le dira mieux, juste après.
 */
const lastRunId = () =>
  gh(
    [
      'run',
      'list',
      '--workflow',
      WORKFLOW,
      '--limit',
      '1',
      '--json',
      'databaseId',
      '--jq',
      '.[0].databaseId // ""',
    ],
    { tolerant: true },
  ).stdout

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

/** Attend le run que le dispatch vient de créer : un identifiant nouveau. */
async function waitForRun(previous) {
  for (let attempt = 0; attempt < POLL_ATTEMPTS; attempt += 1) {
    await sleep(POLL_INTERVAL)
    const id = lastRunId()
    if (id && id !== previous) return id
  }
  return null
}

async function main() {
  const args = process.argv.slice(2)
  const watch = !args.includes('--no-watch')
  const message = args.find((arg) => !arg.startsWith('--'))

  const previous = lastRunId()

  console.log('[posts:publish] Déclenchement du workflow « Publier le blog »')
  const dispatch = gh(
    [
      'workflow',
      'run',
      WORKFLOW,
      '--ref',
      BRANCH,
      ...(message ? ['-f', `message=${message}`] : []),
    ],
    { tolerant: true },
  )
  if (dispatch.status !== 0) {
    // Un 404 ici veut dire, neuf fois sur dix, que le workflow n'est pas
    // encore sur `main` : GitHub ne connaît que les workflows de la branche.
    fail(
      `Workflow non lancé :\n${dispatch.stderr}\n` +
        `Vérifier que ${WORKFLOW} est bien sur ${BRANCH} et que \`gh auth login\` est fait.`,
    )
  }

  const runId = await waitForRun(previous)
  if (!runId) {
    console.log(
      '[posts:publish] Workflow lancé, mais son run tarde à apparaître. ' +
        `Le suivre avec : gh run list --workflow ${WORKFLOW}`,
    )
    return
  }

  const url = gh(['run', 'view', runId, '--json', 'url', '--jq', '.url']).stdout
  console.log(`[posts:publish] ${url}`)
  if (!watch) return

  // `--exit-status` fait porter l'échec du run au code de sortie : une
  // synchronisation qui casse ne doit pas se conclure par « publié ».
  const { status } = gh(['run', 'watch', runId, '--exit-status'], {
    stream: true,
    tolerant: true,
  })
  if (status !== 0) {
    fail('Le workflow a échoué — rien n’est publié. Voir le run ci-dessus.')
  }

  // Le run réussit aussi quand Notion n'avait rien de neuf : son journal, plus
  // haut, dit lequel des deux s'est produit.
  console.log('[posts:publish] Terminé. Le site : https://cardona.digital')
}

main().catch((error) => {
  console.error('[posts:publish]', error.message)
  process.exit(1)
})
