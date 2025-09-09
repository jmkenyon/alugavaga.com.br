import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import prisma from "@/app/libs/prismadb";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.NEXTAUTH_SECRET || "supersecretkey";

export default async function getCurrentUser(authHeader?: string) {
  try {
    let email: string | undefined;

    // --- Mobile JWT
    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      try {
        const payload = jwt.verify(token, JWT_SECRET) as { email?: string };
        email = payload.email;
      } catch (err) {
        console.error("JWT verification failed:", err);
        return null;
      }
    }

    // --- Web NextAuth fallback
    if (!email) {
      const session = await getServerSession(authOptions);
      email = session?.user?.email ?? undefined;
    }

    if (!email) return null;

    const currentUser = await prisma.user.findUnique({ where: { email } });
    if (!currentUser) return null;

    return {
      ...currentUser,
      createdAt: currentUser.createdAt.toISOString(),
      updatedAt: currentUser.updatedAt.toISOString(),
      emailVerified: currentUser.emailVerified?.toISOString() || null,
    };
  } catch (err) {
    console.error("Error in getCurrentUser:", err);
    return null;
  }
}