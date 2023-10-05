import { Like, LikeType, Post } from "@prisma/client";
import { notFound } from "next/navigation";
import PostLikeClient from "./PostLikeClient";
import { getAuthSession } from "@/lib/auth";

interface PostLikeServerProps {
  postId: string;
  initialLikesAmt?: number;
  initialLike?: LikeType | null;
  getData?: () => Promise<(Post & { likes: Like[] }) | null>;
}

const PostLikeServer = async ({
  postId,
  initialLikesAmt,
  initialLike,
  getData,
}: PostLikeServerProps) => {
  const session = await getAuthSession();

  let _likesAmt: number = 0;
  let _currentLike: LikeType | null | undefined = undefined;

  if (getData) {
    const post = await getData();
    if (!post) return notFound();

    _likesAmt = post.likes.reduce((acc: number, like) => {
      if (like.type === "UP") return acc + 1;
      return acc;
    }, 0);
    _currentLike = post.likes.find(
      (like) => like.userId === session?.user.id
    )?.type;
  } else {
    _likesAmt = initialLikesAmt!;
    _currentLike = initialLike;
  }

  return (
    <PostLikeClient
      postId={postId}
      initialLikesAmt={_likesAmt}
      initialLike={_currentLike}
    />
  );
};

export default PostLikeServer;
