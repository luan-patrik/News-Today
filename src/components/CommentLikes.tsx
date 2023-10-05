import { useMutation } from "@tanstack/react-query";
import { CommentLike, LikeType } from "@prisma/client";
import { CommentLikeRequest } from "@/lib/validators/like";
import axios, { AxiosError } from "axios";
import { useState } from "react";
import { usePrevious } from "@mantine/hooks";
import { useToast } from "./ui/use-toast";
import { Button } from "./ui/button";
import { ChevronDown, ChevronUp, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

type PartialLike = Pick<CommentLike, "type">;

interface CommentLikeProps {
  commentId: string;
  initialLikesAmt: number;
  initialLike?: PartialLike;
}

const CommentLikes = ({
  commentId,
  initialLikesAmt,
  initialLike,
}: CommentLikeProps) => {
  const [likesAmt, setLikesAmt] = useState<number>(initialLikesAmt);
  const [currentLike, setCurrentLike] = useState(initialLike);
  const prevLike = usePrevious(currentLike);
  const { toast } = useToast();

  const { mutate: like } = useMutation({
    mutationFn: async (likeType: LikeType) => {
      const payload: CommentLikeRequest = {
        commentId,
        likeType,
      };
      await axios.patch("/api/post/comment/like/", payload);
    },
    onError: (err, likeType) => {
      if (likeType === "UP") setLikesAmt((prev) => prev - 1);
      else setLikesAmt((prev) => prev + 1);

      setCurrentLike(prevLike);

      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          alert("Faça login");
        }
      }

      return toast({
        title: "Algo deu errado",
        description: "Sua curtida não foi registrada, tente novamente",
        variant: "destructive",
      });
    },
    onMutate: (type) => {
      if (currentLike?.type === type) {
        setCurrentLike(undefined);
        if (type === "UP") setLikesAmt((prev) => prev - 1);
      } else {
        setCurrentLike({ type });
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
            "fill-red-500 text-red-500": currentLike?.type === "UP",
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

export default CommentLikes;
