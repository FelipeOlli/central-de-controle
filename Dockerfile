# Hub — build a partir da raiz do repositório (EasyPanel / central-de-controle)
# Build context: raiz do repo (.)
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
COPY packages/hub/package.json packages/hub/package.json
# ignore-scripts evita prepare/husky no builder (e em CI sem git)
RUN npm ci --ignore-scripts

COPY packages/hub packages/hub

RUN npm run prisma:generate -w @aiox/hub
RUN npm run build -w @aiox/hub
RUN npm run build:server -w @aiox/hub

FROM node:20-alpine AS runtime

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3001
# Default SQLite em path gravável no container (override no EasyPanel se quiser volume)
ENV DATABASE_URL=file:/tmp/hub.sqlite

COPY package.json package-lock.json ./
COPY packages/hub/package.json packages/hub/package.json
# Evita prepare/husky (devDependency) no stage de produção
RUN npm ci --omit=dev --ignore-scripts

COPY --from=builder /app/packages/hub/dist packages/hub/dist
COPY --from=builder /app/packages/hub/prisma packages/hub/prisma
COPY --from=builder /app/packages/hub/dist-server packages/hub/dist-server
# Prisma client é gerado em packages/hub/node_modules/ (workspace), não na raiz
COPY --from=builder /app/packages/hub/node_modules/@prisma node_modules/@prisma
COPY --from=builder /app/packages/hub/node_modules/.prisma node_modules/.prisma
# CLI para db push no primeiro start (schema em /tmp ou volume)
COPY --from=builder /app/packages/hub/node_modules/prisma node_modules/prisma
COPY --from=builder /app/packages/hub/node_modules/.bin/prisma node_modules/.bin/prisma

EXPOSE 3001

# Garante schema criado antes de subir o servidor (ex.: SQLite em /tmp/hub.sqlite)
CMD ["sh", "-c", "npx prisma db push --schema packages/hub/prisma/schema.prisma --skip-generate && exec node packages/hub/dist-server/index.js"]
