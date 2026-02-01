import { prisma } from "../../utils/prisma";

export const notificationService = {
  getUserNotifications: async (userId: string) => {
    return prisma.notification.findMany({
      where: {
        recipientId: userId,
      },
      include: {
        actor: {
          select: {
            id: true,
            username: true,
            name: true,
            avatarUrl: true,
          },
        },
        post: {
          select: {
            id: true,
            content: true,
          },
        },
        comment: {
          select: {
            id: true,
            content: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  markAsRead: async (notificationId: string) => {
    return prisma.notification.update({
      where: { id: notificationId },
      data: { read: true },
    });
  },

  markAllAsRead: async (userId: string) => {
    return prisma.notification.updateMany({
      where: {
        recipientId: userId,
        read: false,
      },
      data: {
        read: true,
      },
    });
  },


  getUnreadCount: async (userId: string) => {
    return prisma.notification.count({
      where: {
        recipientId: userId,
        read: false,
      },
    });
  },
};
