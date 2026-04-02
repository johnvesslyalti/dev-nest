import { Module } from "@nestjs/common";
import { BullModule } from "@nestjs/bullmq";
import { FeedController } from "./feed.controller";
import { FeedService } from "./feed.service";
import { FeedRepository } from "./feed.repository";
import { FeedFanoutProcessor } from "./feed.fanout.processor";
import { PrismaModule } from "../prisma/prisma.module";

@Module({
  imports: [
    PrismaModule,
    BullModule.registerQueue({
      name: "feed-fanout",
    }),
  ],
  controllers: [FeedController],
  providers: [FeedService, FeedRepository, FeedFanoutProcessor],
  exports: [FeedService],
})
export class FeedModule {}
