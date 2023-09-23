import PostUserFeed from "@/components/PostsUserFeed";

interface PageOfPostsUserProps {
  params: {
    slug: string;
    page: string;
  };
}

export default function PageOfPostsUser({ params }: PageOfPostsUserProps) {
  const { slug, page } = params;

  return <PostUserFeed username={slug} numberPage={page} />;
}
