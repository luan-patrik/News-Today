import { Like, LikeType } from "@prisma/client";

export type CachedPost = {
  id: string;
  title: string;
  author: string;
  content: string;
  currentLike: LikeType | null;
  createdAt: Date;
};
