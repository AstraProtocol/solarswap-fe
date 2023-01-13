# Install dependencies only when needed
FROM node:18-alpine AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
RUN apk add git
ENV PYTHONUNBUFFERED=1
RUN apk add --update --no-cache python3 && ln -sf python3 /usr/bin/python
RUN python3 -m ensurepip
RUN pip3 install --no-cache --upgrade pip setuptools
ARG GITHUB_TOKEN
RUN npm config set "@astraprotocol:registry" "https://npm.pkg.github.com"
RUN npm config set "//npm.pkg.github.com/:_authToken" "${GITHUB_TOKEN}"
WORKDIR /app
COPY package.json yarn.lock ./
COPY . .
RUN GITHUB_PACKAGE_TOKEN=${GITHUB_TOKEN} yarn --frozen-lockfile


# Rebuild the source code only when needed
FROM node:18-alpine AS builder
WORKDIR /app

ARG ASTRA_SENTRY_AUTH_TOKEN
ARG NEXT_PUBLIC_CHAIN_ID
ARG NEXT_PUBLIC_NODE_1
ARG NEXT_PUBLIC_NODE_2
ARG NEXT_PUBLIC_NODE_3
ARG NEXT_PUBLIC_NODE_PRODUCTION
ARG NEXT_PUBLIC_HOST
ARG NEXT_PUBLIC_EXPLORER
ARG NEXT_PUBLIC_GTAG
ARG NEXT_PUBLIC_FEE
ARG NEXT_PUBLIC_TITLE
ARG NEXT_PUBLIC_WALLET_CONNECT_RELAY

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/src ./src
COPY . . 
RUN ASTRA_SENTRY_AUTH_TOKEN=${ASTRA_SENTRY_AUTH_TOKEN} \
    NEXT_PUBLIC_CHAIN_ID=${NEXT_PUBLIC_CHAIN_ID} \
    NEXT_PUBLIC_NODE_1=${NEXT_PUBLIC_NODE_1} \
    NEXT_PUBLIC_NODE_2=${NEXT_PUBLIC_NODE_2} \
    NEXT_PUBLIC_NODE_3=${NEXT_PUBLIC_NODE_3} \
    NEXT_PUBLIC_NODE_PRODUCTION=${NEXT_PUBLIC_NODE_PRODUCTION} \
    NEXT_PUBLIC_HOST=${NEXT_PUBLIC_HOST} \
    NEXT_PUBLIC_EXPLORER=${NEXT_PUBLIC_EXPLORER} \
    NEXT_PUBLIC_GTAG=${NEXT_PUBLIC_GTAG} \
    NEXT_PUBLIC_FEE=${NEXT_PUBLIC_FEE} \
    NEXT_PUBLIC_TITLE=${NEXT_PUBLIC_TITLE} \
    NEXT_PUBLIC_WALLET_CONNECT_RELAY=${NEXT_PUBLIC_WALLET_CONNECT_RELAY} \
    yarn build

# Production image, copy all the files and run next
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# You only need to copy next.config.js if you are NOT using the default configuration
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Automatically leverage output traces to reduce image size 
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/ ./.next/

USER nextjs

EXPOSE 3000

CMD ["yarn", "start"]