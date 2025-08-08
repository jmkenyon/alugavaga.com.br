import { PrismaClient } from "@prisma/client";

declare global {
  // Only add to global if not already declared
  var prisma: PrismaClient | undefined;
}

// Avoid instantiating multiple clients in development
const client = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalThis.prisma = client;

export default client;