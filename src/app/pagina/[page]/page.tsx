import PostFeed from "@/components/posts/Feed";

interface PageOfPostsProps {
  params: {
    page: string;
  };
}

export default function PageOfPosts({ params }: PageOfPostsProps) {
  const { page } = params;

  return <PostFeed numberPage={page} />;
}
