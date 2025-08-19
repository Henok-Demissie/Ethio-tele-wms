const { Pool } = require("pg")
const fs = require("fs")
const path = require("path")

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
})

async function runMigrations() {
  try {
    console.log("🚀 Starting database migrations...")

    const scriptsDir = path.join(__dirname)
    const migrationFiles = fs
      .readdirSync(scriptsDir)
      .filter((file) => file.endsWith(".sql") && file.startsWith("001-"))
      .sort()

    for (const file of migrationFiles) {
      console.log(`📄 Running migration: ${file}`)
      const sql = fs.readFileSync(path.join(scriptsDir, file), "utf8")
      await pool.query(sql)
      console.log(`✅ Completed migration: ${file}`)
    }

    console.log("🎉 All migrations completed successfully!")
  } catch (error) {
    console.error("❌ Migration failed:", error)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

runMigrations()
