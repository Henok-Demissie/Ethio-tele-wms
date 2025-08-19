export const env = {
  DATABASE_URL: process.env.DATABASE_URL || null,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || "your-secret-key",
  NEXTAUTH_URL: process.env.NEXTAUTH_URL || "http://localhost:3000",
  NODE_ENV: process.env.NODE_ENV || "development",
}

export const isDatabaseAvailable = () => {
  return !!env.DATABASE_URL
}

export const isProduction = () => {
  return env.NODE_ENV === "production"
}

