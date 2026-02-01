import { Module } from "@nestjs/common";
import { PostsService } from "./posts.service";
import { PostsController } from "./posts.controller";
import { MulterModule } from "@nestjs/platform-express";

@Module({
  imports: [
    MulterModule.register({
      dest: "./uploads",
    }),
  ],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
