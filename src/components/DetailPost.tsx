import React, { Suspense } from "react";
import { Heart, Loader2 } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import prisma from "@/lib/prismadb";
import { formatTimeTitle, formatTimeToNow } from "@/lib/utils";
import EditorOutput from "@/components/editor/EditorOutput";
import Link from "next/link";
import PostLikeServer from "./post-like/PostLikeServer";
import CommentsSection from "./CommentsSection";
import { Like, Post } from "@prisma/client";
import { SafeUser } from "@/types/prismadb";

interface PostProps {
  post:
    | Post & {
        likes: Like[];
        author: SafeUser;
      };
}

const DetailPost = ({ post }: PostProps) => {
  return (
    <div className="h-full flex flex-1 gap-4 flex-row container py-4">
      <div className="sm:w-0 w-full flex-1">
        <div className="flex">
          <Suspense fallback={<PostLikeShell />}>
            <PostLikeServer
              postId={post.id}
              getData={async () => {
                return await prisma.post.findUnique({
                  where: {
                    id: post.id,
                  },
                  include: {
                    likes: true,
                  },
                });
              }}
            />
          </Suspense>
          <div className="w-full overflow-x-auto">
            <div>
              <Link
                href={`/${post.author.username}`}
                className="truncate text-xs text-blue-700 bg-blue-500/10 py-[2px] px-[6px] font-medium rounded-md hover:underline underline-offset-2"
              >
                {post.author.username}
              </Link>
              &nbsp;
              <span
                className="text-xs py-[2px]"
                title={formatTimeTitle(new Date(post.createdAt))}
              >
                {formatTimeToNow(new Date(post.createdAt))}
              </span>
              &nbsp;·&nbsp;
            </div>
            <h1 className="font-semibold text-[32px] overflow-auto break-words">
              {post.title}
            </h1>
            <EditorOutput content={post.content} />
          </div>
        </div>
        {/* @ts-expect-error server component */}

        <CommentsSection postId={post.id} />
      </div>
    </div>
  );
};

export default DetailPost;

const PostLikeShell = () => {
  return (
    <div className="flex items-center flex-col">
      <div className={(buttonVariants({ variant: "ghost" }), "p-0")}>
        <Heart className="w-5 h-5 text-neutral-700" />
      </div>
      <div className="text-center py-2 font-medium text-sm text-neutral-900">
        <Loader2 className="h-3 w-3 animate-spin" />
      </div>
    </div>
  );
};
