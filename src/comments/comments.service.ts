import { Injectable } from "@nestjs/common";
import { CommentsRepository } from "./comments.repository";

@Injectable()
export class CommentsService {
  constructor(private commentsRepository: CommentsRepository) {}

  async create(userId: string, postId: string, content: string) {
    return this.commentsRepository.create({
      userId,
      postId,
      content,
    });
  }

  async findByPost(postId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    return this.commentsRepository.findByPost(postId, skip, limit);
  }
}
