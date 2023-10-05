import { NextResponse } from "next/server";
import { z } from "zod";
import { getAuthSession } from "@/lib/auth";
import { CommentValidator } from "@/lib/validators/comment";
import prisma from "@/lib/prismadb";

export async function PATCH(req: Request) {
  try {
    const session = await getAuthSession();

    const body = await req.json();

    const { postId, text, replyToId } = CommentValidator.parse(body);

    if (!session?.user) {
      return new NextResponse("Unauthorized.", { status: 401 });
    }

    await prisma.comment.create({
      data: {
        text,
        postId,
        authorId: session.user.id,
        replyToId,
      },
    });

    return new NextResponse("Comment created successfully.", { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse("Invalid request data passed.", { status: 422 });
    }

    return new NextResponse("Unable to create comment. Try again later.", {
      status: 500,
    });
  }
}
