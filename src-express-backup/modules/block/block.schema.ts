import z from "zod";

export const blockSchema = z.object({
    userId: z.string().min(1, "User ID is required"),
});

export type BlockInput = z.infer<typeof blockSchema>;
