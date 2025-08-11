import { NextResponse } from "next/server";

import getCurrentUser from "@/app/actions/getCurrentUser";

import prisma from "@/app/libs/prismadb";

interface IParams {
  reservationId?: string;
}

export async function DELETE(
    request: Request,
    context: { params: Promise<{ reservationId?: string }> }
  ) {
    const { params } = context;
    const resolvedParams = await params; // await here
  
    const currentUser = await getCurrentUser();
  
    if (!currentUser) {
      return NextResponse.error();
    }
  
    const { reservationId } = resolvedParams;
  
    if (!reservationId || typeof reservationId !== "string") {
      throw new Error("ID inválido");
    }
  
    const reservation = await prisma.reservation.deleteMany({
      where: {
        id: reservationId,
        OR: [{ userId: currentUser.id }, { listing: { userId: currentUser.id } }],
      },
    });
  
    return NextResponse.json(reservation);
  }