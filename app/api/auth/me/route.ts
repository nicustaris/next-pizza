import { prisma } from "@/prisma/prisma-client";
import { getUserSession } from "@/shared/lib/get-user-session";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const user = await getUserSession();

    if (!user) {
      return NextResponse.json({
        message: "You are not logged in",
        status: 401,
      });
    }

    const data = await prisma.user.findFirst({
      where: {
        id: Number(user.id),
      },
      select: {
        fullName: true,
        email: true,
        password: false,
      },
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ message: "[GET_USER] Server error", error });
  }
}
