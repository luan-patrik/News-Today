import PostUserFeed from "@/components/posts/UserFeed";

interface PageOfPostsUserProps {
  params: {
    username: string;
    page: string;
  };
}

export default function PageOfPostsUser({ params }: PageOfPostsUserProps) {
  const { username, page } = params;

  return <PostUserFeed username={username} numberPage={page} />;
}
