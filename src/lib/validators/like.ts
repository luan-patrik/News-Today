import { z } from "zod";

export const PostLikeValidator = z.object({
  postId: z.string(),
  likeType: z.enum(["UP"]),
});

export type PostLikeRequest = z.infer<typeof PostLikeValidator>;

export const CommentLikeValidator = z.object({
  commentId: z.string(),
  likeType: z.enum(["UP"]),
});

export type CommentLikeRequest = z.infer<typeof CommentLikeValidator>;
