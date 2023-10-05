import { getAuthSession } from "@/lib/auth";
import { PerfilValidator } from "@/lib/validators/perfil";
import prisma from "@/lib/prismadb";
import { z } from "zod";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new NextResponse("Unauthorized.", { status: 401 });
    }

    const body = await req.json();

    const { name } = PerfilValidator.parse(body);

    const username = await prisma.user.findFirst({
      where: {
        username: name,
      },
    });

    if (username) {
      return new NextResponse("Username unavailable.", { status: 409 });
    }

    await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        username: name,
      },
    });

    return new NextResponse("Username changed successfully.");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse("Invalid request data passed.", {
        status: 422,
      });
    }

    return new NextResponse("Unable to change username. Try again later.", {
      status: 500,
    });
  }
}
