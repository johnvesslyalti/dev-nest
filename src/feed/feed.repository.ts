import { Injectable } from '@nestjs/common';
import { PrismaMongoService } from '../prisma/prisma-mongo.service';

@Injectable()
export class FeedRepository {
  constructor(private readonly prisma: PrismaMongoService) {}

  async findByUserId(userId: string) {
    return this.prisma.feed.findFirst({
      where: { userId },
    });
  }

  async upsertFeedPost(userId: string, postData: any) {
    const existingFeed = await this.prisma.feed.findFirst({
      where: { userId },
    });

    if (existingFeed) {
      const currentPosts = (existingFeed.posts as any[]) || [];
      currentPosts.push(postData);
      return this.prisma.feed.update({
        where: { id: existingFeed.id },
        data: {
          posts: currentPosts,
        },
      });
    } else {
      const doc = {
        userId,
        posts: [postData],
        createdAt: { $date: new Date().toISOString() },
        updatedAt: { $date: new Date().toISOString() },
      };

      await this.prisma.$runCommandRaw({
        insert: "Feed",
        documents: [doc],
      });
      return doc;
    }
  }
}
