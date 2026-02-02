import { Module } from "@nestjs/common";
import { PostsService } from "./posts.service";
import { PostsController } from "./posts.controller";
import { PostsRepository } from "./posts.repository";
import { PrismaModule } from "../prisma/prisma.module";
import { MulterModule } from "@nestjs/platform-express";

@Module({
  imports: [
    PrismaModule,
    MulterModule.register({
      dest: "./uploads",
    }),
  ],
  controllers: [PostsController],
  providers: [PostsService, PostsRepository],
})
export class PostsModule {}
