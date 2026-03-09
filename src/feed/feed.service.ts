import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { FeedRepository } from './feed.repository';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FeedService {
  constructor(
    private readonly feedRepository: FeedRepository,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private prisma: PrismaService,
  ) {}

  async getFeed(userId: string) {
    const cacheKey = `feed:${userId}`;
    const cachedFeed = await this.cacheManager.get(cacheKey);
    if (cachedFeed) {
      return cachedFeed;
    }

    const feed = await this.feedRepository.findByUserId(userId);
    await this.cacheManager.set(cacheKey, feed, 60000); // 60s TTL
    return feed;
  }

  async addToFeed(userId: string, postData: any) {
    // Invalidate the cache for all followers since a new post was created
    const followers = await this.prisma.follow.findMany({
      where: { followingId: userId },
      select: { followerId: true },
    });

    await Promise.all(
      followers.map((f) => this.cacheManager.del(`feed:${f.followerId}`))
    );
  }
}
