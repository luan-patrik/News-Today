import { getAuthSession } from '@/lib/auth'
import { CommentValidator } from '@/lib/validators/comment'
import { NextResponse } from 'next/server'
import prisma from '@/lib/prismadb'
import { z } from 'zod'

export async function PATCH(req: Request) {
  try {
    const session = await getAuthSession()

    const body = await req.json()

    const { postId, text, replyToId } = CommentValidator.parse(body)

    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    await prisma.comment.create({
      data: {
        text,
        postId,
        authorId: session.user.id,
        replyToId,
      },
    })

    return new NextResponse('Comentário criado com sucesso', { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse('Invalid request data passed', { status: 422 })
    }

    return new NextResponse(
      'Could not create comment, please try again later',
      { status: 500 }
    )
  }
}
