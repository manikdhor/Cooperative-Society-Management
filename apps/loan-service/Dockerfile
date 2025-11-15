FROM node:20-alpine

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* ./
COPY packages/shared/package.json ./packages/shared/
COPY apps/loan-service/package.json ./apps/loan-service/

RUN pnpm install --frozen-lockfile

COPY packages/shared ./packages/shared
COPY apps/loan-service ./apps/loan-service

RUN pnpm --filter @coop/shared build
RUN pnpm --filter @coop/member-service build

WORKDIR /app/apps/loan-service

EXPOSE 3002

CMD ["node", "dist/index.js"]
