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

    // Fan-out to followers removed (switched to Pull model)
    // The feed is now generated on-the-fly by querying posts from followed users.

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
