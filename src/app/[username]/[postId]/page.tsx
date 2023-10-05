import Detail from "@/components/posts/Detail";

interface PageDetailPostProps {
  params: {
    username: string;
    postId: string;
  };
}

export default function PageDetailPost({ params }: PageDetailPostProps) {
  const { username, postId } = params;

  return <Detail username={username} postId={postId} />;
}
