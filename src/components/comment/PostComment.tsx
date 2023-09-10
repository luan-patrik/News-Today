'use client'

import { Comment, CommentVote, User } from '@prisma/client'
import React, { useRef, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useOnClickOutside } from '@/hooks/use-on-click-outside'
import { useMutation } from '@tanstack/react-query'
import { CommentRequest } from '@/lib/validators/comment'
import { formatTimeTitle, formatTimeToNow } from '@/lib/utils'
import axios from 'axios'
import { useToast } from '../ui/use-toast'

type ExtendedComment = Comment & {
  votes: CommentVote[]
  author: User
}

interface PostCommentProps {
  comment: ExtendedComment
  votesAmt: number
  currentVote: CommentVote | undefined
  postId: string
}

const PostComment = ({
  comment,
  votesAmt,
  currentVote,
  postId,
}: PostCommentProps) => {
  const { data: session } = useSession()
  const [isReplying, setIsReplying] = useState<boolean>(false)
  const commentRef = useRef<HTMLDivElement>(null)
  const [input, setInput] = useState<string>(`@${comment.author.username} `)
  const router = useRouter()
  const { toast } = useToast()
  useOnClickOutside(commentRef, () => {
    setIsReplying(false)
  })

  const { mutate: postComment, isLoading } = useMutation({
    mutationFn: async ({ postId, text, replyToId }: CommentRequest) => {
      const payload: CommentRequest = { postId, text, replyToId }

      const { data } = await axios.patch(`/api/post/comment`, payload)
      return data
    },
    onError: () => {
      return toast({
        title: 'Something went wrong.',
        description: "Comment wasn't created successfully. Please try again.",
        variant: 'destructive',
      })
    },
    onSuccess: () => {
      router.refresh()
      setIsReplying(false)
    },
  })

  return (
    <div ref={commentRef}>
      <div>
        <div>
          <span className="max-h-40 mt-1 truncate text-xs text-blue-700 bg-blue-500/10 py-[2px] px-[6px] font-medium rounded-md">
            {comment.author.username}
          </span>
          &nbsp;·&nbsp;
          <span
            className="text-xs py-[2px]"
            title={formatTimeTitle(new Date(comment.createdAt))}
          >
            {formatTimeToNow(new Date(comment.createdAt))}
          </span>
          &nbsp;·&nbsp;
        </div>
      </div>
      <p className="text-xs text-foreground mt-2">{comment.text}</p>
    </div>
  )
}

export default PostComment
