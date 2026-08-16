FROM ghcr.io/pnpm/pnpm:11 AS base
RUN pnpm runtime set node 20 -g

# Stage 1: Fetch and install prod dependencies
FROM base AS prod-deps
WORKDIR /app
COPY pnpm-lock.yaml ./
RUN pnpm fetch --prod
COPY package.json ./
RUN pnpm install --frozen-lockfile --offline --prod

# Stage 2: Fetch and install all dependencies & build
FROM base AS builder
WORKDIR /app
COPY pnpm-lock.yaml ./
RUN pnpm fetch
COPY package.json ./
RUN pnpm install --frozen-lockfile --offline
COPY . .
RUN pnpm run build

# Stage 3: Production
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY package.json ./
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

EXPOSE 4000
CMD ["node", "dist/index.js"]