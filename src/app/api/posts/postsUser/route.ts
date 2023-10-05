import { z } from "zod";
import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
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
      select: {
        id: true,
        username: true,
        updatedAt: true,
        createdAt: true,
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
            likes: true,
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
      return new NextResponse("Invalid request data passed.", { status: 422 });
    }

    return new NextResponse("Unable to fetch posts.", { status: 500 });
  }
}
