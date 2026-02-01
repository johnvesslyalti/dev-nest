import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async create(authorId: string, content: string, imageUrl?: string) {
    return this.prisma.post.create({
      data: { authorId, content, imageUrl },
    });
  }

  async findByUserName(username: string) {
    return this.prisma.post.findMany({
      where: {
        author: { username },
      },
      select: {
        id: true,
        content: true,
        imageUrl: true,
        createdAt: true,
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            avatarUrl: true,
          },
        },
        _count: { select: { likes: true, comments: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async findOne(id: string) {
    return this.prisma.post.findUnique({
      where: { id },
      select: {
        id: true,
        content: true,
        imageUrl: true,
        createdAt: true,
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            avatarUrl: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    });
  }

  async findPublicFeed(cursor?: string) {
    return this.prisma.post.findMany({
      take: 20,
      ...(cursor && {
        skip: 1,
        cursor: { id: cursor },
      }),
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        content: true,
        imageUrl: true,
        createdAt: true,
        author: {
          select: {
            id: true,
            username: true,
            avatarUrl: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    });
  }
}
