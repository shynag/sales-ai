import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Create the PrismaClient when explicitly requested. This avoids constructing
// PrismaClient at module import time which can cause it to be bundled or run
// in environments (like the browser) where it shouldn't execute.
const createPrismaClient = () => {
  // Prevent accidental construction in the browser (Turbopack/Next dev can
  // sometimes try to evaluate server modules on the client). Provide a clear
  // error if that happens.
  if (typeof window !== "undefined") {
    throw new Error("PrismaClient cannot be constructed in the browser.");
  }

  // Ensure DATABASE_URL is provided and pass it explicitly to the client so
  // Prisma's constructor receives a non-empty, valid PrismaClientOptions.
  const dbUrl =
    process.env.DATABASE_URL || process.env.NEXT_PUBLIC_DATABASE_URL;
  if (!dbUrl) {
    throw new Error(
      "Missing DATABASE_URL environment variable. Set DATABASE_URL in your environment.",
    );
  }

  // Create the Prisma adapter with the explicit connection string then
  // construct the generated Prisma client with the adapter. This follows
  // the adapter example from the Prisma docs and ensures the client has a
  // non-empty options object.
  const adapter = new PrismaPg({ connectionString: dbUrl });

  return new PrismaClient({
    adapter,
    log: ["error", "warn"],
    errorFormat: "pretty",
  });
};

declare global {
  // allow global to store the Prisma client between module reloads in dev
  // so we don't open new connections on every HMR update
  var prismaGlobal: PrismaClient | undefined;
}

export default function getPrisma(): PrismaClient {
  if (!globalThis.prismaGlobal) {
    globalThis.prismaGlobal = createPrismaClient();
  }
  return globalThis.prismaGlobal;
}
