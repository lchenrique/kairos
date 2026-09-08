FROM node:22-bookworm-slim AS build
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY frontend/package.json frontend/package.json
RUN pnpm install --frozen-lockfile
COPY frontend frontend
ARG NEXT_PUBLIC_API_URL=https://api.kairos.codebycarlos.dev
ARG NEXT_PUBLIC_AUTH_CENTRAL_URL=https://auth-central.codebycarlos.dev
ARG NEXT_PUBLIC_AUTH_CENTRAL_PRODUCT_ID=kairos
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_AUTH_CENTRAL_URL=$NEXT_PUBLIC_AUTH_CENTRAL_URL
ENV NEXT_PUBLIC_AUTH_CENTRAL_PRODUCT_ID=$NEXT_PUBLIC_AUTH_CENTRAL_PRODUCT_ID
RUN pnpm --filter @kairos/frontend build

FROM node:22-bookworm-slim AS runtime
WORKDIR /app
RUN corepack enable
COPY --from=build /app /app
ENV NODE_ENV=production
EXPOSE 3000
CMD ["pnpm", "--filter", "@kairos/frontend", "start"]
