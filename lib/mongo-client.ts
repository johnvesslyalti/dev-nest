import { PrismaClient } from "../prisma-mongo/mongo-client"

const getPrisma = () => new PrismaClient()

const globalForMongo = global as unknown as {
  mongoPrisma?: ReturnType<typeof getPrisma>
}

export const mongoPrisma = globalForMongo.mongoPrisma || getPrisma()

if (process.env.NODE_ENV !== "production") {
  globalForMongo.mongoPrisma = mongoPrisma
}
