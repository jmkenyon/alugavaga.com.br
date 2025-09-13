import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import prisma from "@/app/libs/prismadb";

const JWT_SECRET = process.env.NEXTAUTH_SECRET || "supersecretkey";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("=== /api/mobile-current-user CALLED ===");
  console.log("Request method:", req.method);
  console.log("Request URL:", req.url);
  console.log("Request query:", req.query);
  console.log("Request headers:", req.headers);

  try {
    // 1️⃣ Extract Authorization header
    const authHeader = req.headers.authorization;
    console.log("⬅️ Incoming Authorization header:", authHeader);

    if (!authHeader) {
      console.warn("⚠️ No Authorization header found!");
      return res
        .status(401)
        .json({ message: "Unauthorized: No Authorization header" });
    }

    if (!authHeader.startsWith("Bearer ")) {
      console.warn("⚠️ Authorization header does not start with 'Bearer '");
      return res
        .status(401)
        .json({ message: "Unauthorized: Invalid Authorization format" });
    }

    // 2️⃣ Extract token
    const token = authHeader.split(" ")[1];
    console.log("🔑 Extracted Token:", token);
    console.log("🔑 Token length:", token?.length);

    // 3️⃣ Decode token without verify for debugging
    try {
      const [, payloadBase64] = token.split(".");
      const decodedPayload = JSON.parse(
        Buffer.from(payloadBase64, "base64url").toString()
      );
      console.log("🔍 Decoded token payload (unverified):", decodedPayload);
    } catch (err) {
      console.error("❌ Failed to decode token payload:", err);
    }

    // 4️⃣ Verify token
    let payload;
    try {
      payload = jwt.verify(token, JWT_SECRET) as { email?: string };
      console.log("✅ JWT successfully verified. Payload:", payload);
    } catch (err) {
      console.error("❌ JWT verification failed:", err);
      return res.status(401).json({ message: "Invalid token" });
    }

    if (!payload?.email) {
      console.warn("⚠️ Verified JWT payload missing email");
      return res.status(401).json({ message: "Unauthorized: Missing email" });
    }

    // 5️⃣ Fetch user from DB
    console.log("🔎 Fetching user from database with email:", payload.email);
    const user = await prisma.user.findUnique({
      where: { email: payload.email },
    });

    console.log("📦 Prisma returned user:", user);

    if (!user) {
      console.warn("⚠️ No user found for email:", payload.email);
      return res.status(404).json({ message: "User not found" });
    }

    const userResponse = {
      ...user,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
      emailVerified: user.emailVerified?.toISOString() || null,
    };

    console.log("✅ Sending user response:", userResponse);
    return res.status(200).json(userResponse);
  } catch (err) {
    console.error("💥 Unexpected error in /api/mobile-current-user:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}