import { z } from "zod";
import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { PostLikeValidator } from "@/lib/validators/like";
import prisma from "@/lib/prismadb";
import { CachedPost } from "@/types/redis";
import { redis } from "@/lib/redis";

const CACHE_AFTER_UPLIKES = 1;

export async function PATCH(req: Request) {
  try {
    const session = await getAuthSession();

    const body = await req.json();

    const { postId, likeType } = PostLikeValidator.parse(body);

    if (!session?.user) {
      return new NextResponse("Unauthorized.", { status: 401 });
    }
    const existingLike = await prisma.like.findFirst({
      where: {
        userId: session.user.id,
        postId,
      },
    });

    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        author: {
          select: {
            username: true,
          },
        },
        likes: true,
      },
    });
    if (!post) {
      return new NextResponse("Post not found.", { status: 404 });
    }

    if (existingLike) {
      if (existingLike.type === likeType) {
        await prisma.like.delete({
          where: {
            userId_postId: {
              postId,
              userId: session.user.id,
            },
          },
        });
        return new NextResponse("Like removed successfully.", { status: 200 });
      }
      await prisma.like.update({
        where: {
          userId_postId: {
            postId,
            userId: session.user.id,
          },
        },
        data: { type: likeType },
      });

      const likesAmt = post.likes.reduce((acc, like) => {
        if (like.type === "UP") return acc + 1;
        return acc;
      }, 0);
      if (likesAmt >= CACHE_AFTER_UPLIKES) {
        const cachePayload: CachedPost = {
          author: post.author.username ?? "",
          content: JSON.stringify(post.content),
          id: post.id,
          title: post.title,
          currentLike: likeType,
          createdAt: post.createdAt,
        };
        await redis.hset(`post:${postId}`, cachePayload);
      }
      return new NextResponse("Ok");
    }

    await prisma.like.create({
      data: {
        type: likeType,
        userId: session.user.id,
        postId,
      },
    });

    const likesAmt = post.likes.reduce((acc, like) => {
      if (like.type === "UP") return acc + 1;
      return acc;
    }, 0);
    if (likesAmt >= CACHE_AFTER_UPLIKES) {
      const cachePayload: CachedPost = {
        author: post.author.username ?? "",
        content: JSON.stringify(post.content),
        id: post.id,
        title: post.title,
        currentLike: likeType,
        createdAt: post.createdAt,
      };
      await redis.hset(`post:${postId}`, cachePayload);
    }

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
