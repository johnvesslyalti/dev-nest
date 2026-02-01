import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class LikesService {
  constructor(private prisma: PrismaService) {}

  async like(userId: string, postId: string) {
    return this.prisma.like.create({
      data: { userId, postId },
    });
  }

  async unlike(userId: string, postId: string) {
    return this.prisma.like.delete({
      where: { userId_postId: { userId, postId } },
    });
  }
}
