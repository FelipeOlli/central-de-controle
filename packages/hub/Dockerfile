FROM node:20-alpine AS builder

WORKDIR /app

# Install workspace dependencies first for better cache usage.
COPY package.json package-lock.json ./
COPY packages/hub/package.json packages/hub/package.json
RUN npm ci

COPY packages/hub packages/hub

# Generate prisma client and build frontend assets.
RUN npm run prisma:generate -w @aiox/hub
RUN npm run build -w @aiox/hub
RUN npm run build:server -w @aiox/hub

FROM node:20-alpine AS runtime

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3001

COPY package.json package-lock.json ./
COPY packages/hub/package.json packages/hub/package.json
RUN npm ci --omit=dev

COPY --from=builder /app/packages/hub/dist packages/hub/dist
COPY --from=builder /app/packages/hub/prisma packages/hub/prisma
COPY --from=builder /app/packages/hub/dist-server packages/hub/dist-server
COPY --from=builder /app/node_modules/@prisma node_modules/@prisma
COPY --from=builder /app/node_modules/.prisma node_modules/.prisma

EXPOSE 3001

CMD ["node", "packages/hub/dist-server/index.js"]
