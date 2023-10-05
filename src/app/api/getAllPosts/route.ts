import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const allPosts = await prisma.post.count();

    return new NextResponse(JSON.stringify(allPosts));
  } catch (error) {
    if (error instanceof NextResponse) {
      return new NextResponse("Invalid request data passed.", { status: 422 });
    }

    return new NextResponse("Unable to fetch post count.", { status: 500 });
  }
}
