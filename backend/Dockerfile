FROM node:22-bookworm-slim AS build
WORKDIR /app
RUN corepack enable
RUN apt-get update && apt-get install -y --no-install-recommends openssl && rm -rf /var/lib/apt/lists/*
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json backend/package.json
RUN pnpm install --frozen-lockfile
COPY backend backend
RUN pnpm --filter @kairos/backend exec prisma generate && pnpm --filter @kairos/backend build

FROM node:22-bookworm-slim AS runtime
WORKDIR /app
RUN corepack enable
RUN apt-get update && apt-get install -y --no-install-recommends openssl && rm -rf /var/lib/apt/lists/*
RUN mkdir -p /app/data
COPY --from=build /app /app
ENV NODE_ENV=production
EXPOSE 3333
CMD ["node", "/app/backend/dist/server.js"]
