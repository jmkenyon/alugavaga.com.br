// pages/api/mobile-login-google.ts
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/app/libs/prismadb";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.NEXTAUTH_SECRET || "supersecretkey"; // same secret as /api/mobile-login

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { access_token } = req.body;
  if (!access_token) return res.status(400).json({ error: "Missing access token" });

  try {
    // 1. Fetch user info from Google
    const googleRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    const googleUser = await googleRes.json();

    if (!googleUser?.email) {
      return res.status(400).json({ error: "Could not fetch Google user" });
    }

    // 2. Find or create user
    let user = await prisma.user.findUnique({ where: { email: googleUser.email } });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: googleUser.email,
          name: googleUser.name,
          image: googleUser.picture,
        },
      });
    }

    // 3. Generate JWT (same shape as mobile-login)
    const token = jwt.sign(
      {
        sub: user.id,
        email: user.email,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 4. Return token + user
    return res.status(200).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
      },
    });
  } catch (err) {
    console.error("Google login error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}