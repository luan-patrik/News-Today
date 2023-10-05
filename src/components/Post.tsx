import Link from "next/link";
import React from "react";
import { Like, Post } from "@prisma/client";
import { buttonVariants } from "./ui/button";
import { cn, formatTimeTitle, formatTimeToNow } from "@/lib/utils";
import { SafeUser } from "@/types/prismadb";

type PartialLike = Pick<Like, "type">;

interface PostProps {
  post: Post & {
    author: SafeUser;
    likes: Like[];
  };
  likesAmt: number;
  currentLike?: PartialLike;
  commentAmt: number;
}

const Post = ({
  post,
  likesAmt: _likesAmt,
  currentLike: _currentLike,
  commentAmt,
}: PostProps) => {
  return (
    <div>
      <article className="overflow-auto">
        <div className="overflow-auto">
          <Link
            href={`/${post.author.username}/${post.id}`}
            className={cn(
              buttonVariants({ variant: "link" }),
              "p-0 h-fit break-words break-all text-neutral-950 dark:text-neutral-50 visited:text-neutral-600 dark:visited:text-neutral-400 focus-visible:outline-ring"
            )}
          >
            {post.title}
          </Link>
        </div>
        <div className="text-xs text-neutral-600 dark:text-neutral-400 mt-2">
          <span>
            {_likesAmt < 2 ? `${_likesAmt} curtida` : `${_likesAmt} curtidas`}
          </span>
          {" · "}
          <span className="whitespace-nowrap">
            {commentAmt < 2
              ? `${commentAmt} comentário`
              : `${commentAmt} comentários`}
          </span>
          {" · "}
          <Link
            href={`/${post.author.username}`}
            className="cursor-pointer underline-offset-2 hover:underline"
          >
            {post.author.username}
          </Link>
          {" · "}
          <span
            className="whitespace-nowrap"
            title={formatTimeTitle(new Date(post.createdAt))}
          >
            {formatTimeToNow(new Date(post.createdAt))}
          </span>
        </div>
      </article>
    </div>
  );
};

export default Post;
