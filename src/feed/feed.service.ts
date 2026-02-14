import { Injectable } from '@nestjs/common';
import { FeedRepository } from './feed.repository';

@Injectable()
export class FeedService {
  constructor(private readonly feedRepository: FeedRepository) {}

  async getFeed(userId: string) {
    const feed = await this.feedRepository.findByUserId(userId);
    return feed?.posts || [];
  }

  async addToFeed(userId: string, postData: any) {
    return this.feedRepository.upsertFeedPost(userId, postData);
  }
}
