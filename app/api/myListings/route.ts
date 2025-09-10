import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";

// ---------------- GET LISTINGS ----------------
export async function GET(request: Request) {
  const authHeader = request.headers.get("Authorization") ?? undefined;
  const currentUser = await getCurrentUser(authHeader);

  if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
  }
  
  const listings = await prisma.listing.findMany({
      where: { userId: currentUser.id },
      include: { user: true },
  });
  
  return NextResponse.json(listings);
  }