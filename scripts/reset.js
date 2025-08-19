const { Pool } = require("pg")

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
})

async function resetDatabase() {
  try {
    console.log("🔄 Resetting database...")

    // Drop all tables
    await pool.query(`
      DROP SCHEMA public CASCADE;
      CREATE SCHEMA public;
      GRANT ALL ON SCHEMA public TO postgres;
      GRANT ALL ON SCHEMA public TO public;
    `)

    console.log("✅ Database reset successfully!")
    console.log('💡 Run "npm run db:migrate" and "npm run db:seed" to set up the database again.')
  } catch (error) {
    console.error("❌ Reset failed:", error)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

resetDatabase()
