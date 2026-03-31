import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class FeedRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByUserId(userId: string, take: number = 20, cursor?: string) {
    const cursorPost = cursor
      ? await this.prisma.post.findUnique({
          where: { id: cursor },
          select: { id: true, createdAt: true },
        })
      : null;

    if (cursor && !cursorPost) {
      return { items: [], nextCursor: null };
    }

    // Pull model: Find posts from users that the current user follows
    const posts = await this.prisma.post.findMany({
      take: take + 1,
      where: {
        author: {
          followers: {
            some: {
              followerId: userId,
            },
          },
        },
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
      include: {
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
        likes: {
          where: {
            userId: userId,
          },
          select: {
            userId: true,
          },
        },
      },
    });

    const hasNextPage = posts.length > take;
    const items = hasNextPage ? posts.slice(0, take) : posts;
    const nextCursor = hasNextPage ? items[items.length - 1].id : null;

    return { items, nextCursor };
  }

  // Deprecated/No-op for Pull model
  async upsertFeedPost(userId: string, postData: any) {
    return;
  }
}
