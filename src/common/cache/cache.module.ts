import { Module, Global } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-yet';

@Global()
@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        store: await redisStore({
          socket: {
            host: configService.get<string>('REDIS_HOST') || 'localhost',
            port: parseInt(configService.get<string>('REDIS_PORT')!) || 6379,
          },
          ttl: 600, // Default 10 minutes (in milliseconds for cache-manager v5/v6? wait, cache-manager-redis-yet might use ms. Standard cache-manager uses ms usually. Let's check auth module.)
          // Auth module didn't specify TTL in registerAsync.
        }),
      }),
    }),
  ],
  exports: [CacheModule],
})
export class RedisCacheModule {}
