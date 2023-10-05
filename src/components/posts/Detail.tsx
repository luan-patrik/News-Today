import { notFound } from "next/navigation";
import DetailPost from "../DetailPost";
import prisma from "@/lib/prismadb";

interface DetailProps {
  username: string;
  postId: string;
}

const Detail = async ({ username, postId }: DetailProps) => {
  const detailPost = await prisma.post.findUnique({
    where: {
      author: { username: username },
      id: postId,
    },
    include: {
      likes: true,
      author: {
        select: {
          username: true,
        },
      },
    },
  });

  if (!detailPost) notFound();

  return <DetailPost post={detailPost} />;
};

export default Detail;
