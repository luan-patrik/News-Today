import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { CommentLikeValidator } from "@/lib/validators/like";
import prisma from "@/lib/prismadb";
import { z } from "zod";

export async function PATCH(req: Request) {
  try {
    const session = await getAuthSession();

    const body = await req.json();

    const { commentId, likeType } = CommentLikeValidator.parse(body);

    if (!session?.user) {
      return new NextResponse("Unauthorized.", { status: 401 });
    }

    const existingLike = await prisma.commentLike.findFirst({
      where: {
        userId: session.user.id,
        commentId,
      },
    });

    if (existingLike) {
      if (existingLike.type === likeType) {
        await prisma.commentLike.delete({
          where: {
            userId_commentId: {
              commentId,
              userId: session.user.id,
            },
          },
        });
        return new NextResponse("Like removed successfully.", { status: 200 });
      } else {
        await prisma.commentLike.update({
          where: {
            userId_commentId: {
              commentId,
              userId: session.user.id,
            },
          },
          data: { type: likeType },
        });
      }
      return new NextResponse("Like updated successfully.", { status: 200 });
    }

    await prisma.commentLike.create({
      data: {
        type: likeType,
        userId: session.user.id,
        commentId,
      },
    });

    return new NextResponse("Like added successfully.", { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse("Invalid request data passed.", {
        status: 422,
      });
    }

    return new NextResponse("Unable to add like. Try again later.", {
      status: 500,
    });
  }
}
