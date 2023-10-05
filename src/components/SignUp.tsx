"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormControl,
  FormLabel,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import UserAuthForm from "./UserAuthForm";
import Link from "next/link";
import { signIn } from "next-auth/react";

const FormSchema = z
  .object({
    username: z
      .string()
      .trim()
      .regex(/^[a-zA-Z0-9]+$/, {
        message: "Use somente caracteres alfanuméricos",
      })
      .min(3, { message: "Deve conter pelo menos 6 caracteres" })
      .max(16, { message: "Deve conter no máximo 16 caracteres" }),
    email: z
      .string()
      .trim()
      .min(4, {
        message: "Deve conter pelo menos 4 caracteres",
      })
      .email({ message: "Email inválido" })
      .max(255, { message: "Deve conter no máximo 255 caracteres" }),
    password: z
      .string()
      .min(8, { message: "Deve conter pelo menos 8 caracteres" })
      .regex(
        new RegExp(".*[A-Z].*"),
        "Deve conter pelo menos 1 caractere maiúsculo"
      )
      .regex(
        new RegExp(".*[a-z].*"),
        "Deve conter pelo menos 1 caractere minúsculo"
      )
      .regex(new RegExp(".*\\d.*"), "Deve conter pelo menos 1 número")
      .regex(
        new RegExp(".*[`~<>?,./!@#$%^&*()\\-_+=\"'|{}\\[\\];:\\\\].*"),
        "Deve conter pelo meno 1 caractere especial"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Senhas não correspondem",
  });

const SignUp = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    setIsLoading(true);
    await axios
      .post("/api/signup", values)
      .then(() => {
        signIn("credentials", {
          email: values.email,
          password: values.password,
          redirect: true,
          callbackUrl: "/",
        });
        toast({
          title: "Sucesso",
          description: "Conta criada com sucesso :)",
        });
      })
      .catch((error) => {
        setIsLoading(false);
        toast({
          variant: "destructive",
          title: "Algo deu errado :(",
          description: "Tente novamente mais tarde",
        });
      });
  };

  const bodyContent = (
    <div className="grid gap-4 grid-cols-1">
      <Form {...form}>
        <form id="submit-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome de usuário</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    disabled={isLoading}
                    className="bg-card"
                    autoComplete="false"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    className="bg-card"
                    disabled={isLoading}
                    autoComplete="false"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Senha</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    className="bg-card"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirmar senha</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    className="bg-card"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );

  const footerContent = (
    <div className="text-foreground mt-2 font-light text-sm">
      <p>
        Já tem sua conta?{" "}
        <Link
          href="/sign-in"
          className="text-blue-500 cursor-pointer underline-offset-2 hover:underline font-semibold"
        >
          Faça login na sua conta
        </Link>
      </p>
    </div>
  );

  return (
    <UserAuthForm
      disabled={isLoading}
      title="Cadastrar"
      actionLabel="Cadastrar"
      onSubmit={form.handleSubmit(onSubmit)}
      body={bodyContent}
      footer={footerContent}
    />
  );
};

export default SignUp;
