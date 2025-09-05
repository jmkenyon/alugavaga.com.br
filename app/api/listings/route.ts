import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";
import getListings, { IListingsParams } from "@/app/actions/getListings";


// ---------------- GET LISTINGS ----------------
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const listingId = searchParams.get("listingId"); // <-- new

  if (listingId) {
    // fetch single listing by ID with user
    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
      include: { user: true },
    });

    if (!listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    return NextResponse.json(listing);
  }

  // ---------------- fallback: multiple listings ----------------
  const params: IListingsParams = {
    userId: searchParams.get("userId") || undefined,
    startDate: searchParams.get("startDate") || undefined,
    endDate: searchParams.get("endDate") || undefined,
    lat: searchParams.get("lat") ? parseFloat(searchParams.get("lat")!) : undefined,
    lng: searchParams.get("lng") ? parseFloat(searchParams.get("lng")!) : undefined,
  };

  const listings = await getListings(params);
  return NextResponse.json(listings);
}
// ---------------- CREATE LISTING ----------------
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