import { PrismaClient } from "@internal/mongo-client"

const getPrisma = () => new PrismaClient({
  datasources: {
    db: {
      url: process.env.MONGODB_URL
    }
  }
} as any)

const globalForMongo = global as unknown as {
  mongoPrisma?: ReturnType<typeof getPrisma>
}

export const mongoPrisma = globalForMongo.mongoPrisma || getPrisma()

if (process.env.NODE_ENV !== "production") {
  globalForMongo.mongoPrisma = mongoPrisma
}
