import { Vote, VoteType } from '@prisma/client'

export type CachedPost = {
  id: string
  title: string
  author: string
  content: string
  currentVote: VoteType | null
  createdAt: Date
}
