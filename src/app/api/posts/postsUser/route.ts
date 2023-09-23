import { z } from "zod";
import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { POSTS_PER_PAGE } from "@/config";

export async function GET(req: Request) {
  const url = new URL(req.url);

  const { username, page } = z
    .object({
      username: z.string(),
      page: z.string(),
    })
    .parse({
      username: url.searchParams.get("username"),
      page: url.searchParams.get("page"),
    });

  try {
    const postsUser = await prisma.user.findUnique({
      where: {
        username: username,
      },
      include: {
        posts: {
          skip: (parseInt(page) - 1) * POSTS_PER_PAGE,

          take: POSTS_PER_PAGE,
          orderBy: {
            createdAt: "desc",
          },
          include: {
            author: {
              select: {
                username: true,
              },
            },
            votes: true,
            comments: true,
          },
        },
        _count: {
          select: {
            posts: true,
          },
        },
      },
    });

    return new NextResponse(JSON.stringify(postsUser), { status: 200 });
  } catch (error) {
    if (error instanceof NextResponse) {
      return new NextResponse("Invalid request data passed", { status: 422 });
    }

    return new NextResponse("Could not fetch posts", { status: 500 });
  }
}
