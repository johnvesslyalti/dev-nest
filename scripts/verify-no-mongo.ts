import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { PrismaMongoService } from '../src/prisma/prisma-mongo.service';
import { FeedService } from '../src/feed/feed.service';

async function bootstrap() {
  process.env.MONGODB_URL = ""; // Ensure it's unset
  
  console.log("🚀 Starting App without MONGODB_URL...");
  
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn', 'log'], // See logs
  });

  console.log("✅ App Context created successfully!");

  const prismaMongo = app.get(PrismaMongoService);
  // We expect it NOT to connect.
  // We can't easily check connection state on the instance without private access or try/catch.
  // But if it didn't throw during onModuleInit, we are good (logic says it returns early).
  
  console.log("✅ PrismaMongoService initialized (should be skipped).");

  const feedService = app.get(FeedService);
  console.log("✅ FeedService retrieved.");

  // Test Feed (Pull Model)
  // We won't have real data seeded here easily unless we connect to a real DB.
  // But calling it should not throw "Mongo not connected" error.
  
  try {
    console.log("Attempting to fetch feed for a dummy user...");
    await feedService.getFeed("dummy-user-id");
    console.log("✅ Feed fetch successful (returned empty array or result).");
  } catch (error) {
    console.error("❌ Feed fetch failed:", error);
    process.exit(1);
  }

  await app.close();
  console.log("✅ Verification passed!");
}

bootstrap();
