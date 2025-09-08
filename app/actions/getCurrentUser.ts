import prisma from "@/app/libs/prismadb";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.NEXTAUTH_SECRET || "supersecretkey";

export default async function getCurrentUser(authHeader?: string) {
  try {
    let email: string | undefined;

    if (authHeader?.startsWith("Bearer ")) {
      // JWT from React Native
      const token = authHeader.split(" ")[1];
      const payload = jwt.verify(token, JWT_SECRET) as { email: string };
      email = payload?.email;
    }

    // fallback: NextAuth session (browser)
    if (!email) {
      // optionally add getServerSession logic here if needed for SSR
      return null;
    }

    if (!email) return null;

    const currentUser = await prisma.user.findUnique({
      where: { email },
    });

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