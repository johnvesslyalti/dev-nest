import { Router } from "express";
import { notificationController } from "./notification.controller";
import { auth } from "../../middlewares/auth";

const router = Router();

router.get("/", auth.verifyAccessToken, notificationController.getNotifications);
router.get("/unread-count", auth.verifyAccessToken, notificationController.getUnreadCount);
router.patch("/:id/read", auth.verifyAccessToken, notificationController.markAsRead);
router.patch("/read-all", auth.verifyAccessToken, notificationController.markAllAsRead);

export default router;
