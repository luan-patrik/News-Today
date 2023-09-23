import { useMutation } from "@tanstack/react-query";
import { CommentVote, VoteType } from "@prisma/client";
import { CommentVoteRequest } from "@/lib/validators/vote";
import axios, { AxiosError } from "axios";
import { useState } from "react";
import { usePrevious } from "@mantine/hooks";
import { useToast } from "./ui/use-toast";
import { Button } from "./ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

type PartialVote = Pick<CommentVote, "type">;

interface CommentVoteProps {
  commentId: string;
  initialVotesAmt: number;
  initialVote?: PartialVote;
}

const CommentVotes = ({
  commentId,
  initialVotesAmt,
  initialVote,
}: CommentVoteProps) => {
  const [votesAmt, setVotesAmt] = useState<number>(initialVotesAmt);
  const [currentVote, setCurrentVote] = useState(initialVote);
  const prevVote = usePrevious(currentVote);
  const { toast } = useToast();

  const { mutate: vote } = useMutation({
    mutationFn: async (voteType: VoteType) => {
      const payload: CommentVoteRequest = {
        commentId,
        voteType,
      };
      await axios.patch("/api/post/vote/", payload);
    },
    onError: (err, voteType) => {
      if (voteType === "UP") setVotesAmt((prev) => prev - 1);
      else setVotesAmt((prev) => prev + 1);

      setCurrentVote(prevVote);

      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          alert("Faça login");
        }
      }

      return toast({
        title: "Algo deu errado",
        description: "Seu voto não foi registrado, tente novamente",
        variant: "destructive",
      });
    },
    onMutate: (type) => {
      if (currentVote?.type === type) {
        setCurrentVote(undefined);
        if (type === "UP") setVotesAmt((prev) => prev - 1);
        else if (type === "DOWN") setVotesAmt((prev) => prev + 1);
      } else {
        setCurrentVote({ type });
        if (type === "UP") setVotesAmt((prev) => prev + (currentVote ? 2 : 1));
        else if (type === "DOWN")
          setVotesAmt((prev) => prev - (currentVote ? 2 : 1));
      }
    },
  });

  return (
    <div className="flex flex-col pr-2 justify-center">
      <Button onClick={() => vote("UP")} size="sm" aria-label="upvote">
        <ChevronUp
          className={cn("h-5 w-5 text-neutral-700", {
            "text-green-500": currentVote?.type === "UP",
          })}
        />
      </Button>
      <p className="text-center py-2 font-light text-sm text-zinc-700">
        {votesAmt}
      </p>
      <Button onClick={() => vote("DOWN")} size="sm" aria-label="downvote">
        <ChevronDown
          className={cn("h-5 w-5 text-neutral-700", {
            "text-red-500": currentVote?.type === "DOWN",
          })}
        />
      </Button>
      <div className="border-r border-neutral-700 border-dotted w-1/2 h-full"></div>
    </div>
  );
};

export default CommentVotes;
