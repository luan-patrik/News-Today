import { z } from "zod";

export const CommentValidator = z.object({
  postId: z.string(),
  text: z
    .string()
    .trim()
    .min(1, { message: "Deve conter pelo menos 1 caracter." })
    .max(128, { message: "Deve conter no máximo 128 caracteres." }),
  replyToId: z.string().optional(),
});

export type CommentRequest = z.infer<typeof CommentValidator>;
