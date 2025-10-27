// scripts/check-database.js
// Simple helper to show which DATABASE_URL is loaded and run a quick Prisma query.
// Usage (Windows cmd): node scripts\check-database.js
// Try to load dotenv if available, otherwise fall back to a simple .env.neon parser.
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require("dotenv").config();
} catch (e) {
  const fs = require("fs");
  const path = require("path");
  const neonPath = path.resolve(process.cwd(), ".env.neon");
  if (fs.existsSync(neonPath)) {
    const contents = fs.readFileSync(neonPath, "utf8");
    for (const line of contents.split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*"?(.+?)"?\s*$/);
      if (m) {
        const k = m[1];
        const v = m[2];
        if (!process.env[k]) process.env[k] = v;
      }
    }
  }
}

const { PrismaClient } = require("@prisma/client");

async function main() {
  console.log("Effective DATABASE_URL:", process.env.DATABASE_URL ? "(set)" : "(not set)");
  if (!process.env.DATABASE_URL) {
    console.log("Tip: create a .env.neon file with DATABASE_URL=your_pooler_url or set the env var then restart the server.");
  }

  const prisma = new PrismaClient();
  try {
    const warehouses = await prisma.warehouse.findMany({ take: 5 });
    console.log(`Found ${warehouses.length} warehouses (sample):`, warehouses.map(w => ({ id: w.id, name: w.name })));
  } catch (err) {
    console.error("Prisma query failed:", err.message || err);
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
