import React from "react";
import PostFeed from "@/components/PostFeed";

interface PageOfPostsProps {
  params: {
    page: string;
  };
}

export default function PageOfPosts({ params }: PageOfPostsProps) {
  const { page } = params;

  return <PostFeed numberPage={page} />;
}
