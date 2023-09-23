import PostUserFeed from "@/components/PostsUserFeed";

interface UserPageProps {
  params: {
    slug: string;
  };
}

export default async function UserPage({ params }: UserPageProps) {
  const { slug } = params;

  return <PostUserFeed username={slug} numberPage="1" />;
}
