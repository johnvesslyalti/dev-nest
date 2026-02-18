import { Injectable } from '@nestjs/common';
import { FeedRepository } from './feed.repository';

@Injectable()
export class FeedService {
  constructor(private readonly feedRepository: FeedRepository) {}

  async getFeed(userId: string) {
    return this.feedRepository.findByUserId(userId);
  }

  async addToFeed(userId: string, postData: any) {
    // No-op for Pull model
    return;
  }
}
