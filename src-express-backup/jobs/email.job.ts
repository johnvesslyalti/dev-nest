import { Queue, Worker } from "bullmq";
import { redisConnection } from "../config/queue";

export const EMAIL_QUEUE_NAME = "email-queue";

export const emailQueue = new Queue(EMAIL_QUEUE_NAME, {
    connection: redisConnection,
});

export const emailWorker = new Worker(
    EMAIL_QUEUE_NAME,
    async (job) => {
        const { email, name, type } = job.data;
        
        console.log(`[Email Job] Processing email for ${email} (${type})`);

        if (type === "welcome") {
            // Simulate sending email
            await new Promise((resolve) => setTimeout(resolve, 1000));
            console.log(`[Email Job] Welcome email sent to ${name} <${email}>`);
        }
    },
    {
        connection: redisConnection,
    }
);

emailWorker.on("completed", (job) => {
    console.log(`[Email Worker] Job ${job.id} completed!`);
});

emailWorker.on("failed", (job, err) => {
    console.error(`[Email Worker] Job ${job?.id} failed:`, err);
});
