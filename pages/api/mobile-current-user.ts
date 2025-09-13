import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import prisma from "@/app/libs/prismadb";

const JWT_SECRET = process.env.NEXTAUTH_SECRET || "supersecretkey";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("=== /api/mobile-current-user CALLED ===");
  console.log("Request headers:", req.headers);

  let authHeader = req.headers.authorization;

  // 🛠 Fallback: parse x-vercel-sc-headers if authHeader missing
  if (!authHeader) {
    const scHeadersJson = req.headers["x-vercel-sc-headers"];
    console.log("x-vercel-sc-headers raw:", scHeadersJson);

    if (typeof scHeadersJson === "string") {
      try {
        const scHeaders = JSON.parse(scHeadersJson);
        authHeader = scHeaders.Authorization || scHeaders.authorization;
        console.log("Extracted Authorization from x-vercel-sc-headers:", authHeader);
      } catch (err) {
        console.error("Failed to parse x-vercel-sc-headers:", err);
      }
    }
  }

  console.log("Final authHeader used:", authHeader);

  if (!authHeader?.startsWith("Bearer ")) {
    console.warn("⚠️ No valid Authorization header found at all.");
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];
  console.log("Extracted token length:", token.length);

  try {
    const payload = jwt.verify(token, JWT_SECRET) as { email?: string };
    console.log("Verified JWT payload:", payload);

    if (!payload?.email)
      return res.status(401).json({ message: "Unauthorized" });

    const user = await prisma.user.findUnique({ where: { email: payload.email } });
    console.log("Fetched user:", user);

    if (!user) return res.status(404).json({ message: "User not found" });

    return res.status(200).json({
      ...user,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
      emailVerified: user.emailVerified?.toISOString() || null,
    });
  } catch (err) {
    console.error("JWT verification failed:", err);
    return res.status(401).json({ message: "Invalid token" });
  }
}