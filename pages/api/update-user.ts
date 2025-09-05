// pages/api/update-user.ts
import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import prisma from "@/app/libs/prismadb";

const JWT_SECRET = process.env.NEXTAUTH_SECRET || "supersecretkey";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, JWT_SECRET) as { email: string };
    if (!payload?.email) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { name, image } = req.body; // accept both name and image

    if (!name && !image) {
      return res.status(400).json({ message: "Nothing to update" });
    }

    const updateData: { name?: string; image?: string } = {};
    if (name) updateData.name = name;
    if (image) updateData.image = image; // this is the Cloudinary URL

    const updatedUser = await prisma.user.update({
      where: { email: payload.email },
      data: updateData,
    });

    return res.status(200).json(updatedUser);
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: "Invalid token" });
  }
}