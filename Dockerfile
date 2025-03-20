FROM node:20-alpine AS base

# Define build arguments for environment variables
ARG ARTIFACT_API_KEY
ARG ARTIFACT_API_SECRET
ARG ARTIFACT_URI
ARG CONGEAL_USERNAME
ARG MONGODB_URI

# Set environment variables for use at build time
ENV ARTIFACT_API_KEY=${ARTIFACT_API_KEY:-"not_set_at_build"}
ENV ARTIFACT_API_SECRET=${ARTIFACT_API_SECRET:-"not_set_at_build"}
ENV ARTIFACT_URI=${ARTIFACT_URI:-"not_set_at_build"}
ENV CONGEAL_USERNAME=${CONGEAL_USERNAME:-"not_set_at_build"}
ENV MONGODB_URI=${MONGODB_URI:-"not_set_at_build"}

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Pass the environment variables to the runtime container explicitly
ENV ARTIFACT_API_KEY=${ARTIFACT_API_KEY:-"not_set_at_runtime"}
ENV ARTIFACT_API_SECRET=${ARTIFACT_API_SECRET:-"not_set_at_runtime"}
ENV ARTIFACT_URI=${ARTIFACT_URI:-"not_set_at_runtime"}
ENV CONGEAL_USERNAME=${CONGEAL_USERNAME:-"not_set_at_runtime"}
ENV MONGODB_URI=${MONGODB_URI:-"not_set_at_runtime"}

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

# Expose the port the app runs on
EXPOSE 3000

# Set hostname to 0.0.0.0 to allow external connections
ENV HOSTNAME "0.0.0.0"
ENV PORT 3000

# Use node directly instead of next start
CMD ["node", "server.js"] 