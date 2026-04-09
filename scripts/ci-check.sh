#!/usr/bin/env bash
set -e

# Install dependencies
npm ci

# Lint code
npm run lint:check

# Build the project
npm run build

# Validate Prisma schema
npm run prisma:validate

# Apply committed migrations
npm run migrate:deploy

# Run end-to-end tests
npm run test:e2e:ci
