import { Module } from "@nestjs/common";
import { CacheModule } from "@nestjs/cache-manager";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { redisStore } from "cache-manager-redis-yet";
import { LikesService } from "./likes.service";
import { LikesController } from "./likes.controller";
import { LikesRepository } from "./likes.repository";
import { PrismaModule } from "../prisma/prisma.module";

@Module({
  imports: [
    PrismaModule,
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        store: await redisStore({
          socket: {
            host: configService.get<string>("REDIS_HOST") || "localhost",
            port: parseInt(configService.get<string>("REDIS_PORT")!) || 6379,
          },
        }),
      }),
    }),
  ],
  controllers: [LikesController],
  providers: [LikesService, LikesRepository],
})
export class LikesModule {}
