// Only import pg if DATABASE_URL is available
let pool: any = null
let query: any = null
let transaction: any = null

if (process.env.DATABASE_URL) {
  try {
    const { Pool } = require("pg")

    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    })

    // Database query helper
    query = async (text: string, params?: any[]) => {
      const start = Date.now()
      const client = await pool.connect()

      try {
        const res = await client.query(text, params)
        const duration = Date.now() - start
        console.log("Executed query", { text, duration, rows: res.rowCount })
        return res
      } catch (error) {
        console.error("Database query error:", error)
        throw error
      } finally {
        client.release()
      }
    }

    // Transaction helper
    transaction = async (callback: (client: any) => Promise<any>) => {
      const client = await pool.connect()

      try {
        await client.query("BEGIN")
        const result = await callback(client)
        await client.query("COMMIT")
        return result
      } catch (error) {
        await client.query("ROLLBACK")
        console.error("Transaction error:", error)
        throw error
      } finally {
        client.release()
      }
    }
  } catch (error) {
    console.error("Failed to initialize database connection:", error)
    pool = null
    query = null
    transaction = null
  }
} else {
  console.warn("DATABASE_URL not found. Database operations will use mock data.")
}

// Fallback functions when database is not available
if (!query) {
  query = async (text: string, params?: any[]) => {
    console.warn("Database not available, returning mock data for query:", text)
    return { rows: [], rowCount: 0 }
  }
}

if (!transaction) {
  transaction = async (callback: (client: any) => Promise<any>) => {
    console.warn("Database not available, skipping transaction")
    return null
  }
}

export { pool, query, transaction }
