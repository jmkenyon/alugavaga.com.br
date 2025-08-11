import prisma from "@/app/libs/prismadb";

export interface IListingsParams {
  userId?: string;
  startDate?: string;
  endDate?: string;
  locationValue?: string;
  lat?: number;
  lng?: number;
}

function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const toRad = (x: number) => (x * Math.PI) / 180;
  const R = 6371; // Earth radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default async function getListings(params: IListingsParams) {
  try {
    const { userId, startDate, endDate, lat, lng } = await params;

    let query: any = {};

    if (userId) {
      query.userId = userId;
    }

    if (startDate && endDate) {
      query.NOT = {
        reservations: {
          some: {
            OR: [
              {
                endDate: { gte: startDate },
                startDate: { lte: startDate },
              },
              {
                startDate: { gte: endDate },
                endDate: { lte: endDate },
              },
            ],
          },
        },
      };
    }

    // Fetch all listings (filtered by date/user)
    const listings = await prisma.listing.findMany({
      where: query,
      orderBy: {
        createdAt: "desc",
      },
    });

    // Convert to plain objects with ISO dates
    let safeListings = listings.map((listing) => ({
      ...listing,
      createdAt: listing.createdAt.toISOString(),
    }));

    // If lat/lng provided, sort by distance
    if (lat && lng) {
      safeListings = safeListings
        .map((listing) => ({
          ...listing,
          distance: haversineDistance(lat, lng, listing.lat, listing.lng),
        }))
        .sort((a, b) => a.distance - b.distance);
    }

    return safeListings;
  } catch (error: any) {
    throw new Error(error);
  }
}