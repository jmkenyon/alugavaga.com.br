import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";

export async function GET(request: Request) {
  try {
    const currentUser = await getCurrentUser(
      request.headers.get("authorization") || undefined
    );

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
