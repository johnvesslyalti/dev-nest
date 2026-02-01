import z from "zod";

export const likeSchema = z.object({
    postId: z.string().min(1, "Post ID is required"),
});

export type likeInput = z.infer<typeof likeSchema>