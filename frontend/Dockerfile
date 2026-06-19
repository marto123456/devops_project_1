# Stage 1: Install dependencies
FROM node:22-alpine3.20 AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Stage 2: Build the source code
FROM node:22-alpine3.20 AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Stage 3: Production runner
FROM node:22-alpine3.20 AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# 🛡️ Fix Critical/High OS Vulnerabilities immediately in the clean runner environment
RUN apk update && apk upgrade --no-cache

# Copy only production necessities from previous stages
COPY --from=deps /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# 🔒 Hadolint Fix: Drop root privileges and switch execution to the built-in non-root user
USER node

EXPOSE 3000

CMD ["npm", "start"]