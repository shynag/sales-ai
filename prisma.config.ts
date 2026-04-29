import path from "node:path";
import dotenv from "dotenv";
import { defineConfig, env } from "prisma/config";

// Prefer Next.js and common filenames in order: .env.local -> .local.env -> .env
const candidates = [
  ".env.local", // Next.js convention
  ".local.env", // earlier used name in this project
  ".env",
];

for (const name of candidates) {
  const p = path.resolve(process.cwd(), name);
  const res = dotenv.config({ path: p });
  if (!res.error) {
    // stop after successfully loading the first existing env file
    break;
  }
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: env("DATABASE_URL"),
  },
});
