# syntax = docker/dockerfile:1

ARG NODE_VERSION=20
FROM node:${NODE_VERSION}-slim as base

# Remix app lives here
WORKDIR /app

# Set production environment
ENV NODE_ENV=production

# Install all node_modules, including dev dependencies
FROM base as deps

COPY --link package.json ./
COPY --link copy-vercel-og-files-to-build.sh ./
RUN npm install --include=dev

# Setup production node_modules
FROM base as production-deps

COPY --from=deps /app/node_modules /app/node_modules
COPY --link package.json ./
RUN npm prune --omit=dev

# Throw-away build stage to reduce size of final image
FROM base as build

# Copy build dependencies
COPY --from=deps /app/node_modules /app/node_modules

# Copy application code
COPY --link . .

# Build application
RUN npm run build
RUN npm run postinstall

# Final stage for app image
FROM gcr.io/distroless/nodejs${NODE_VERSION}-debian11

# Copy built application
COPY --from=production-deps /app/node_modules /app/node_modules
COPY --from=build /app/build /app/build
COPY --from=build /app/public /app/public
COPY --from=build /app/package.json /app/package.json

WORKDIR /app

# Set production environment
ENV NODE_ENV=production

EXPOSE 3000
CMD [ "/app/node_modules/.bin/remix-serve", "/app/build/index.js" ]
