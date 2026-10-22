# Base image
FROM node:lts-alpine AS base
ENV NODE_ENV=production \
    TZ=Asia/Jakarta
# https://github.com/nodejs/docker-node?tab=readme-ov-file#nodealpine
RUN apk add --no-cache gcompat
RUN apk add --no-cache tzdata && \
    ln -s /usr/share/zoneinfo/$TZ /etc/localtime
WORKDIR /app

# Install dependencies only when needed
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci --include=dev --legacy-peer-deps

# Rebuild the source code only when needed
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN ./node_modules/.bin/prisma generate
RUN npm run build && \
    npm prune --omit=dev

# Production image, copy all the files and run nest
FROM base AS runner
COPY --chown=node:node --from=builder /app/node_modules ./node_modules
COPY --chown=node:node --from=builder /app/dist ./

USER node
EXPOSE 3000
CMD ["node", "main.js"]
