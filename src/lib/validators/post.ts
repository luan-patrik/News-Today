import { z } from "zod";

export const PostValidator = z.object({
  title: z
    .string()
    .min(3, { message: "Deve conter pelo menos 3 caracteres." })
    .max(128, { message: "Deve conter no máximo 128 caracteres." })
    .trim(),
  content: z.any(),
});

export type PostCreationRequest = z.infer<typeof PostValidator>;
