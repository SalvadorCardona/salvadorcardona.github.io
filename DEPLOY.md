# Déployer cardona.digital sur Dokploy

La feuille de route de la mise en ligne : du dépôt fusionné sur `main` à
`cardona.digital` servi par Dokploy, sous-sites GitHub Pages compris. Tout ce
qui suit se fait dans les interfaces (Dokploy, Hostinger, GitHub, Brevo) ; le
code est déjà prêt.

- Dokploy : <https://dokploy.cardona.digital>, VPS `148.230.109.72`.
- DNS : zone `cardona.digital` chez Hostinger.
- Image : le `Dockerfile` à la racine, qui écoute sur le port `3000` et répond
  `ok` sur `/healthz`.

## 0. La veille : abaisser le TTL

Chez Hostinger, passer le TTL des enregistrements de l'apex (`@`, les quatre
`A` GitHub) et de `www` à **300 s**. Ils sont à 3600 s : sans cela, les
résolveurs servent encore l'ancienne adresse pendant une heure après la
bascule.

## 1. Créer l'application

Dans Dokploy, projet **App** (celui d'Umami et de N8N), environnement
`production` : **Create Service → Application**, nom `cardona-digital`.

**General → Provider : GitHub**

| Réglage     | Valeur                                   |
| ----------- | ---------------------------------------- |
| Repository  | `SalvadorCardona/salvadorcardona.github.io` |
| Branch      | `main`                                   |
| Build path  | `/`                                      |
| Autodeploy  | activé                                   |

L'autodeploy remplace l'ancien workflow `deploy.yml` : chaque push sur `main`
reconstruit l'image, y compris les commits des workflows `publish-blog.yml` et
`publish-experiences.yml` (le webhook GitHub de Dokploy voit tous les push, y
compris ceux d'une Action).

**Build Type : Dockerfile**

| Réglage          | Valeur       |
| ---------------- | ------------ |
| Docker File      | `Dockerfile` |
| Docker Context Path | `.`       |
| Docker Build Stage | *(vide : la dernière, `runtime`)* |

Le build lance `npm run build`, qui démarre le serveur construit et vérifie
chaque page : une page cassée fait échouer le déploiement, l'ancienne version
reste en ligne.

## 2. Variables d'environnement

**Environment**, une variable par ligne. La liste de référence est
`.env.example` ; toutes sont lues à l'exécution, un simple **Redeploy** suffit
après modification (pas besoin de reconstruire, mais Dokploy le fait de toute
façon).

```env
PORT=3000
BREVO_API_KEY=xkeysib-…                        # étape 7
CONTACT_TO_EMAIL=contact@cardona.digital
CONTACT_FROM_EMAIL=contact@cardona.digital
CONTACT_FROM_NAME=Agence Cardona
BREVO_LIST_ID=                                 # facultatif, étape 7
TURNSTILE_SITE_KEY=    # facultatif, étape 8
TURNSTILE_SECRET=      # facultatif, étape 8
```

Vides, les pages restent en ligne : `/contact` annonce que le formulaire n'est
pas branché et renvoie vers l'e-mail. On peut donc déployer d'abord, brancher
ensuite.

Aucun de ces secrets ne part dans l'image ni dans le navigateur : ne pas les
saisir en *Build-time arguments*.

## 3. Healthcheck

Le `HEALTHCHECK` du Dockerfile interroge `http://127.0.0.1:$PORT/healthz`
toutes les 30 s. Pour que Dokploy attende un conteneur sain avant de couper
l'ancien (déploiement sans coupure), **Advanced → Swarm Settings → Health
Check** :

```json
{
  "Test": ["CMD", "node", "-e", "fetch(`http://127.0.0.1:${process.env.PORT}/healthz`).then((r) => process.exit(r.ok ? 0 : 1), () => process.exit(1))"],
  "Interval": 30000000000,
  "Timeout": 5000000000,
  "StartPeriod": 15000000000,
  "Retries": 3
}
```

Puis **Deploy**, et vérifier dans **Logs** la ligne `Listening on:
http://localhost:3000/`.

## 4. Domaine

**Domains → Add Domain** :

| Réglage          | Valeur            |
| ---------------- | ----------------- |
| Host             | `cardona.digital` |
| Path             | `/`               |
| Container Port   | `3000`            |
| HTTPS            | activé            |
| Certificate      | Let's Encrypt     |
| Middlewares      | `compress@file`   |

Le middleware `compress@file`, défini dans `deploy/traefik/compress.yml`,
compresse en brotli ou gzip les pages rendues à la requête ; les fichiers
statiques arrivent déjà compressés de Nitro. Sans lui, le HTML part brut
(92 Ko pour l'accueil). Déposer ce fichier dans
`/etc/dokploy/traefik/dynamic/` avant de l'ajouter au domaine, comme
`www-redirect.yml` ci-dessous.

Ajouter aussi `www.cardona.digital` (mêmes réglages), avec dans
**Middlewares** `www-to-apex@file` : ce middleware, défini dans
`deploy/traefik/www-redirect.yml`, répond par un 301 vers
`https://cardona.digital` en conservant le chemin et la query string. Déposer
ce fichier dans `/etc/dokploy/traefik/dynamic/` (comme celui de l'étape 6)
avant de créer le domaine, sinon Traefik ignore le routeur `www` faute de
middleware.

Un domaine ajouté ou modifié n'est appliqué qu'au **Redeploy** suivant ;
avant, Traefik répond 404 avec son certificat par défaut.

## 5. Bascule DNS et GitHub Pages — dans la même minute

Deux gestes à enchaîner sans attendre entre les deux, dans cet ordre :

1. **GitHub → `salvadorcardona.github.io` → Settings → Pages → Custom
   domain** : vider le champ et enregistrer (ou `gh api -X DELETE
   repos/SalvadorCardona/salvadorcardona.github.io/pages` pour dépublier le
   site Pages en entier ; les sous-sites des autres dépôts n'en dépendent
   pas).
2. **Hostinger → DNS** :
   - supprimer les quatre `A` de `@` vers `185.199.108.153`,
     `185.199.109.153`, `185.199.110.153`, `185.199.111.153` (et les `AAAA`
     GitHub s'il y en a) ;
   - ajouter un `A` `@` → `148.230.109.72`, TTL 300 ;
   - remplacer le `CNAME` `www` → `salvadorcardona.github.io` par un `CNAME`
     `www` → `cardona.digital`.
   - **Ne pas toucher** aux autres noms : `trader`, `n8n`, `dokploy`,
     `umami` (sur `148.230.109.72`) et `preprod` (sur `82.29.173.67`).

Pourquoi retirer le domaine personnalisé : tant qu'il est déclaré, GitHub
répond à `salvadorcardona.github.io/<projet>/` par un 301 vers
`cardona.digital/<projet>/`. Une fois le proxy de l'étape 6 en place, cette
adresse repasse par Traefik, qui la renvoie à GitHub, qui redirige encore :
boucle infinie sur tous les sous-sites. Constaté le 2026-09-30 :

```console
$ curl -sI https://salvadorcardona.github.io/whisper-desk/ | grep -i location
location: https://cardona.digital/whisper-desk/
```

Après la bascule, cette commande ne doit plus renvoyer de `location`.

Attendre ensuite l'émission du certificat Let's Encrypt par Traefik (une ou
deux minutes après que le DNS pointe sur le VPS).

## 6. Proxy des sous-sites GitHub Pages

Les dépôts publiés sur GitHub Pages restent servis par GitHub ; Traefik les
relaie sous `cardona.digital/<projet>/` en conservant le chemin. La
configuration est versionnée dans `deploy/traefik/github-pages.yml`.

**Dokploy → Web Server → Traefik → File System** (ou en SSH sur le VPS) :
créer `/etc/dokploy/traefik/dynamic/github-pages.yml` avec le contenu exact du
fichier du dépôt. Traefik recharge le dossier tout seul, sans redémarrage.

Sous-chemins recensés le 2026-09-30 (tous les dépôts `SalvadorCardona` avec
Pages actif, chacun en 200 sur `cardona.digital` à cette date) :

| Sous-chemin              | Dépôt                 |
| ------------------------ | --------------------- |
| `/adam-eve/`             | `adam-eve`            |
| `/CoookingPubSub/`       | `CoookingPubSub`      |
| `/des-3d/`               | `des-3d`              |
| `/gnome-claude-usage/`   | `gnome-claude-usage`  |
| `/mobile-factory/`       | `mobile-factory`      |
| `/ponos/`                | `ponos`               |
| `/react-data-form/`      | `react-data-form`     |
| `/react-game/`           | `react-game`          |
| `/react-resource-view/`  | `react-resource-view` |
| `/trigo-js/`             | `trigo-js`            |
| `/whisper-desk/`         | `whisper-desk`        |

Pour refaire l'inventaire (un nouveau dépôt publié sur Pages s'ajoute aux deux
règles du fichier) :

```bash
gh api --paginate 'user/repos?per_page=100&affiliation=owner' \
  --jq '.[] | select(.has_pages) | .name'
```

Ce que fait le fichier :

- `github-pages` : `Host(cardona.digital)` et `PathPrefix(/<projet>/)` →
  `https://salvadorcardona.github.io`, avec `passHostHeader: false` (GitHub
  choisit le site d'après l'en-tête `Host`) et une priorité de 1000, au-dessus
  du routeur de l'application.
- `github-pages-slash` : `/<projet>` sans slash final est redirigé en 301 vers
  `/<projet>/` sur `cardona.digital`, sinon GitHub redirigerait vers sa propre
  adresse.
- `ticket-runner-to-ponos` : le dépôt `ticket-runner` est devenu `ponos` le
  2026-10-02, et GitHub ne redirige pas l'ancienne adresse Pages.
  `/ticket-runner` et tout `/ticket-runner/…` sont renvoyés en 301 vers la même
  page sous `/ponos/`, requête comprise. Un dépôt renommé change de
  sous-chemin : renommer aussi son entrée dans les deux règles, sinon le
  nouveau chemin tombe sur la page 404 du site.
- Les routeurs visent l'entrée `websecure` avec le résolveur `letsencrypt`,
  les noms utilisés par Dokploy ; la redirection HTTP → HTTPS de l'entrée
  `web` est celle de Dokploy.

Testé le 2026-09-30 dans un Traefik v3 local : `/whisper-desk/` atteint bien
GitHub avec le chemin intact, `/whisper-desk` et `/whisper-desk?x=1` sont
redirigés vers la version avec slash, `/whisper-desk-autre/` n'est pas capté.

## 7. Brevo : les e-mails du formulaire

Le formulaire appelle directement l'API transactionnelle Brevo
(`POST https://api.brevo.com/v3/smtp/email`, en-tête `api-key`), sans N8N ni
SDK. Tout se fait dans l'organisation Brevo **Cardona** (pas `animalink` :
se déconnecter puis se reconnecter au bon compte, il n'y a pas de sélecteur).

1. **Expéditeur** : `contact@cardona.digital` est déjà vérifié et le domaine
   authentifié (DKIM, DMARC au vert depuis le 01/09/2026). Le reprendre dans
   `CONTACT_FROM_EMAIL`. Une adresse d'un domaine non authentifié serait
   refusée par Brevo.
2. **Clé d'API** : **SMTP & API → API Keys → Generate a new API key**, nom
   `cardona.digital (Dokploy)`, dans `BREVO_API_KEY`. Si Brevo restreint les
   IP autorisées (**Security → Authorised IPs**), y ajouter `148.230.109.72`.
3. **Destinataire** : `CONTACT_TO_EMAIL`, la boîte qui reçoit les demandes :
   `contact@cardona.digital`, boîte Hostinger Mail (webmail Hostinger).
4. **Facultatif, fichier de leads** : **Contacts → Lists → Create a list**
   (« Prospects cardona.digital »), puis reporter son identifiant numérique
   dans `BREVO_LIST_ID`. Seule l'adresse e-mail est enregistrée.

Ce qui part à chaque message valide :

- **à l'agence** : toutes les réponses du formulaire, `replyTo` = l'e-mail du
  prospect (« Répondre » lui écrit directement). Si la case « appel
  découverte » est cochée, l'objet commence par « Appel demandé » et un
  encadré en tête reprend les disponibilités saisies ;
- **au prospect** : un remerciement (ou, si l'appel est demandé, « nous
  revenons vers vous pour fixer l'appel ») et le rappel de sa demande ;
- **si `BREVO_LIST_ID`** : `POST /v3/contacts` avec `updateEnabled: true`.

Toutes les valeurs saisies sont échappées avant d'entrer dans le HTML des
e-mails. Seule la notification à l'agence conditionne le succès affiché (délai
maximal 10 s) : si elle échoue, le visiteur voit un message d'erreur qui lui
propose l'e-mail ; un échec de l'accusé de réception ou de l'ajout à la liste
est seulement journalisé (`[contact]` dans les logs Dokploy), pour ne pas
pousser le visiteur à renvoyer un message déjà reçu.

Anti-spam en place côté site : champ piège caché (les robots qui le
remplissent reçoivent un faux succès, rien n'est transmis), 5 envois par IP et
par quart d'heure (en mémoire du conteneur, remis à zéro au redémarrage).
L'IP est lue dans `X-Forwarded-For`, posé par Traefik.

## 8. Facultatif : Cloudflare Turnstile

Sur le tableau de bord Cloudflare, **Turnstile → Add widget**, domaine
`cardona.digital`, mode *Managed*. Copier la clé de site dans
`TURNSTILE_SITE_KEY` et la clé secrète dans `TURNSTILE_SECRET`. Il faut les
deux : avec une seule, Turnstile reste désactivé. Une fois actif, le widget
apparaît sous le message et chaque envoi est vérifié côté serveur auprès de
Cloudflare. La Content-Security-Policy du site autorise déjà son script et
son iframe (voir l'étape 9).

## 9. Vérifications

```bash
curl -s https://cardona.digital/healthz                     # ok
curl -sI https://cardona.digital/ | head -1                 # HTTP/2 200
curl -s -o /dev/null -w '%header{content-encoding}\n' \
  -H 'Accept-Encoding: br, gzip' https://cardona.digital/    # br (compress@file)
curl -sI https://cardona.digital/video/agence-cardona-poster.jpg | grep -i cache-control
                                                            # public, max-age=2592000
curl -s https://cardona.digital/sitemap.xml | grep -c '<loc>'   # 8 pages + un par article
curl -sI https://cardona.digital/rendez-vous | grep -i location # /contact?appel=1 (301)
curl -sI https://cardona.digital/n-existe-pas | head -1     # HTTP/2 404
curl -sI https://cardona.digital/whisper-desk/ | head -1    # HTTP/2 200, servi par GitHub
curl -sI https://cardona.digital/whisper-desk | grep -i location   # …/whisper-desk/
for p in adam-eve CoookingPubSub des-3d gnome-claude-usage mobile-factory \
  react-data-form react-game react-resource-view ponos trigo-js whisper-desk; do
  printf '%-22s %s\n' "$p" "$(curl -s -o /dev/null -w '%{http_code}' https://cardona.digital/$p/)"
done                                                        # 200 partout
curl -sI https://cardona.digital/ | grep -iE 'strict-transport|content-security|x-content-type|x-frame|referrer-policy|permissions-policy'   # six lignes
```

Les en-têtes de sécurité sont posés par l'application, sans réglage dans
Dokploy ni fichier Traefik : HSTS (un an, sans `includeSubDomains`),
`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy` et
`Permissions-Policy` par les `routeRules` de `vite.config.ts`, sur toutes les
réponses ; la `Content-Security-Policy`, avec un nonce tiré à chaque requête,
par le middleware de `src/start.ts`, sur les pages. Elle n'autorise comme
origines externes qu'Umami (`umami.cardona.digital`) et Cloudflare Turnstile
(`challenges.cloudflare.com`) : un nouveau script ou service tiers s'ajoute
là, sinon le navigateur le bloque. Les sous-sites GitHub Pages passent par le
routeur Traefik de l'étape 6 et n'en héritent pas. Contrôle externe :
<https://securityheaders.com/?q=cardona.digital&followRedirects=on>, note A
attendue.

Puis, dans un navigateur : envoyer un message de test depuis `/contact` avec
sa propre adresse et la case « appel découverte » cochée, et recevoir les deux
e-mails (notification et accusé de réception ; **Brevo → Transactional →
Logs** en cas de doute).
Enfin, dans Google Search Console, soumettre de nouveau
`https://cardona.digital/sitemap.xml`.

## Revenir en arrière

Remettre les quatre `A` GitHub sur `@` et le `CNAME` `www`, puis redéclarer
`cardona.digital` dans Settings → Pages du dépôt. Attention : `deploy.yml` a
été retiré avec le passage à Dokploy ; GitHub Pages resservirait donc le
dernier build statique publié, sans le nouveau `/contact`.
