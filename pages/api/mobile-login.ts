// pages/api/mobile-login.ts
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/app/libs/prismadb";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.NEXTAUTH_SECRET || "supersecretkey"; // make sure to set in .env

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !user.hashedPassword) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }

    const isValid = await bcrypt.compare(password, user.hashedPassword);
    if (!isValid) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }

    // Create JWT
    const token = jwt.sign(
      {
        sub: user.id,
        email: user.email,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (err) {
    console.error("Mobile login error:", err);
    return res.status(500).json({ error: "Algo deu errado" });
  }
}