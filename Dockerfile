# Install dependencies only when needed
FROM node:24.9-alpine AS base



FROM base as deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM node:24.9-alpine  AS builder
WORKDIR /app

#Disable Telemetry
ENV NEXT_TELEMETRY_DISABLED=1 
ARG MONGODB_URL
ENV MONGODB_URL=$MONGODB_URL

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build --production
# Install basics and build
# RUN apk add --no-cache libc6-compat


# Production image, copy all the files and run next
FROM node:24.9-alpine  AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]

