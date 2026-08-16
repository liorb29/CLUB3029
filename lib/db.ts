import { PrismaClient } from "@/lib/generated/prisma/client";

// Prevents exhausting the SQLite connection pool from hot-reloading
// Prisma Client in development (each reload would otherwise create a new client).
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
