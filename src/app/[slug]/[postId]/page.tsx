import React, { Suspense } from "react";
import { notFound } from "next/navigation";
import { Post, Vote } from "@prisma/client";
import { ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { redis } from "@/lib/redis";
import { CachedPost } from "@/types/redis";
import { buttonVariants } from "@/components/ui/button";
import PostVoteServer from "@/components/post-vote/PostVoteServer";
import prisma from "@/lib/prismadb";
import { formatTimeTitle, formatTimeToNow } from "@/lib/utils";
import EditorOutput from "@/components/editor/EditorOutput";
import CommentsSection from "@/components/CommentsSection";
import { getAuthSession } from "@/lib/auth";
import { SafeUser } from "@/types/prismadb";
import Link from "next/link";

interface DetailPostProps {
  params: {
    slug: string;
    postId: string;
  };
}

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default async function DetailPost({ params }: DetailPostProps) {
  const { slug, postId } = params;

  const session = await getAuthSession();

  const cachedPost = (await redis.hgetall(`post:${postId}`)) as CachedPost;
  let post: (Post & { votes: Vote[]; author: SafeUser }) | null = null;

  if (params.postId.length !== 24) notFound();

  if (!cachedPost) {
    post = await prisma.post.findFirst({
      where: {
        author: { username: slug },
        id: postId,
      },
      include: {
        votes: true,
        author: {
          select: {
            username: true,
          },
        },
      },
    });
  }

  if (!post && !cachedPost) notFound();

  return (
    <div className="h-full flex flex-1 gap-4 flex-row container">
      <div className="sm:w-0 w-full flex-1">
        <div className="flex">
          <Suspense fallback={<PostVoteShell />}>
            <PostVoteServer
              postId={post?.id ?? cachedPost.id}
              getData={async () => {
                return await prisma.post.findUnique({
                  where: {
                    id: params.postId,
                  },
                  include: {
                    votes: true,
                  },
                });
              }}
            />
          </Suspense>
          <div className="w-full overflow-x-auto">
            <div>
              <Link
                href={`/${post?.author.username ?? cachedPost.author}`}
                className="truncate text-xs text-blue-700 bg-blue-500/10 py-[2px] px-[6px] font-medium rounded-md hover:underline underline-offset-2"
              >
                {post?.author.username ?? cachedPost.author}
              </Link>
              &nbsp;
              <span
                className="text-xs py-[2px]"
                title={formatTimeTitle(
                  new Date(post?.createdAt ?? cachedPost.createdAt)
                )}
              >
                {formatTimeToNow(
                  new Date(post?.createdAt ?? cachedPost.createdAt)
                )}
              </span>
              &nbsp;·&nbsp;
            </div>
            <h1 className="font-semibold text-[32px] overflow-auto break-words">
              {post?.title ?? cachedPost.title}
            </h1>
            <EditorOutput content={post?.content ?? cachedPost.content} />
          </div>
        </div>
        {/* @ts-expect-error server component */}

        <CommentsSection postId={post?.id ?? cachedPost.id} />
      </div>
    </div>
  );
}

const PostVoteShell = () => {
  return (
    <div className="flex items-center flex-col">
      <div className={buttonVariants({ variant: "ghost" })}>
        <ChevronUp className="w-5 h-5 text-neutral-700" />
      </div>
      <div className="text-center py-2 font-medium text-sm text-neutral-900">
        <Loader2 className="h-3 w-3 animate-spin" />
      </div>
      <div className={buttonVariants({ variant: "ghost" })}>
        <ChevronDown className="w-5 h-5 text-neutral-700" />
      </div>
    </div>
  );
};
