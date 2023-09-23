import { ExtendedPost } from "@/types/prismadb";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useGetPosts = (page: number | string) => {
  return useQuery({
    queryKey: ["posts", page],
    queryFn: async () => {
      const { data } = await axios.get(`/api/posts?page=${page}`);
      return data as ExtendedPost[];
    },
    retry: 3,
    keepPreviousData: true,
    cacheTime: 1000 * 60 * 5, // 5 minutes
  });
};
