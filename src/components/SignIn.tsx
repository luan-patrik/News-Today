"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel } from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import UserAuthForm from "./UserAuthForm";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

const FormSchema = z.object({
  email: z.string().min(1).max(255),
  password: z.string().min(1),
});

const SignIn = () => {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [passwordIsVisible, setPasswordIsVisible] = useState<boolean>(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    setIsLoading(true);

    const res = await signIn("credentials", {
      ...values,
      redirect: false,
    });

    if (res?.error) {
      setIsLoading(false);
      return toast({
        variant: "destructive",
        title: "Algo deu errado :(",
        description: "Credenciais Inválidas",
      });
    } else {
      router.push("/");
      router.refresh();
      return toast({ title: "Sucesso", description: "Entrou com sucesso :)" });
    }
  };

  const showPassword = () => {
    setPasswordIsVisible((passwordVisible) => !passwordVisible);
  };

  const bodyContent = (
    <div className="grid gap-4 grid-cols-1">
      <Form {...form}>
        <form id="submit-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    id="email"
                    type="email"
                    className="bg-card"
                    autoComplete="false"
                    {...field}
                  />
                </FormControl>
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
                  <div className="relative flex">
                    <Input
                      id="password"
                      className="pr-12 bg-card"
                      type={passwordIsVisible ? "text" : "password"}
                      {...field}
                    />

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 hover:bg-transparent"
                      onClick={showPassword}
                    >
                      {passwordIsVisible ? <EyeOff /> : <Eye />}
                    </Button>
                  </div>
                </FormControl>
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
        Primeira vez?{" "}
        <Link
          href="/sign-up"
          className="text-blue-500 cursor-pointer underline-offset-2 hover:underline font-semibold"
        >
          Crie sua conta
        </Link>
      </p>
    </div>
  );

  return (
    <UserAuthForm
      disabled={isLoading}
      title="Entrar"
      actionLabel="Entrar"
      onSubmit={form.handleSubmit(onSubmit)}
      body={bodyContent}
      footer={footerContent}
    />
  );
};

export default SignIn;
