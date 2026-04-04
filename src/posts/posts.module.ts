import { Module } from "@nestjs/common";
import { BullModule } from "@nestjs/bullmq";
import { PostsService } from "./posts.service";
import { PostsController } from "./posts.controller";
import { PostsRepository } from "./posts.repository";
import { PrismaModule } from "../prisma/prisma.module";
import { FeedModule } from "../feed/feed.module";
import { OpenAIModule } from "../common/openai/openai.module";
import { PostEnhancementProcessor } from "./post-enhancement.processor";

@Module({
  imports: [
    PrismaModule,
    FeedModule,
    OpenAIModule,
    BullModule.registerQueue({
      name: "post-enhancement",
    }),
  ],
  controllers: [PostsController],
  providers: [PostsService, PostsRepository, PostEnhancementProcessor],
})
export class PostsModule {}
