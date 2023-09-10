import { Comment, Post, User, Vote } from '@prisma/client'

type SafeUser = Omit<
  User,
  'hashedPassword',
  'email',
  'role',
>

export type ExtendedPost = Post & {
  votes: Vote[]
  author: SafeUser
  comments: Comment[]
}
