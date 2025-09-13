import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";

// --- Helper to extract listingId from request
function getListingId(request: Request): string | null {
  const url = new URL(request.url);
  const segments = url.pathname.split("/");
  return segments[segments.length - 1] || null;
}

// --- Helper to get token for mobile/web
function extractToken(request: Request): string | undefined {
  const xAccessToken = request.headers.get("x-access-token") || undefined;
  if (xAccessToken) return xAccessToken;

  const authHeader = request.headers.get("Authorization") || undefined;
  if (authHeader?.startsWith("Bearer ")) return authHeader.split(" ")[1];

  return undefined;
}

export async function POST(request: Request) {
  const token = extractToken(request);
  const currentUser = await getCurrentUser(token);
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
  const token = extractToken(request);
  const currentUser = await getCurrentUser(token);
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