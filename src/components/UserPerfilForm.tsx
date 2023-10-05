"use client";

import { HTMLAttributes } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { User } from "@prisma/client";
import { z } from "zod";
import { useSession } from "next-auth/react";
import { PerfilRequest, PerfilValidator } from "@/lib/validators/perfil";
import { Card, CardContent, CardFooter } from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";
import { cn } from "@/lib/utils";

interface UserPerfilFormProps extends HTMLAttributes<HTMLFormElement> {
  user: Pick<User, "id" | "username">;
}

type FormData = z.infer<typeof PerfilValidator>;

const UserPerfilForm = ({ user, className, ...props }: UserPerfilFormProps) => {
  const { update } = useSession();
  const router = useRouter();
  const { toast } = useToast();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(PerfilValidator),
    defaultValues: {
      name: user?.username || "",
    },
  });
  const { mutate: updateUser, isLoading } = useMutation({
    mutationFn: async ({ name }: PerfilRequest) => {
      const payload: PerfilRequest = { name };

      const { data } = await axios.patch(`/api/settings/perfil`, payload);

      return data;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 409) {
          return toast({
            title: "Nome de usuário já existe.",
            description: "Tente colocar um nome diferente.",
            variant: "destructive",
          });
        }
      }
      return toast({
        title: "Algo deu errado.",
        description:
          "Seu nome de usuário não foi alterado. Tente novamente mais tarde.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      update();
      toast({
        title: "Sucesso.",
        description: "Nome de usuário alterado.",
        variant: "default",
      });
      router.refresh();
    },
  });

  return (
    <form
      className={cn(className)}
      onSubmit={handleSubmit((e) => updateUser(e))}
      {...props}
    >
      <Card className="bg-background border-none p-0 shadow-none">
        <CardContent className="px-0 py-2">
          <div className="relative grid gap-4">
            <div>
              <Label className="py-2 px-0 text-sm" htmlFor="username">
                Nome de usuário
              </Label>
              <Input
                id="username"
                className="w-full pl-4 bg-card"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-xs font-medium text-destructive mt-2">
                  {errors.name.message}
                </p>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-0">
          <Button
            disabled={isLoading}
            variant="done"
            className="w-full"
            type="submit"
          >
            Salvar
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default UserPerfilForm;
