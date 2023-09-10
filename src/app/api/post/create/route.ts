import { getAuthSession } from '@/lib/auth'
import prisma from '@/lib/prismadb'
import { PostValidator } from '@/lib/validators/validators'
import { NextResponse } from 'next/server'
import { z } from 'zod'

export async function POST(req: Request) {
  try {
    const session = await getAuthSession()

    const body = await req.json()

    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { title, content } = PostValidator.parse(body)

    await prisma.post.create({
      data: {
        title,
        content,
        authorId: session.user.id,
      },
    })

    return new NextResponse('Post criado com sucesso', { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(error.message, { status: 422 })
    }
  }
}
