'use client'

import React, { useEffect, useState } from 'react'
import { VoteType } from '@prisma/client'
import { usePrevious } from '@mantine/hooks'
import { Button } from '../ui/button'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useMutation } from '@tanstack/react-query'
import { PostVoteRequest } from '@/lib/validators/vote'
import axios, { AxiosError } from 'axios'
import { useToast } from '@/components/ui/use-toast'
import { useRouter } from 'next/navigation'

interface PostVoteClient {
  postId: string
  initialVotesAmt: number
  initialVote?: VoteType | null
}

const PostVoteClient = ({
  postId,
  initialVotesAmt,
  initialVote,
}: PostVoteClient) => {
  const [votesAmt, setVotesAmt] = useState<number>(initialVotesAmt)
  const [currentVote, setCurrentVote] = useState(initialVote)
  const prevVote = usePrevious(currentVote)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    setCurrentVote(initialVote)
  }, [initialVote])

  const { mutate: vote } = useMutation({
    mutationFn: async (type: VoteType) => {
      const payload: PostVoteRequest = {
        voteType: type,
        postId: postId,
      }
      await axios.patch('/api/post/vote', payload)
    },
    onError: (err, VoteType) => {
      if (VoteType === 'UP') setVotesAmt((prev) => prev - 1)
      else setVotesAmt((prev) => prev + 1)

      setCurrentVote(prevVote)

      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return router.push('/sign-in')
        }
      }
      return toast({
        title: 'Somenthing went wrong',
        description: 'Your vote was not registered, please try again',
        variant: 'destructive',
      })
    },
    onMutate: (type: VoteType) => {
      if (currentVote === type) {
        setCurrentVote(undefined)
        if (type === 'UP') setVotesAmt((prev) => prev - 1)
        else if (type === 'DOWN') setVotesAmt((prev) => prev + 1)
      } else {
        setCurrentVote(type)
        if (type === 'UP') setVotesAmt((prev) => prev + (currentVote ? 2 : 1))
        else if (type === 'DOWN')
          setVotesAmt((prev) => prev - (currentVote ? 2 : 1))
      }
    },
  })

  return (
    <div className="flex flex-col pr-2 justify-center">
      <Button
        onClick={() => vote('UP')}
        size="sm"
        aria-label="upvote"
      >
        <ChevronUp
          className={cn('h-5 w-5 text-neutral-700', {
            'text-green-500': currentVote === 'UP',
          })}
        />
      </Button>
      <p className="text-center py-2 font-light text-sm text-zinc-700">
        {votesAmt}
      </p>
      <Button
        onClick={() => vote('DOWN')}
        size="sm"
        aria-label="downvote"
      >
        <ChevronDown
          className={cn('h-5 w-5 text-neutral-700', {
            'text-red-500': currentVote === 'DOWN',
          })}
        />
      </Button>
      <div className="border-r border-neutral-700 border-dotted w-1/2 h-full"></div>
    </div>
  )
}

export default PostVoteClient
