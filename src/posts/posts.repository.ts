// src/post/posts.repository.ts
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { Post, Prisma } from "@internal/postgres-client";

@Injectable()
export class PostsRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.PostUncheckedCreateInput): Promise<Post> {
    return this.prisma.post.create({
      data,
    });
  }

  async findByUserName(username: string) {
    return this.prisma.post.findMany({
      where: {
        author: { 
          username,
          deletedAt: null
        },
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

  async findPublicFeed(take: number, cursor?: string) {
    const cursorPost = cursor
      ? await this.prisma.post.findUnique({
          where: { id: cursor },
          select: { id: true, createdAt: true },
        })
      : null;

    if (cursor && !cursorPost) {
      return [];
    }

    return this.prisma.post.findMany({
      take,
      where: {
        author: { deletedAt: null },
        ...(cursorPost && {
          OR: [
            { createdAt: { lt: cursorPost.createdAt } },
            {
              AND: [
                { createdAt: cursorPost.createdAt },
                { id: { lt: cursorPost.id } },
              ],
            },
          ],
        }),
      },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
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
  async findFollowers(userId: string) {
    return this.prisma.follow.findMany({
      where: {
        followingId: userId,
      },
      select: {
        followerId: true,
      },
    });
  }
}
