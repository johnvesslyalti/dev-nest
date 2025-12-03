import z from "zod";

export const postSchema = z.object({
    authorId: String,
    content: String,
});

export type postInput = z.infer<typeof postSchema>