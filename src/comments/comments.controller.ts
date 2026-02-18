import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
  UseInterceptors,
} from "@nestjs/common";
import { CommentsService } from "./comments.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { ThrottlerGuard } from "@nestjs/throttler";
import { CacheInterceptor, CacheTTL } from "@nestjs/cache-manager";

import { CreateCommentDto } from "./dto/create-comment.dto";

@UseGuards(ThrottlerGuard)
@Controller("posts/:postId/comments")
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Req() req: any,
    @Param("postId") postId: string,
    @Body() body: CreateCommentDto,
  ) {
    const comment = await this.commentsService.create(
      req.user.id,
      postId,
      body.content,
    );
    return { message: "Comment added", comment };
  }

  @UseInterceptors(CacheInterceptor)
  @CacheTTL(30000) // 30 seconds
  @Get()
  async findByPost(
    @Param("postId") postId: string,
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 20,
  ) {
    return this.commentsService.findByPost(postId, Number(page), Number(limit));
  }
}
