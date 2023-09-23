import { getAuthSession } from "@/lib/auth";
import prisma from "@/lib/prismadb";
import PostComment from "./comment/PostComment";
import CreateComment from "./CreateComment";
import { Comment, CommentVote, User } from "@prisma/client";

type ExtendedComment = Comment & {
  votes: CommentVote[];
  author: User;
  replies: ReplyComment[];
};

type ReplyComment = Comment & {
  votes: CommentVote[];
  author: User;
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
      votes: true,
      replies: {
        include: {
          author: {
            select: {
              username: true,
            },
          },
          votes: true,
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
            const topLevelCommentVotesAmt = topLevelComment.votes.reduce(
              (acc, vote) => {
                if (vote.type === "UP") return acc + 1;
                if (vote.type === "DOWN") return acc - 1;
                return acc;
              },
              0
            );

            const topLevelCommentVote = topLevelComment.votes.find(
              (vote) => vote.userId === session?.user.id
            );
            return (
              <div key={topLevelComment.id} className="flex flex-col">
                <div className="mb-2">
                  <PostComment
                    comment={topLevelComment}
                    currentVote={topLevelCommentVote}
                    postId={postId}
                    votesAmt={topLevelCommentVotesAmt}
                  />
                </div>

                {topLevelComment.replies
                  .sort((a, b) => b.votes.length - a.votes.length)
                  .map((reply) => {
                    const replyVotesAmt = reply.votes.reduce((acc, vote) => {
                      if (vote.type === "UP") return acc + 1;
                      if (vote.type === "DOWN") return acc - 1;
                      return acc;
                    }, 0);

                    const replyVote = reply.votes.find(
                      (vote) => vote.userId === session?.user.id
                    );

                    return (
                      <div
                        key={reply.id}
                        className="ml-2 py-2 pl-4 border-l-2 border-accent"
                      >
                        <PostComment
                          comment={reply}
                          currentVote={replyVote}
                          votesAmt={replyVotesAmt}
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