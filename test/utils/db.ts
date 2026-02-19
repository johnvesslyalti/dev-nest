import { execSync } from 'child_process';
import { PrismaService } from '../../src/prisma/prisma.service';

export const migrateDb = () => {
    try {
        execSync('npx prisma db push --schema=./prisma/postgres/schema.prisma --accept-data-loss', { 
            env: {
                ...process.env,
                POSTGRES_URL: process.env.POSTGRES_URL
            },
            stdio: 'inherit' 
        });
    } catch (e) {
        console.error('Error migrating database:', e);
        throw e;
    }
};

export const resetDb = async (prisma: PrismaService) => {
  const tablenames = await prisma.$queryRaw<
    Array<{ tablename: string }>
  >`SELECT tablename::text FROM pg_tables WHERE schemaname='public'`;

  const tables = tablenames
    .map(({ tablename }) => tablename)
    .filter((name) => name !== '_prisma_migrations')
    .map((name) => `"public"."${name}"`)
    .join(', ');

  if (tables.length > 0) {
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE ${tables} CASCADE;`);
  }
};
