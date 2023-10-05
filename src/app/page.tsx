import PostFeed from "@/components/posts/Feed";
import React from "react";

export default async function Home() {
  return (
    <>
      <PostFeed numberPage="1" />
    </>
  );
}
