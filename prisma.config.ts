import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: './prisma/postgres/schema.prisma',
  datasource: {
    url: process.env.POSTGRES_URL,
  },
});
