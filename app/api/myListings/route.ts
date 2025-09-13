import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";

// ---------------- GET LISTINGS ----------------
export async function GET(request: Request) {
  // Try mobile JWT first
  const xAccessToken = request.headers.get("x-access-token") ?? undefined;

  // Fallback to standard Authorization header (web)
  const authHeader = request.headers.get("Authorization") ?? undefined;
  let token: string | undefined = xAccessToken;

  if (!token && authHeader?.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  const currentUser = await getCurrentUser(token);

  if (!currentUser) {
    return NextResponse.json({ error: "User not found" }, { status: 401 });
  }

  const listings = await prisma.listing.findMany({
    where: { userId: currentUser.id },
    include: { user: true },
  });

  return NextResponse.json(listings);
}