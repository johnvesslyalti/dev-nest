import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { PrismaClient } from "prisma-mongo-client";

import { ConfigService } from "@nestjs/config";

@Injectable()
export class PrismaMongoService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(private configService: ConfigService) {
    super({});
  }
  async onModuleInit() {
    const mongoUrl = this.configService.get<string>("MONGODB_URL");
    if (!mongoUrl) {
      console.warn("⚠️ MONGODB_URL not found. Skipping MongoDB connection.");
      return;
    }
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}

