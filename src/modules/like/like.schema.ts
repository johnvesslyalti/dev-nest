import z from "zod";

export const likeSchema = z.object({
    userId: z.string(),
    postId: z.string()
})

export type likeInput = z.infer<typeof likeSchema>