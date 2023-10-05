"use client";

import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import TextareaAutoSize from "react-textarea-autosize";
import { Label } from "@/components/ui/label";
import { CommentRequest, CommentValidator } from "@/lib/validators/comment";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";

interface CreateCommentProps {
  postId: string;
  replyToId?: string;
}

type FormData = z.infer<typeof CommentValidator>;

const CreateComment = ({ postId, replyToId }: CreateCommentProps) => {
  const {
    register,
    handleSubmit,
    resetField,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(CommentValidator),
    defaultValues: {
      text: "",
      postId,
      replyToId,
    },
  });

  const { toast } = useToast();
  const router = useRouter();

  const { mutate: comment, isLoading } = useMutation({
    mutationFn: async ({ text, postId, replyToId }: CommentRequest) => {
      const payload: CommentRequest = {
        text,
        postId,
        replyToId,
      };

      const { data } = await axios.patch(`/api/post/comment/`, payload);
      return data;
    },

    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return router.push("/sign-in");
        }
      }
    },
    onSuccess: () => {
      router.refresh();
      resetField("text");
      return toast({
        title: "Sucesso.",
        description: "Comentário criado.",
        variant: "default",
      });
    },
  });

  async function onSubmit(data: CommentRequest) {
    const payload: CommentRequest = {
      text: data.text,
      postId: data.postId,
      replyToId: data.replyToId,
    };

    comment(payload);
  }

  return (
    <div className="grid w-full gap1.5">
      <form id="new-comment" onSubmit={handleSubmit(onSubmit)}>
        <Label htmlFor="comment">Comentários</Label>
        <div className="mt-2">
          <TextareaAutoSize
            className="flex min-h-[80px] max-h-52 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
            id="comment"
            {...register("text")}
            placeholder="Seu comentário"
          />
          {errors.text && (
            <p className="text-xs text-destructive font-medium mt-2">
              {errors.text.message}
            </p>
          )}

          <div className="mt-2 flex justify-end">
            <Button
              type="submit"
              size="default"
              className="w-24"
              variant="done"
              form="new-comment"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Comentar"
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateComment;
