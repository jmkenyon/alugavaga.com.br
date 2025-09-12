import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "serverless-jwt";
import prisma from "@/app/libs/prismadb";

const JWT_SECRET = process.env.NEXTAUTH_SECRET || "supersecretkey";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const authHeader = req.headers.authorization;
  console.log("⬅️ Incoming Authorization header:", authHeader);

  if (!authHeader?.startsWith("Bearer "))
    return res.status(401).json({ message: "Unauthorized" });

  const token = authHeader.split(" ")[1];

  try {
    // ✅ serverless-jwt verify is async
    const payload = (await jwt.verify(token, JWT_SECRET)) as { email?: string };

    if (!payload?.email)
      return res.status(401).json({ message: "Unauthorized" });

    const user = await prisma.user.findUnique({
      where: { email: payload.email },
    });

    console.log("Fetched user:", user);

    if (!user) return res.status(404).json({ message: "User not found" });

    return res.status(200).json({
      ...user,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
      emailVerified: user.emailVerified?.toISOString() || null,
    });
  } catch (err) {
    console.error("JWT verification error:", err);
    return res.status(401).json({ message: "Invalid token" });
  }
}