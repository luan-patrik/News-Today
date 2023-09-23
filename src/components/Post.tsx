import Link from "next/link";
import React from "react";
import { Post, Vote } from "@prisma/client";
import { buttonVariants } from "./ui/button";
import { cn, formatTimeTitle, formatTimeToNow } from "@/lib/utils";
import { SafeUser } from "@/types/prismadb";

type PartialVote = Pick<Vote, "type">;

interface PostProps {
  post: Post & {
    author: SafeUser;
    votes: Vote[];
  };
  votesAmt: number;
  currentVote?: PartialVote;
  commentAmt: number;
}

const Post = ({
  post,
  votesAmt: _votesAmt,
  currentVote: _currentVote,
  commentAmt,
}: PostProps) => {
  return (
    <div>
      {/* news */}
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
        <div className="text-xs text-neutral-600 dark:text-neutral-400 flex mt-2 overflow-auto break-words">
          <div>
            {_votesAmt < 2 && _votesAmt > -2
              ? `${_votesAmt} voto`
              : `${_votesAmt} votos`}
          </div>
          &nbsp;·&nbsp;
          <div className="overflow-auto break-words">
            {commentAmt < 2
              ? `${commentAmt} comentário`
              : `${commentAmt} comentários`}
          </div>
          &nbsp;·&nbsp;
          <Link
            href={`/${post.author.username}`}
            className="cursor-pointer underline-offset-2 hover:underline"
          >
            {post.author.username}
          </Link>
          &nbsp;·&nbsp;
          <span title={formatTimeTitle(new Date(post.createdAt))}>
            {formatTimeToNow(new Date(post.createdAt))}
          </span>
        </div>
      </article>
    </div>
  );
};

export default Post;
