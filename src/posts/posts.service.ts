import { Injectable } from "@nestjs/common";
import { PostsRepository } from "./posts.repository";
import { FeedService } from "../feed/feed.service";

@Injectable()
export class PostsService {
  constructor(
    private postsRepository: PostsRepository,
    private feedService: FeedService,
  ) {}

  async create(authorId: string, content: string, imageUrl?: string) {
    const post = await this.postsRepository.create({
      authorId,
      content,
      imageUrl,
    });

    // Fan-out to followers
    const followers = await this.postsRepository.findFollowers(authorId);
    
    // Process fan-out in background (avoid awaiting to not block response)
    // Or for now, await it to ensure consistency for tests, user asked "it should through the post"
    // Let's use Promise.all for parallel processing
    const feedPostPromise = followers.map(follower => {
      return this.feedService.addToFeed(follower.followerId, {
        postId: post.id,
        content: post.content,
        authorId: post.authorId,
        createdAt: post.createdAt,
      });
    });
    
    // We can await it or let it run. For robust systems, queuing (Bull/Redis) is best.
    // For this task, awaiting ensures it's done. But might be slow for many followers.
    // Given the context (dev-nest), simple await Promise.all should suffice.
    await Promise.all(feedPostPromise);

    return post;
  }

  async findByUserName(username: string) {
    return this.postsRepository.findByUserName(username);
  }

  async findOne(id: string) {
    return this.postsRepository.findOne(id);
  }

  async findPublicFeed(cursor?: string) {
    return this.postsRepository.findPublicFeed(20, cursor);
  }
}
