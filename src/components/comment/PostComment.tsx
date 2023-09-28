"use client";

import React, { useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { Comment, CommentLike } from "@prisma/client";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { SafeUser } from "@/types/prismadb";
import { useOnClickOutside } from "@/hooks/use-on-click-outside";
import { CommentRequest } from "@/lib/validators/comment";
import { formatTimeTitle, formatTimeToNow } from "@/lib/utils";
import { useToast } from "../ui/use-toast";
import CommentLikes from "../CommentLikes";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

type ExtendedComment = Comment & {
  likes: CommentLike[];
  author: SafeUser;
};

interface PostCommentProps {
  comment: ExtendedComment;
  likesAmt: number;
  currentLike: CommentLike | undefined;
  postId: string;
}

const PostComment = ({
  comment,
  likesAmt,
  currentLike,
  postId,
}: PostCommentProps) => {
  const { data: session } = useSession();
  const [isReplying, setIsReplying] = useState<boolean>(false);
  const commentRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState<string>(`@${comment.author.username} `);
  const router = useRouter();
  const { toast } = useToast();
  useOnClickOutside(commentRef, () => {
    setIsReplying(false);
  });

  const { mutate: postComment, isLoading } = useMutation({
    mutationFn: async ({ postId, text, replyToId }: CommentRequest) => {
      const payload: CommentRequest = { postId, text, replyToId };

      const { data } = await axios.patch(`/api/post/comment/`, payload);
      return data;
    },
    onError: () => {
      return toast({
        title: "Something went wrong.",
        description: "Comment wasn't created successfully. Please try again.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      router.refresh();
      setIsReplying(false);
    },
  });

  return (
    <div ref={commentRef}>
      <div className="flex">
        <div className="flex gap-2">
          <CommentLikes
            commentId={comment.id}
            initialLikesAmt={likesAmt}
            initialLike={currentLike}
          />
        </div>
        <div className="w-full">
          <div>
            <Link
              href={`/${comment.author.username}`}
              className="max-h-40 mt-1 truncate text-xs bg-blue-500/10 text-blue-700 py-[2px] px-[6px] font-medium rounded-md"
            >
              @{comment.author.username}
            </Link>
            &nbsp;·&nbsp;
            <span
              className="text-xs py-[2px]"
              title={formatTimeTitle(new Date(comment.createdAt))}
            >
              {formatTimeToNow(new Date(comment.createdAt))}
            </span>
            &nbsp;·&nbsp;
          </div>
          <p className="text-xs text-foreground mt-2">{comment.text}</p>
          <div>
            <button
              onClick={() => {
                if (!session) return router.push("/sign-in");
                setIsReplying(true);
              }}
              className="text-xs mt-8"
            >
              Responder
            </button>
          </div>
        </div>
      </div>
      {isReplying ? (
        <div className="grid w-full gap-1.5">
          <Label htmlFor="comment">Seu comentário</Label>
          <div className="mt-2">
            <Textarea
              autoFocus
              className="w-full"
              onFocus={(e) =>
                e.currentTarget.setSelectionRange(
                  e.currentTarget.value.length,
                  e.currentTarget.value.length
                )
              }
              id="comment"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={1}
              placeholder="Adicione uma resposta..."
            />
            <div className="mt-2 flex justify-end gap-2">
              <Button
                tabIndex={-1}
                variant="outline"
                onClick={() => setIsReplying(false)}
              >
                Cancelar
              </Button>
              <Button
                disabled={isLoading}
                className="bg-green-500 hover:bg-green-600 w-24"
                onClick={() => {
                  if (!input) return;
                  postComment({
                    postId,
                    text: input,
                    replyToId: comment.replyToId ?? comment.id,
                  });
                }}
              >
                Responder
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default PostComment;
