# Base image
FROM node:lts-alpine AS base
# https://github.com/nodejs/docker-node?tab=readme-ov-file#nodealpine
RUN apk add --no-cache gcompat openssl
RUN corepack enable pnpm
WORKDIR /app

# Install dependencies only when needed
FROM base AS deps
COPY package.json pnpm-lock.yaml* prisma ./
RUN pnpm i --frozen-lockfile  

# Rebuild the source code only when needed
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN ./node_modules/.bin/prisma generate
RUN pnpm build
RUN pnpm prune --prod --no-optional

# Production image, copy all the files and run nest
FROM base AS runner
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs
COPY --from=builder --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/dist ./

USER nestjs
EXPOSE 3000
CMD ["node", "main.js"]
