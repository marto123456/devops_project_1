# FROM node:20-alpine

# WORKDIR /app

# COPY package*.json ./
# RUN npm install

# COPY . .

# RUN npm run build

# EXPOSE 3000

# CMD ["npm", "start"]


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
RUN npm run build

# Stage 3: Production runner
FROM node:22-alpine3.20 AS runner
WORKDIR /app
ENV NODE_ENV=production

# 🛡️ FIX CRITICAL/HIGH OS Vulnerabilities (libcrypto3, musl, zlib)
RUN apk update && apk upgrade --no-cache

# Copy only production necessities
COPY --from=deps /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

EXPOSE 3000
CMD ["npm", "start"]