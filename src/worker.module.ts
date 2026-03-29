import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import { PrismaModule } from './prisma/prisma.module';
import { EmailWorkerModule } from './email/email.worker.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const redisUrl = new URL(configService.get<string>('REDIS_URL') || 'redis://localhost:6379');
        return {
          connection: {
            host: redisUrl.hostname,
            port: parseInt(redisUrl.port, 10) || 6379,
            username: redisUrl.username || undefined,
            password: redisUrl.password || undefined,
            db: redisUrl.pathname ? parseInt(redisUrl.pathname.slice(1), 10) : undefined,
          },
        };
      },
      inject: [ConfigService],
    }),
    EmailWorkerModule,
  ],
})
export class WorkerModule {}
