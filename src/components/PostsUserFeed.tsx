"use client";

import React from "react";
import Post from "@/components/Post";
import PaginationControls from "@/components/PaginationControls";
import { POSTS_PER_PAGE } from "@/config";
import { useSession } from "next-auth/react";
import { useGetPostsUser } from "@/hooks/use-get-posts-user";
import { notFound } from "next/navigation";
import { PostsUserSkeleton } from "./skeleton/PostsSkeleton";
import EmptyState from "./EmptyState";

interface PostUserFeedProps {
  username: string;
  numberPage: string;
}

const PostUserFeed = ({ username, numberPage }: PostUserFeedProps) => {
  const { data: session } = useSession();
  const {
    data: postsUser,
    isLoading,
    error,
  } = useGetPostsUser(username, numberPage);

  const totalPages = Math.ceil(
    Number(postsUser?._count.posts) / POSTS_PER_PAGE
  );

  const parsedPage = parseInt(numberPage);

  if (postsUser?._count.posts === 0)
    return (
      <>
        <EmptyState
          title="Ops..."
          subtitle="Este usuário não possui postagens"
          redirectInitial
        />
        ;
      </>
    );

  if (
    isNaN(parseInt(numberPage)) ||
    parseInt(numberPage) < 1 ||
    parseInt(numberPage) > totalPages
  )
    notFound();

  if (isLoading) return <PostsUserSkeleton />;

  if (error) return "An error has ocurred:" + error;

  if (!postsUser?.username) notFound();

  return (
    <div className="container">
      <h1 className="font-bold text-2xl">{postsUser?.username}</h1>
      <hr className="my-4" />
      {postsUser?.posts.map((post, index) => {
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
            <span key={index} className="font-medium text-right">
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
      <PaginationControls
        username={postsUser.username}
        userPage={true}
        allPosts={postsUser?._count.posts}
        page={numberPage || "1"}
      />
    </div>
  );
};

export default PostUserFeed;
