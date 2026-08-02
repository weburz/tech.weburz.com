###############################################################################
# Development image
#
# GitHub Pages serves the static `nuxt generate` output, so the only Docker
# stage we ship is the local dev server. Runs as the pre-existing `node` user
# (uid 1000, gid 1000 in node:*-alpine) so writes from the dev server into
# bind-mounted paths (.nuxt, .output, .data, etc.) land with the same uid as
# the host user instead of root.
###############################################################################
FROM node:25-alpine AS development

RUN corepack enable && corepack prepare pnpm@11.1.3 --activate

WORKDIR /app

RUN chown -R node:node /app

USER node

COPY --chown=node:node package.json pnpm-lock.yaml pnpm-workspace.yaml* ./

RUN --mount=type=cache,id=pnpm,target=/pnpm/store,uid=1000,gid=1000 \
    pnpm install --frozen-lockfile

EXPOSE 3001

CMD ["pnpm", "run", "dev"]
