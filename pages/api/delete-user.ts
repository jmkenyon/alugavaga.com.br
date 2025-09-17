// pages/api/delete-user.ts
import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import prisma from "@/app/libs/prismadb";

const JWT_SECRET = process.env.NEXTAUTH_SECRET || "supersecretkey";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "DELETE") {
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

    // 🔥 Delete the user
    const deletedUser = await prisma.user.delete({
      where: { email: payload.email },
    });

    console.log("✅ User successfully deleted:", deletedUser);

    return res.status(200).json({
      message: "User deleted successfully",
      user: deletedUser,
    });
  } catch (err) {
    console.error("❌ JWT verification or deletion failed:", err);
    return res.status(401).json({ message: "Invalid token" });
  }
}