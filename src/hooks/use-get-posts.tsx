import { Prisma } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ExtendedPost } from "@/types/prismadb";

export const useGetPosts = (page: number | string) => {
  return useQuery({
    queryKey: ["posts", page],
    queryFn: async () => {
      const { data } = await axios.get(`/api/posts?page=${page}`);
      return data as ExtendedPost[] & { _count: Prisma.PostCountOutputType };
    },
    retry: 3,
    keepPreviousData: true,
    cacheTime: 1000 * 60 * 5, // 5 minutes
  });
};
