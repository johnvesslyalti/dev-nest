import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { Comment, Prisma } from "../generated/prisma/client";

@Injectable()
export class CommentsRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.CommentUncheckedCreateInput): Promise<Comment> {
    return this.prisma.comment.create({
      data,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
    });
  }

  async findByPost(postId: string, skip: number, take: number) {
    return this.prisma.comment.findMany({
      where: { postId },
      orderBy: { createdAt: "desc" },
      skip,
      take,
      select: {
        id: true,
        content: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            username: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
    });
  }
}
