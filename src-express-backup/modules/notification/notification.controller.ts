import { Request, Response } from "express";
import { notificationService } from "./notification.service";

export const notificationController = {
  getNotifications: async (req: Request, res: Response) => {
    try {
      // @ts-ignore - userId is added by auth middleware
      const userId = req.user.id;
      const notifications = await notificationService.getUserNotifications(userId);
      res.json(notifications);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  markAsRead: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await notificationService.markAsRead(id);
      res.json({ message: "Notification marked as read" });
    } catch (error) {
       console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  markAllAsRead: async (req: Request, res: Response) => {
    try {
      // @ts-ignore - userId is added by auth middleware
      const userId = req.user.id;
      await notificationService.markAllAsRead(userId);
      res.json({ message: "All notifications marked as read" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },


  getUnreadCount: async (req: Request, res: Response) => {
    try {
      // @ts-ignore - userId is added by auth middleware
      const userId = req.user.id;
      const count = await notificationService.getUnreadCount(userId);
      res.json({ count });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};
