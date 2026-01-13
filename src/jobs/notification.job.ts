import { Queue, Worker } from "bullmq";
import { redisConnection } from "../config/queue";
import { prisma } from "../utils/prisma";

export const NOTIFICATION_QUEUE_NAME = "notification-queue";

export const notificationQueue = new Queue(NOTIFICATION_QUEUE_NAME, {
    connection: redisConnection,
});

export const notificationWorker = new Worker(
    NOTIFICATION_QUEUE_NAME,
    async (job) => {
        const { type, recipientId, actorId, postId, commentId } = job.data;

        console.log(`[Notification Job] Creating notification for ${recipientId}`);

        try {
            await prisma.notification.create({
                data: {
                    type,
                    recipientId,
                    actorId,
                    postId,
                    commentId,
                },
            });
            console.log(`[Notification Job] Notification created successfully`);
        } catch (error) {
            console.error(`[Notification Job] Error creating notification:`, error);
            throw error;
        }
    },
    {
        connection: redisConnection,
    }
);

notificationWorker.on("completed", (job) => {
    console.log(`[Notification Worker] Job ${job.id} completed!`);
});

notificationWorker.on("failed", (job, err) => {
    console.error(`[Notification Worker] Job ${job?.id} failed:`, err);
});
