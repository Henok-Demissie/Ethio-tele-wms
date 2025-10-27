// lib/prisma.ts
import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

// Load environment files for local development so Prisma can find DATABASE_URL.
// We implement a tiny parser here to avoid adding a runtime dependency and to
// ensure the bundler doesn't try to resolve `dotenv` for client bundles.
if (typeof process !== "undefined" && process?.env && !process.env.NEXT_RUNTIME) {
  try {
    const envPaths = [path.resolve(process.cwd(), ".env")];
    const neonPath = path.resolve(process.cwd(), ".env.neon");
    if (fs.existsSync(neonPath)) envPaths.push(neonPath);

    for (const p of envPaths) {
      if (!fs.existsSync(p)) continue;
      const content = fs.readFileSync(p, "utf8");
      for (const line of content.split(/\r?\n/)) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) continue;
        const eq = trimmed.indexOf("=");
        if (eq === -1) continue;
        const key = trimmed.slice(0, eq).trim();
        const val = trimmed.slice(eq + 1).trim().replace(/^"|"$/g, "");
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  } catch (err) {
    // If reading/parsing fails for any reason, continue without failing the build.
  }
}

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Prefer DATABASE_URL env so that local and production both read from the same Neon DB
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  // We intentionally do not throw here to keep local dev possible, but warn loudly.
  // Loading of `.env`/`.env.neon` above should have populated DATABASE_URL for local dev
  // if the file exists. If it is still missing, show actionable instructions.
  console.warn(
    "Warning: DATABASE_URL is not set. The app will fall back to the datasource defined in prisma/schema.prisma (likely SQLite).\n" +
      "If you want to connect to Neon, set the environment variable and restart the dev server.\n" +
      "Example (Windows cmd.exe): set \"DATABASE_URL=your_neon_pooler_url\" && npm run dev\n" +
      "Or put your pooler URL in a file named .env.neon with: DATABASE_URL=your_neon_pooler_url"
  );
}

const prismaClientArgs: any = {
  log: ["query", "info", "warn", "error"],
};

// If DATABASE_URL is set, pass it explicitly to the client so it always connects to Neon when provided.
if (databaseUrl) {
  prismaClientArgs.datasources = { db: { url: databaseUrl } };
}

// Create a safe mock Prisma client when DATABASE_URL is not set. This prevents
// build-time static generation from executing real DB calls and failing the
// build. At runtime (production), ensure DATABASE_URL is provided.
function createMockModel() {
  // Return a proxy that provides common Prisma model methods with safe defaults.
  return new Proxy(
    {},
    {
      get(_t, method: string) {
        switch (method) {
          case "findMany":
            return async (_args?: any) => []
          case "findUnique":
          case "findFirst":
            return async (_args?: any) => null
          case "count":
            return async (_args?: any) => 0
          case "aggregate":
            return async (_args?: any) => ({})
          case "create":
          case "update":
          case "upsert":
          case "delete":
            return async (_args?: any) => null
          case "groupBy":
            return async (_args?: any) => []
          default:
            return async () => null
        }
      },
    }
  )
}

function createMockPrisma() {
  return new Proxy(
    {},
    {
      get(_target, prop: string) {
        if (prop === "$connect" || prop === "$disconnect") {
          return async () => {}
        }
        // Return a mock model for any model access (e.g., prisma.user)
        return createMockModel()
      },
    }
  )
}

export const prisma = (global.prisma as any) ?? (databaseUrl ? new PrismaClient(prismaClientArgs) : createMockPrisma());

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma as any;
}
