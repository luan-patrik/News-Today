import { z } from "zod";

export const PerfilValidator = z.object({
  name: z
    .string()
    .trim()
    .regex(/^[a-zA-Z0-9]+$/, {
      message: "Use somente caracteres alfanuméricos.",
    })
    .min(3, { message: "Deve conter pelo menos 6 caracteres." })
    .max(16, { message: "Deve conter no máximo 16 caracteres." }),
});

export type PerfilRequest = z.infer<typeof PerfilValidator>;
