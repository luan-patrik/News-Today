"use client";

import React from "react";
import Post from "@/components/Post";
import PaginationControls from "@/components/PaginationControls";
import { POSTS_PER_PAGE } from "@/config";
import { useSession } from "next-auth/react";
import { useGetPostsUser } from "@/hooks/use-get-posts-user";
import { notFound } from "next/navigation";
import { PostsUserSkeleton } from "../skeleton/PostsSkeleton";
import EmptyState from "../EmptyState";

interface UserFeedProps {
  username: string;
  numberPage: string;
}

const UserFeed = ({ username, numberPage }: UserFeedProps) => {
  const { data: session } = useSession();
  const {
    data: postsUser,
    isLoading,
    error,
  } = useGetPostsUser(username, numberPage);

  const totalPages = Math.ceil(
    Number(postsUser?._count.posts) / POSTS_PER_PAGE
  );

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
    !/^\d+$/.test(numberPage) ||
    parseInt(numberPage) < 1 ||
    parseInt(numberPage) > totalPages
  )
    notFound();

  if (isLoading) return <PostsUserSkeleton />;

  if (error) return "An error has ocurred:" + error;

  if (!postsUser?.username) notFound();

  return (
    <div className="container py-4">
      <h1 className="font-bold text-2xl">{postsUser?.username}</h1>
      <hr className="my-4" />
      {postsUser?.posts.map((post, index) => {
        const likesAmt = post.likes.reduce((acc, like) => {
          if (like.type === "UP") return acc + 1;
          return acc;
        }, 0);

        const currentLike = post.likes.find(
          (like) => like.userId === session?.user.id
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
              likesAmt={likesAmt}
              currentLike={currentLike}
              commentAmt={post.comments.length}
            />
          </div>
        );
      })}
      <PaginationControls
        username={postsUser.username}
        isUserPage={true}
        allPosts={postsUser?._count.posts}
        page={numberPage || "1"}
      />
    </div>
  );
};

export default UserFeed;
