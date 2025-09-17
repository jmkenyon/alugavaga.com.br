// pages/api/mobile-login-apple.ts
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/app/libs/prismadb";
import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";
import { JwtHeader, JwtPayload } from "jsonwebtoken";



const JWT_SECRET = process.env.NEXTAUTH_SECRET || "supersecretkey";

// Apple JWKS client to verify tokens
const client = jwksClient({
  jwksUri: "https://appleid.apple.com/auth/keys",
});

function getAppleKey(kid: string) {
  return new Promise<string>((resolve, reject) => {
    client.getSigningKey(kid, (err, key) => {
      if (err) return reject(err);
      const signingKey = key?.getPublicKey() as string;
      resolve(signingKey);
    });
  });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(405).end();

  const { id_token } = req.body;
  if (!id_token) return res.status(400).json({ error: "Missing id_token" });

  try {
    // Decode token header to get kid

    const decodedHeader = jwt.decode(id_token, { complete: true }) as { header: JwtHeader } | null;
    const kid = decodedHeader?.header?.kid;
    if (!kid) throw new Error("Invalid Apple token");

    const publicKey = await getAppleKey(kid);

    // Verify Apple ID token
    const payload = jwt.verify(id_token, publicKey, {
        algorithms: ["RS256"],
      }) as JwtPayload & { email: string; name?: string };

    if (!payload?.email) throw new Error("Apple token missing email");

    // Check if user exists
    let user = await prisma.user.findUnique({
      where: { email: payload.email },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: payload.email,
          name: payload?.name || payload?.email.split("@")[0],
          image: null, // Apple doesn't provide profile pics
        },
      });
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
        image: user.image,
      },
    });
  } catch (err) {
    console.error("Apple login error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
