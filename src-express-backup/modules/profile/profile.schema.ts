import z from "zod";

export const updateProfileSchema = z.object({
    bio: z.string().max(160, "Bio too long"),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
