import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class ProfileService {
  constructor(private prisma: PrismaService) {}

  async findUser(identifier: string, currentUserId?: string) {
    const profile = await this.prisma.user.findFirst({
      where: {
        OR: [{ id: identifier }, { username: identifier }],
      },
      select: {
        id: true,
        name: true,
        username: true,
        avatarUrl: true,
        bio: true,
        createdAt: true,
        _count: {
          select: {
            followers: true,
            following: true,
            posts: true,
          },
        },
        ...(currentUserId
          ? {
              followers: {
                where: { followerId: currentUserId },
                select: { id: true },
              },
            }
          : {}),
      },
    });

    if (!profile) return null;

    return {
      ...profile,
      isFollowing: currentUserId
        ? (profile as any).followers.length > 0
        : false,
      followers: undefined,
    };
  }

  async searchUsers(query: string) {
    if (!query || query.length < 2) return [];

    return this.prisma.user.findMany({
      where: {
        OR: [
          { username: { contains: query, mode: "insensitive" } },
          { name: { contains: query, mode: "insensitive" } },
        ],
      },
      take: 5,
      select: {
        id: true,
        name: true,
        username: true,
        avatarUrl: true,
      },
    });
  }

  async updateBio(userId: string, bio: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { bio },
      select: {
        id: true,
        name: true,
        username: true,
        avatarUrl: true,
        bio: true,
        createdAt: true,
        _count: {
          select: {
            followers: true,
            following: true,
            posts: true,
          },
        },
      },
    });
  }
}
