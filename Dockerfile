# Install dependencies only when needed
FROM node:20.12-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm --legacy-peer-deps ci

# Rebuild the source code only when needed
FROM node:20.12-alpine AS builder
WORKDIR /app

#Disable Telemetry
ENV NEXT_TELEMETRY_DISABLED=1 

# Add these lines before your RUN npm run build command
ARG MONGODB_URL
ARG AUTH_SECRET
ARG NEXTAUTH_URL

# Make them available as environment variables during build
ENV MONGODB_URL=$MONGODB_URL
ENV AUTH_SECRET=$AUTH_SECRET
ENV NEXTAUTH_URL=$NEXTAUTH_URL

COPY . .
COPY --from=deps /app/node_modules ./node_modules

# Install basics and build
RUN apk add --no-cache libc6-compat
CMD ["npm","build"]

# Production image, copy all the files and run next
FROM node:20.12-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Create non-root user
RUN addgroup --system --gid 1001 appgroup && \
    adduser --system --uid 1001 --ingroup appgroup appuser && \
    chown -R appuser:appgroup .

USER appuser

EXPOSE 3000

CMD ["npm", "start"]

