import { NextResponse } from 'next/server'
import { getAuthSession } from '@/lib/auth'
import { PostVoteValidator } from '@/lib/validators/vote'
import prisma from '@/lib/prismadb'
import { CachedPost } from '@/types/redis'
import { redis } from '@/lib/redis'
import { z } from 'zod'

const CACHE_AFTER_UPVOTES = 1

export async function PATCH(req: Request) {
  try {
    const session = await getAuthSession()

    const body = await req.json()

    const { postId, voteType } = PostVoteValidator.parse(body)

    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }
    const existingVote = await prisma.vote.findFirst({
      where: {
        userId: session.user.id,
        postId,
      },
    })

    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        author: true,
        votes: true,
      },
    })
    if (!post) {
      return new NextResponse('Post not found', { status: 404 })
    }

    if (existingVote) {
      if (existingVote.type === voteType) {
        await prisma.vote.delete({
          where: {
            userId_postId: {
              postId,
              userId: session.user.id,
            },
          },
        })
        return new NextResponse('Ok')
      }
      await prisma.vote.update({
        where: {
          userId_postId: {
            postId,
            userId: session.user.id,
          },
        },
        data: { type: voteType },
      })
      //recontar os votos

      const votesAmt = post.votes.reduce((acc, vote) => {
        if (vote.type === 'UP') return acc + 1
        if (vote.type === 'DOWN') return acc - 1
        return acc
      }, 0)
      if (votesAmt >= CACHE_AFTER_UPVOTES) {
        const cachePayload: CachedPost = {
          author: post.author.username ?? '',
          content: JSON.stringify(post.content),
          id: post.id,
          title: post.title,
          currentVote: voteType,
          createdAt: post.createdAt,
        }
        await redis.hset(`post:${postId}`, cachePayload)
      }
      return new NextResponse('Ok')
    }

    await prisma.vote.create({
      data: {
        type: voteType,
        userId: session.user.id,
        postId,
      },
    })

    const votesAmt = post.votes.reduce((acc, vote) => {
      if (vote.type === 'UP') return acc + 1
      if (vote.type === 'DOWN') return acc - 1
      return acc
    }, 0)
    if (votesAmt >= CACHE_AFTER_UPVOTES) {
      const cachePayload: CachedPost = {
        author: post.author.username ?? '',
        content: JSON.stringify(post.content),
        id: post.id,
        title: post.title,
        currentVote: voteType,
        createdAt: post.createdAt,
      }
      await redis.hset(`post:${postId}`, cachePayload)
    }

    return new NextResponse('Voto efetuado com sucesso', { status: 200 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse('Invalid POST request data passed', {
        status: 422,
      })
    }

    return new NextResponse('Please try again', { status: 500 })
  }
}
