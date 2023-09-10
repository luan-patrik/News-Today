import React from 'react'
import prisma from '@/lib/prismadb'
import { notFound } from 'next/navigation'
import Post from '@/components/Post'
import { getAuthSession } from '@/lib/auth'

interface UserPageProps {
  params: {
    slug: string
  }
}

const UserPage = async ({ params }: UserPageProps) => {
  const { slug } = params

  const session = await getAuthSession()

  const postsUser = await prisma.user.findFirst({
    where: { username: slug },
    include: {
      posts: {
        include: {
          author: {
            select: {
              username: true,
            },
          },
          votes: true,
          comments: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  })

  if (!postsUser?.username) notFound()
  const posts = postsUser.posts

  return (
    <div className="container">
      <div
        style={{ gridTemplateColumns: 'auto 1fr' }}
        className="grid gap-2 place-items-center-center"
      >
        {posts.map((post, index) => {
          const votesAmt = post.votes.reduce((acc, vote) => {
            if (vote.type === 'UP') return acc + 1
            if (vote.type === 'DOWN') return acc - 1
            return acc
          }, 0)

          const currentVote = post.votes.find(
            (vote) => vote.userId === session?.user.id
          )

          return (
            <>
              <span className="font-medium text-right">{index + 1}.</span>
              <Post
                key={post.id}
                post={post}
                votesAmt={votesAmt}
                currentVote={currentVote}
                commentAmt={post.comments.length}
              />
            </>
          )
        })}
      </div>
    </div>
  )
}

export default UserPage
