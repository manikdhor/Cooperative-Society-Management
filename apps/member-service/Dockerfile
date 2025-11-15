FROM node:20-alpine

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* ./
COPY packages/shared/package.json ./packages/shared/
COPY apps/member-service/package.json ./apps/member-service/

RUN pnpm install --frozen-lockfile

COPY packages/shared ./packages/shared
COPY apps/member-service ./apps/member-service

RUN pnpm --filter @coop/shared build
RUN pnpm --filter @coop/member-service build

WORKDIR /app/apps/member-service

EXPOSE 3001

CMD ["node", "dist/index.js"]
