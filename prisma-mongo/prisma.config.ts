import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma-mongo/schema.prisma",
  migrations: {
    path: "prisma-mongo/migrations",
  },
  datasource: {
    url: env("MONGODB_URL"),
  },
});