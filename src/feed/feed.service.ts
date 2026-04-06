import { Injectable, Inject } from "@nestjs/common";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";
import { InjectQueue } from "@nestjs/bullmq";
import { Queue } from "bullmq";
import { FeedRepository } from "./feed.repository";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class FeedService {
  constructor(
    private readonly feedRepository: FeedRepository,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private prisma: PrismaService,
    @InjectQueue("feed-fanout") private feedFanoutQueue: Queue,
  ) {}

  async getFeed(userId: string, take: number = 20, cursor?: string) {
    // We now read from pre-computed feed (delegated to repository)
    return this.feedRepository.findByUserId(userId, take, cursor);
  }

  async dispatchFanout(post: any) {
    // Add job to background queue
    await this.feedFanoutQueue.add("fanout", {
      postId: post.id,
      authorId: post.authorId,
      createdAt: new Date(post.createdAt).getTime(),
    });

    // Also invalidate the author's own cached first page? 
    // Actually, FeedRepository will now handle pre-computation.
    // For the author, they might want to see their own post immediately.
    await this.cacheManager.del(`feed:${post.authorId}:first_page`);
  }
}
