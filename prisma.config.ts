import { defineConfig } from 'prisma/config';
import * as dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  schema: './prisma/postgres/schema.prisma',
  datasource: {
    url: process.env.POSTGRES_URL,
  },
});
