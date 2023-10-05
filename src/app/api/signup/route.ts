import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import prisma from "@/lib/prismadb";

export async function POST(request: Request) {
  const body = await request.json();
  const { username, email, password } = body;

  if (!username || !email || !password) {
    return new NextResponse("Missing Fields", { status: 400 });
  }

  const usernameExist = await prisma.user.findUnique({
    where: {
      username,
    },
  });

  if (usernameExist) {
    throw new Error("Username already exists.");
  }

  const emailExist = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (emailExist) {
    throw new Error("Email already exists.");
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      username,
      email,
      hashedPassword,
    },
  });

  return NextResponse.json(user, { status: 201 });
}
