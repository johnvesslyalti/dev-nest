import z from "zod";

export const commentSchema = z.object({
    userId: z.string(),
    content: z.string(),
});

export type commentInput = z.infer<typeof commentSchema>