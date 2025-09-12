import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";



// --- Helper to extract listingId from request
function getListingId(request: Request): string | null {
  const url = new URL(request.url);
  const segments = url.pathname.split("/");
  // The listingId is expected at the last segment
  return segments[segments.length - 1] || null;
}

export async function POST(request: Request) {
  const authHeader = request.headers.get("Authorization") ?? undefined;
  const currentUser = await getCurrentUser(authHeader);
  console.log("POST /favorites, currentUser:", currentUser);

  if (!currentUser) {
    return NextResponse.json({ error: "Usuário não logado" }, { status: 401 });
  }

  const listingId = getListingId(request);
  console.log("POST /favorites, listingId:", listingId);

  if (!listingId) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  const favoriteIds = [...(currentUser.favoriteIds || [])];
  if (!favoriteIds.includes(listingId)) favoriteIds.push(listingId);

  const user = await prisma.user.update({
    where: { id: currentUser.id },
    data: { favoriteIds },
  });

  console.log("POST /favorites, updated user:", user);
  return NextResponse.json(user);
}

export async function DELETE(request: Request) {
  const authHeader = request.headers.get("Authorization") ?? undefined;
  const currentUser = await getCurrentUser(authHeader);
  console.log("DELETE /favorites called, currentUser:", currentUser);

  if (!currentUser) {
    return NextResponse.json({ error: "Usuário não logado" }, { status: 401 });
  }

  const listingId = getListingId(request);
  console.log("DELETE /favorites, listingId:", listingId);

  if (!listingId) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  const favoriteIds = (currentUser.favoriteIds || []).filter((id) => id !== listingId);

  const user = await prisma.user.update({
    where: { id: currentUser.id },
    data: { favoriteIds },
  });

  console.log("DELETE /favorites, updated user:", user);
  return NextResponse.json(user);
}