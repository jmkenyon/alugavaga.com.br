import { NextResponse } from "next/server";

import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const body = await request.json();
  const { category, location, whatsapp, imageSrc, price, title, description } =
    body;

  const lat = location?.latlng?.[0];
  const lng = location?.latlng?.[1];

  if (typeof lat !== "number" || typeof lng !== "number") {
    return NextResponse.json(
      { error: "Invalid location data" },
      { status: 400 }
    );
  }

  const listing = await prisma.listing.create({
    data: {
      title,
      description,
      imageSrc,
      category,
      whatsapp,
      locationValue: location.value,
      price: parseInt(price, 10),
      userId: currentUser.id,
      lat,
      lng,
    },
  });
  return NextResponse.json(listing);
}
