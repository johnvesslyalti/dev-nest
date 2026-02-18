import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ThrottlerModule } from "@nestjs/throttler";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ThrottlerStorageRedisService } from "./common/throttler-storage-redis.service";
import { BullModule } from "@nestjs/bullmq"
import { RedisCacheModule } from "./common/cache/cache.module";
import { AuthModule } from "./auth/auth.module";
import { PrismaModule } from "./prisma/prisma.module";
import { UsersModule } from "./users/users.module";
import { ProfileModule } from "./profile/profile.module";
import { PostsModule } from "./posts/posts.module";
import { CommentsModule } from "./comments/comments.module";
import { LikesModule } from "./likes/likes.module";
import { LoggingMiddleware } from "./common/middleware/logging.middleware";

import { FeedModule } from "./feed/feed.module";
import { EmailModule } from "./email/email.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        connection: {
          host: 'localhost',
          port: 6379,
        },
      }),
      inject: [ConfigService],
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        throttlers: [{ ttl: 60000, limit: 10 }],
        storage: new ThrottlerStorageRedisService(config),
      }),
    }),
    PrismaModule,
    RedisCacheModule,
    AuthModule,
    UsersModule,
    ProfileModule,
    PostsModule,
    CommentsModule,
    LikesModule,
    FeedModule,
    EmailModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
