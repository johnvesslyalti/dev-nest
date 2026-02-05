
require('dotenv').config();
import { PrismaClient } from "prisma-mongo-client";

const prisma = new PrismaClient();

async function main() {
  console.log('Connecting to MongoDB...');
  await prisma.$connect();
  console.log('Connected.');

  const email = `test.user.${Date.now()}@example.com`;
  console.log(`Creating user with email: ${email}`);

  const user = await prisma.user.create({
    data: {
      email: email,
      name: 'Test User',
    },
  });

  console.log('User created successfully:', user);

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error('Error:', e);
  process.exit(1);
});
