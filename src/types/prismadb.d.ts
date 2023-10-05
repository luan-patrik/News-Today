import { Comment, Like, Post, User } from "@prisma/client";

type SafeUser = Omit<User, "name", "hashedPassword", "email", "role">;

export type ExtendedPost = Post & {
  likes: Like[];
  author: {
    username: SafeUser;
  };
  comments: Comment[];
};

export type ExtendedPostsUser = {
  username: SafeUser;
  posts: ExtendedPost[];
  _count: {
    posts: number;
  };
};
