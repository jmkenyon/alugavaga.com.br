// pages/api/mobile-listings.ts
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/app/libs/prismadb";

interface IListingsParams {
  lat?: number;
  lng?: number;
  startDate?: string;
  endDate?: string;
  userId?: string;
}

function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) {
  const toRad = (x: number) => (x * Math.PI) / 180;
  const R = 6371; // Earth radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const { lat, lng, startDate, endDate, userId }: IListingsParams = req.body;

    console.log("📥 Request body:", req.body); // Log the entire request body
    console.log("📅 Start date:", startDate, "End date:", endDate);
    console.log("📍 Lat/Lng:", lat, lng);

    const query: Record<string, unknown> = {};

    if (userId) {
      query.userId = userId;
      console.log("🆔 Filtering by userId:", userId);
    }

    if (startDate && endDate) {
      console.log("🔹 Adding date range filter to query");
      query.NOT = {
        reservations: {
          some: {
            AND: [
              { startDate: { lt: endDate } },
              { endDate: { gt: startDate } },
            ],
          },
        },
      };
      console.log(
        "📝 Query object with dates:",
        JSON.stringify(query, null, 2)
      );
    }

    // Fetch listings from DB
    const listings = await prisma.listing.findMany({
      where: query,
      orderBy: { createdAt: "desc" },
    });

    console.log("✅ Listings fetched:", listings.length);

    // Convert dates to ISO strings
    let safeListings = listings.map((listing) => ({
      ...listing,
      createdAt: listing.createdAt.toISOString(),
    }));

    // If lat/lng provided, compute distance and sort
    if (lat !== undefined && lng !== undefined) {
      safeListings = safeListings
        .map((listing) => ({
          ...listing,
          distance: haversineDistance(lat, lng, listing.lat, listing.lng),
        }))
        .sort((a, b) => a.distance - b.distance);
    }

    return res.status(200).json(safeListings);
  } catch (err) {
    console.error("❌ Mobile listings error:", err);
    return res.status(500).json({ error: "Erro ao carregar as vagas" });
  }
}
