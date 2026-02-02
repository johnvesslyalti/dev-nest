import { Injectable } from "@nestjs/common";
import { PostsRepository } from "./posts.repository";

@Injectable()
export class PostsService {
  constructor(private postsRepository: PostsRepository) {}

  async create(authorId: string, content: string, imageUrl?: string) {
    return this.postsRepository.create({
      authorId,
      content,
      imageUrl,
    });
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
