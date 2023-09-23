import { ExtendedPost, ExtendedPostsUser } from "@/types/prismadb";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useGetPostsUser = (username: string, page: number | string) => {
  return useQuery({
    queryKey: ["posts", page],
    queryFn: async () => {
      const { data } = await axios.get(
        `/api/posts/postsUser?username=${username}&page=${page}`
      );
      return data as ExtendedPostsUser;
    },
    retry: 3,
    keepPreviousData: true,
    cacheTime: 1000 * 60 * 5, // 5 minutes
  });
};
