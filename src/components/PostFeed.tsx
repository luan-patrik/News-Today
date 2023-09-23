"use client";

import React from "react";
import { useSession } from "next-auth/react";
import Post from "./Post";
import { useGetPosts } from "@/hooks/use-get-posts";
import PaginationControls from "./PaginationControls";
import { PostsSkeleton } from "./skeleton/PostsSkeleton";
import { notFound } from "next/navigation";
import { useGetNumberPosts } from "@/hooks/use-get-number-posts";
import { POSTS_PER_PAGE } from "@/config";

interface Page {
  numberPage: string;
}

const PostFeed = ({ numberPage }: Page) => {
  const { data: session } = useSession();

  const { data: posts, isLoading, error } = useGetPosts(numberPage);

  const { data: allPosts } = useGetNumberPosts();

  const totalPages = Math.ceil(allPosts / POSTS_PER_PAGE);

  if (
    isNaN(parseInt(numberPage)) ||
    parseInt(numberPage) < 1 ||
    parseInt(numberPage) > totalPages
  )
    notFound();

  if (isLoading) return <PostsSkeleton />;

  if (error) return "An error has ocurred:" + error;

  return (
    <div className="container">
      {posts?.map((post, index) => {
        const votesAmt = post.votes.reduce((acc, vote) => {
          if (vote.type === "UP") return acc + 1;
          if (vote.type === "DOWN") return acc - 1;
          return acc;
        }, 0);

        const currentVote = post.votes.find(
          (vote) => vote.userId === session?.user.id
        );
        return (
          <div
            key={post.id}
            style={{ gridTemplateColumns: "auto 1fr" }}
            className="grid gap-2 place-items-center-center"
          >
            <span className="font-medium text-right">
              {(parseInt(numberPage) - 1) * POSTS_PER_PAGE + index + 1}.
            </span>
            <Post
              key={post.id}
              post={post}
              votesAmt={votesAmt}
              currentVote={currentVote}
              commentAmt={post.comments.length}
            />
          </div>
        );
      })}
      <PaginationControls allPosts={allPosts} page={numberPage || "1"} />
    </div>
  );
};

export default PostFeed;
