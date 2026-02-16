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
      useFactory: async (configService: ConfigService) => ({
        connection: {
          host: 'localhost',
          port: 6379,
        },
      }),
      inject: [ConfigService],
    }),
    EmailWorkerModule,
  ],
})
export class WorkerModule {}
