FROM node:20-alpine

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* ./
COPY packages/shared/package.json ./packages/shared/
COPY apps/api-gateway/package.json ./apps/api-gateway/

RUN pnpm install --frozen-lockfile

COPY packages/shared ./packages/shared
COPY apps/api-gateway ./apps/api-gateway

RUN pnpm --filter @coop/shared build
RUN pnpm --filter @coop/api-gateway build

WORKDIR /app/apps/api-gateway

EXPOSE 3000

CMD ["node", "dist/index.js"]
