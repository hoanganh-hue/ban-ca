## Production dockerfile for client without root workspaces
FROM node:18-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app

FROM base AS deps
WORKDIR /app

# Copy manifests for caching
COPY shared/package.json shared/package.json
COPY client/package.json client/package.json

# Install deps for shared and client
RUN npm install --prefix shared \
 && npm install --prefix client \
 && npm cache clean --force

FROM base AS builder
WORKDIR /app

# Copy node_modules from deps
COPY --from=deps /app/shared/node_modules shared/node_modules
COPY --from=deps /app/client/node_modules client/node_modules

# Copy source
COPY . .

# Build shared then client
RUN npm --prefix shared run build \
 && npm --prefix client install /app/shared \
 && npm --prefix client run build

FROM nginx:alpine AS runner

# Copy built assets
COPY --from=builder /app/client/dist /var/www/html

# Copy nginx config
COPY nginx/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
