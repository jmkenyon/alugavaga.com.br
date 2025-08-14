import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();
  if (!currentUser) return NextResponse.error();

  const body = await request.json();
  const { listingId, startDate, endDate, totalPrice } = body;

  if (!listingId || !startDate || !endDate || !totalPrice) {
    return NextResponse.error();
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  // Create the reservation
  const updatedListing = await prisma.listing.update({
    where: { id: listingId },
    data: {
      reservations: {
        create: {
          userId: currentUser.id,
          startDate: start,
          endDate: end,
          totalPrice,
        },
      },
    },
    include: { reservations: true, user: true }, // include owner info
  });

  const newReservation = updatedListing.reservations.slice(-1)[0];

  // Send email to listing owner
  if (updatedListing.user.email) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: 'noreply@alugavaga.com.br',
      to: updatedListing.user.email,
      subject: `Nova reserva para ${updatedListing.title}`,
      text: `${currentUser.name} reservou seu espaço de ${start.toDateString()} a ${end.toDateString()}.`,
    });
  }

  return NextResponse.json(newReservation);
}