import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useGetNumberPosts = () => {
  return useQuery({
    queryKey: ["numberPosts"],
    queryFn: async () => {
      const { data } = await axios.get(`/api/getAllPosts`);
      return data;
    },
    retry: 3,
    keepPreviousData: true,
  });
};
