import { z } from "zod";

export const PostValidator = z.object({
  title: z.string().min(3).max(128).trim(),
  content: z.any(),
});

export type PostCreationRequest = z.infer<typeof PostValidator>;
