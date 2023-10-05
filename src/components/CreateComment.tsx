"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CommentRequest, CommentValidator } from "@/lib/validators/comment";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";

interface CreateCommentProps {
  postId: string;
  replyToId?: string;
}

const CreateComment = ({ postId, replyToId }: CreateCommentProps) => {
  const [input, setInput] = useState<string>("");
  const { toast } = useToast();
  const router = useRouter();

  const { mutate: comment, isLoading } = useMutation({
    mutationFn: async ({ postId, text, replyToId }: CommentRequest) => {
      const payload: CommentRequest = {
        postId,
        text,
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

      const validationResult = CommentValidator.safeParse({
        postId,
        text: input,
        replyToId,
      });

      if (!validationResult.success) {
        const errorMessages = validationResult.error.issues.map(
          (issue) => issue.message
        );

        return toast({
          title: "Algo deu errado.",
          description: `${errorMessages}`,
          variant: "destructive",
        });
      }
    },
    onSuccess: () => {
      router.refresh();
      setInput("");
      return toast({
        title: "Sucesso.",
        description: "Comentário criado.",
        variant: "default",
      });
    },
  });

  return (
    <div className="grid w-full gap1.5">
      <Label htmlFor="comment">Comentários</Label>
      <div className="mt-2">
        <Textarea
          className="w-full rounded-md resize-none"
          id="comment"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Seu comentário"
        />

        <div className="mt-2 flex justify-end">
          <Button
            variant="done"
            onClick={() => comment({ postId, text: input, replyToId })}
          >
            Comentar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateComment;
