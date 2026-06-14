# FROM node:20-alpine

# WORKDIR /app

# COPY package*.json ./
# RUN npm install

# COPY . .

# EXPOSE 5000

# CMD ["npm", "start"]



# Stage 1: Install dependencies
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
RUN cp -R node_modules prod_node_modules
RUN npm ci

# Stage 2: Build code if needed (or verify TypeScript)
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# If your backend has a build step, uncomment the line below:
# RUN npm run build

# Stage 3: Clean production runtime
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=deps /app/prod_node_modules ./node_modules
COPY . .

EXPOSE 5000
CMD ["npm", "start"]