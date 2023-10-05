import PostUserFeed from "@/components/posts/UserFeed";
import type { Metadata } from "next";

interface UserPageProps {
  params: {
    username: string;
  };
}

export async function generateMetadata({
  params: { username },
}: UserPageProps): Promise<Metadata> {
  return {
    title: username + " - Tabnews",
    description: "Posts de " + username,
  };
}

export default async function UserPage({ params }: UserPageProps) {
  const { username } = params;

  return <PostUserFeed username={username} numberPage="1" />;
}
