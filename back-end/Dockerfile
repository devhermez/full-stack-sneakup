# ---- 1) Builder: install ALL deps + build TS -> dist/ ----
FROM node:18-bullseye-slim AS builder
WORKDIR /app

# Install deps first (better cache)
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

# ---- 2) Prod deps only (no dev) ----
FROM node:18-bullseye-slim AS prod-deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

# ---- 3) Runtime (small, multi-arch friendly) ----
FROM node:18-bullseye-slim
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8080

# Use non-root user where possible
RUN useradd -m nodeuser
USER nodeuser

# Only what we need at runtime
COPY --chown=nodeuser:nodeuser --from=prod-deps /app/node_modules ./node_modules
COPY --chown=nodeuser:nodeuser --from=builder   /app/dist         ./dist
COPY --chown=nodeuser:nodeuser package*.json ./

EXPOSE 8080
CMD ["node", "dist/server.js"]