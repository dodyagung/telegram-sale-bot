# Base image
FROM node:lts-alpine AS base
# https://github.com/nodejs/docker-node?tab=readme-ov-file#nodealpine
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies only when needed
FROM base AS deps
COPY package.json pnpm-lock.yaml* ./
RUN corepack enable pnpm
RUN pnpm i --frozen-lockfile  

# Rebuild the source code only when needed
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN corepack enable pnpm
RUN pnpm dlx prisma generate
RUN pnpm build
RUN pnpm prune --prod --no-optional

# Production image, copy all the files and run nest
FROM base AS runner
ENV NODE_ENV production
ENV DEBUG telegraf:*
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs
COPY --from=builder --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/dist ./

USER nestjs
EXPOSE 3000
CMD ["node", "main.js"]
