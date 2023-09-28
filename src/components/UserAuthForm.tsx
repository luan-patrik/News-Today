"use client";

import { signIn } from "next-auth/react";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { ReactElement, useCallback, useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { ChevronLeft, X } from "lucide-react";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  onSubmit: () => void;
  title?: string;
  body?: ReactElement;
  footer?: ReactElement;
  actionLabel: string;
  disabled?: boolean;
}

const UserAuthForm = ({
  onSubmit,
  title,
  body,
  footer,
  actionLabel,
  disabled,
  className,
  ...props
}: UserAuthFormProps) => {
  const { toast } = useToast();

  const handleSubmit = useCallback(() => {
    if (disabled) {
      return;
    }

    onSubmit();
  }, [onSubmit, disabled]);

  const loginWithGoogle = async () => {
    try {
      await signIn("google");
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error logging in with Google",
        variant: "destructive",
      });
    }
  };

  const loginWithGithub = async () => {
    try {
      await signIn("github");
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error logging in with Github",
        variant: "destructive",
      });
    }
  };

  return (
    <div className={cn("flex justify-center", className)} {...props}>
      <div className="justify-center items-center flex overflow-x-hidden fixed inset-0 w-full bg-background">
        <Card className="bg-card border-none sm:border-solid rounded-none sm:rounded-md relative w-full sm:w-3/4 md:w-3/6 lg:w-3/7 xl:w-2/6 mx-auto h-full sm:h-auto sm:shadow-md">
          <Link
            title="Voltar para o início"
            href={"/"}
            className={cn(
              buttonVariants({ variant: "ghost", size: "icon" }),
              "absolute top-2 right-2"
            )}
          >
            <ChevronLeft />
          </Link>
          <CardHeader>
            <CardTitle>{title}</CardTitle>
            <CardDescription>Para continuar em Meu Aplicativo</CardDescription>
          </CardHeader>
          <CardContent className="relative flex-auto">
            <div className="grid gap-4 grid-cols-1">
              <Button
                type="button"
                variant="outline"
                className="relative bg-accent"
                // onClick={loginWithGoogle}
                disabled={true}
              >
                Continue com Google
              </Button>
              <Button
                type="button"
                variant="outline"
                className="relative bg-accent"
                // onClick={loginWithGithub}
                disabled={true}
              >
                Continue com Github
              </Button>
              {body}
            </div>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <div className="grid gap-4 w-full">
              <Button
                type="submit"
                id="submit-form"
                className="bg-accent"
                disabled={disabled}
                onClick={handleSubmit}
                variant="outline"
              >
                {actionLabel}
              </Button>
            </div>
            {footer}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default UserAuthForm;
