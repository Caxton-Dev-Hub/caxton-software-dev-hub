import { PrismaClient } from "@prisma/client";

/**
 * The client is created lazily so that pages which never touch the database
 * (the whole marketing site) render fine without DATABASE_URL being set.
 */
const globalForPrisma = globalThis as unknown as { __prisma?: PrismaClient };

function createClient(): PrismaClient {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL is not set. Copy .env.example to .env.local and point it at a Postgres instance (see README).",
    );
  }
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });
}

function client(): PrismaClient {
  return (globalForPrisma.__prisma ??= createClient());
}

export const prisma = new Proxy({} as PrismaClient, {
  get(_target, property) {
    const value = Reflect.get(client(), property);
    return typeof value === "function" ? value.bind(client()) : value;
  },
});

export function isDatabaseConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL);
}
