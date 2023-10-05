"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import axios from "axios";
import Link from "next/link";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { SignUpValidator } from "@/lib/validators/auth";

type FormData = z.infer<typeof SignUpValidator>;

const SignUp = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(SignUpValidator),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: FormData) => {
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
          title: "Sucesso.",
          description: "Sua conta foi criada.",
          variant: "default",
        });
      })
      .catch((error) => {
        setIsLoading(false);
        toast({
          title: "Algo deu errado.",
          description: "Erro ao criar sua conta. Tente novamente mais tarde.",
          variant: "destructive",
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
