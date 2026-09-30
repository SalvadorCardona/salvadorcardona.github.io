# syntax=docker/dockerfile:1

# Image du site cardona.digital pour Dokploy : TanStack Start rendu côté
# serveur par Nitro (preset node-server). Seul `.output/` part dans l'image
# finale ; aucune valeur de configuration n'y est figée, tout passe par les
# variables d'environnement du conteneur (voir .env.example et DEPLOY.md).

# --- Dépendances : relancé seulement quand package-lock.json change.
FROM node:22-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# --- Build : `vite build`, puis `scripts/postbuild.mjs` démarre le serveur
# construit et vérifie chaque page ; une page cassée fait échouer l'image.
FROM deps AS build
COPY . .
RUN npm run build

# --- Image finale : Node seul, sans node_modules (Nitro embarque ce dont le
# serveur a besoin dans .output/server), exécutée par l'utilisateur `node`.
FROM node:22-slim AS runtime
ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=3000
WORKDIR /app
COPY --from=build --chown=node:node /app/.output ./.output
USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD ["node", "-e", "fetch(`http://127.0.0.1:${process.env.PORT}/healthz`).then((r) => process.exit(r.ok ? 0 : 1), () => process.exit(1))"]
CMD ["node", ".output/server/index.mjs"]
