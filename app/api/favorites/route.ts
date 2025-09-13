import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";

export async function GET(request: Request) {
  try {
    // 1️⃣ Mobile token
    const xAccessToken = request.headers.get("x-access-token") || undefined;

    // 2️⃣ Web Authorization header fallback
    const authHeader = request.headers.get("Authorization") || undefined;
    let token: string | undefined = xAccessToken;

    if (!token && authHeader?.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    const currentUser = await getCurrentUser(token);

    console.log("Fetched user:", currentUser);

    if (!currentUser) {
      return NextResponse.json(
        { error: "Usuário não logado" },
        { status: 401 }
      );
    }

    const favorites = await prisma.listing.findMany({
      where: { id: { in: currentUser.favoriteIds || [] } },
    });

    console.log("Favorites fetched:", favorites);

    return NextResponse.json(favorites);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}