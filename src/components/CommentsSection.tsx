import { getAuthSession } from "@/lib/auth";
import prisma from "@/lib/prismadb";
import PostComment from "./comment/PostComment";
import CreateComment from "./CreateComment";
import { Comment, CommentLike } from "@prisma/client";
import { SafeUser } from "@/types/prismadb";

type ExtendedComment = Comment & {
  likes: CommentLike[];
  author: SafeUser;
  replies: ReplyComment[];
};

type ReplyComment = Comment & {
  likes: CommentLike[];
  author: SafeUser;
};

interface CommentsSectionProps {
  postId: string;
  comments: ExtendedComment[];
}

const CommentsSection = async ({ postId }: CommentsSectionProps) => {
  const session = await getAuthSession();

  const comments = await prisma.comment.findMany({
    where: {
      postId: postId,
    },
    include: {
      author: {
        select: {
          username: true,
        },
      },
      likes: true,
      replies: {
        include: {
          author: {
            select: {
              username: true,
            },
          },
          likes: true,
        },
      },
    },
  });

  return (
    <div className="flex flex-col gap-y-4 mt-4">
      <hr className="w-full h-px my-6" />

      <CreateComment postId={postId} />

      <div className="flex flex-col gap-y-6">
        {comments
          .filter((comment) => !comment.replyToId)
          .map((topLevelComment) => {
            const topLevelCommentLikesAmt = topLevelComment.likes.reduce(
              (acc, like) => {
                if (like.type === "UP") return acc + 1;
                return acc;
              },
              0
            );

            const topLevelCommentLike = topLevelComment.likes.find(
              (like) => like.userId === session?.user.id
            );
            return (
              <div key={topLevelComment.id} className="flex flex-col">
                <div className="mb-2">
                  <PostComment
                    comment={topLevelComment}
                    currentLike={topLevelCommentLike}
                    postId={postId}
                    likesAmt={topLevelCommentLikesAmt}
                  />
                </div>

                {topLevelComment.replies
                  .sort((a, b) => b.likes.length - a.likes.length)
                  .map((reply) => {
                    const replyLikesAmt = reply.likes.reduce((acc, like) => {
                      if (like.type === "UP") return acc + 1;
                      return acc;
                    }, 0);

                    const replyLike = reply.likes.find(
                      (like) => like.userId === session?.user.id
                    );

                    return (
                      <div
                        key={reply.id}
                        className="ml-2 py-2 pl-4 border-l-2 border-accent"
                      >
                        <PostComment
                          comment={reply}
                          currentLike={replyLike}
                          likesAmt={replyLikesAmt}
                          postId={postId}
                        />
                      </div>
                    );
                  })}
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default CommentsSection;
