// pages/api/update-user.ts
import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import prisma from "@/app/libs/prismadb";

const JWT_SECRET = process.env.NEXTAUTH_SECRET || "supersecretkey";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  // 🔑 Get token from x-access-token header
  const token = req.headers["x-access-token"] as string | undefined;
  console.log("⬅️ Incoming x-access-token header:", token);

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    // ✅ Verify token
    const payload = jwt.verify(token, JWT_SECRET) as { email?: string };
    console.log("✅ Token payload:", payload);

    if (!payload?.email) {
      return res.status(401).json({ message: "Unauthorized: Missing email" });
    }

    const { name, image } = req.body;

    if (!name && !image) {
      return res.status(400).json({ message: "Nothing to update" });
    }

    const updateData: { name?: string; image?: string } = {};
    if (name) updateData.name = name;
    if (image) updateData.image = image;

    const updatedUser = await prisma.user.update({
      where: { email: payload.email },
      data: updateData,
    });

    console.log("✅ User successfully updated:", updatedUser);
    return res.status(200).json(updatedUser);
  } catch (err) {
    console.error("❌ JWT verification or update failed:", err);
    return res.status(401).json({ message: "Invalid token" });
  }
}