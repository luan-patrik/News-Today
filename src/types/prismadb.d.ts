import { Comment, Post, User, Vote } from "@prisma/client";
import { Vote } from "lucide-react";

type SafeUser = Omit<User, "name", "hashedPassword", "email", "role">;

export type ExtendedPost = Post & {
  votes: Vote[];
  author: SafeUser;
  comments: Comment[];
};

export type ExtendedPostsUser = {
  username: SafeUser;
  posts: ExtendedPost[];
  _count: {
    posts: number;
  };
};
