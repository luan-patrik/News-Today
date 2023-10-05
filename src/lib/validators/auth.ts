import { z } from "zod";

export const SignUpValidator = z
  .object({
    username: z
      .string()
      .trim()
      .regex(/^[a-zA-Z0-9]+$/, {
        message: "Use somente caracteres alfanuméricos.",
      })
      .min(6, { message: "Deve conter pelo menos 6 caracteres." })
      .max(16, { message: "Deve conter no máximo 16 caracteres." }),
    email: z
      .string()
      .trim()
      .min(6, {
        message: "Deve conter pelo menos 6 caracteres.",
      })
      .email({ message: "Email inválido." })
      .max(255, { message: "Deve conter no máximo 255 caracteres." }),
    password: z
      .string()
      .min(8, { message: "Deve conter pelo menos 8 caracteres." })
      .regex(
        new RegExp(".*[A-Z].*"),
        "Deve conter pelo menos 1 caractere maiúsculo."
      )
      .regex(
        new RegExp(".*[a-z].*"),
        "Deve conter pelo menos 1 caractere minúsculo."
      )
      .regex(new RegExp(".*\\d.*"), "Deve conter pelo menos 1 número.")
      .regex(
        new RegExp(".*[`~<>?,./!@#$%^&*()\\-_+=\"'|{}\\[\\];:\\\\].*"),
        "Deve conter pelo menos 1 caractere especial."
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Senhas não correspondem.",
  });

export const SignInValidator = z.object({
  email: z.string().min(1).max(255),
  password: z.string().min(1),
});

export type SignUpRequest = z.infer<typeof SignUpValidator>;
export type SignInRequest = z.infer<typeof SignInValidator>;
