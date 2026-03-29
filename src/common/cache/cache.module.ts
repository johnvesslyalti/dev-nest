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
      useFactory: async (configService: ConfigService) => {
        const redisUrlStr = configService.get<string>('REDIS_URL') || 'redis://localhost:6379';
        return {
          store: await redisStore({
            url: redisUrlStr,
            ttl: 600, // Default 10 minutes
          }),
        };
      },
    }),
  ],
  exports: [CacheModule],
})
export class RedisCacheModule {}
