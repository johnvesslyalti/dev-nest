#!/usr/bin/env bash
set -e

# Install dependencies
npm ci

# Lint code
npm run lint

# Build the project
npm run build

# Migration safety check (dry run)
npx prisma migrate dev --schema=./prisma/postgres/schema.prisma --skip-generate --dry-run

# Run end-to-end tests
npm run test:e2e
