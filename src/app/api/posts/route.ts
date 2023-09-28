import { z } from "zod";
import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { POSTS_PER_PAGE } from "@/config";

export async function GET(req: Request) {
  const url = new URL(req.url);

  const { page } = z
    .object({
      page: z.string(),
    })
    .parse({
      page: url.searchParams.get("page"),
    });

  try {
    const posts = await prisma.post.findMany({
      orderBy: {
        createdAt: "desc",
      },
      skip: (parseInt(page) - 1) * POSTS_PER_PAGE,
      take: POSTS_PER_PAGE,
      include: {
        likes: true,
        comments: true,
        author: {
          select: {
            username: true,
          },
        },
      },
    });

    return new NextResponse(JSON.stringify(posts), { status: 200 });
  } catch (error) {
    if (error instanceof NextResponse) {
      return new NextResponse("Invalid request data passed", { status: 422 });
    }

    return new NextResponse("Could not fetch posts", { status: 500 });
  }
}
