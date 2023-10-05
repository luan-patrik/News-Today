"use client";

import React, { useEffect, useState } from "react";
import { LikeType } from "@prisma/client";
import { usePrevious } from "@mantine/hooks";
import { Button } from "../ui/button";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { PostLikeRequest } from "@/lib/validators/like";

interface PostLikeClient {
  postId: string;
  initialLikesAmt: number;
  initialLike?: LikeType | null;
}

const PostLikeClient = ({
  postId,
  initialLikesAmt,
  initialLike,
}: PostLikeClient) => {
  const [likesAmt, setLikesAmt] = useState<number>(initialLikesAmt);
  const [currentLike, setCurrentLike] = useState(initialLike);
  const prevLike = usePrevious(currentLike);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    setCurrentLike(initialLike);
  }, [initialLike]);

  const { mutate: like } = useMutation({
    mutationFn: async (type: LikeType) => {
      const payload: PostLikeRequest = {
        likeType: type,
        postId: postId,
      };
      await axios.patch("/api/post/like/", payload);
    },
    onError: (err, LikeType) => {
      if (LikeType === "UP") setLikesAmt((prev) => prev - 1);
      else setLikesAmt((prev) => prev + 1);

      setCurrentLike(prevLike);

      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return router.push("/sign-in");
        }
      }
      return toast({
        title: "Somenthing went wrong",
        description: "Your Like was not registered. Try again later.",
        variant: "destructive",
      });
    },
    onMutate: (type: LikeType) => {
      if (currentLike === type) {
        setCurrentLike(undefined);
        if (type === "UP") setLikesAmt((prev) => prev - 1);
      } else {
        setCurrentLike(type);
        if (type === "UP") setLikesAmt((prev) => prev + (currentLike ? 2 : 1));
      }
    },
  });

  return (
    <div className="flex flex-col pr-2 justify-center">
      <Button
        className="p-0"
        onClick={() => like("UP")}
        size="sm"
        aria-label="UP LIKE"
      >
        <Heart
          className={cn("h-5 w-5 text-neutral-700", {
            "fill-red-500 text-red-500": currentLike === "UP",
          })}
        />
      </Button>
      <p className="text-center py-2 font-light text-sm text-zinc-700">
        {likesAmt}
      </p>

      <div className="border-r border-neutral-700 border-dotted w-1/2 h-full"></div>
    </div>
  );
};

export default PostLikeClient;
