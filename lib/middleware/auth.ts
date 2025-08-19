import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function authenticateUser(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return null
    }

    const token = authHeader.substring(7)

    // In a real application, you would verify the JWT token here
    // For now, we'll use a simple user lookup
    const result = await query("SELECT id, name, email, role, department FROM users WHERE id = $1 AND status = $2", [
      token,
      "active",
    ])

    if (result.rows.length === 0) {
      return null
    }

    return result.rows[0]
  } catch (error) {
    console.error("Authentication error:", error)
    return null
  }
}

export function requireAuth(handler: Function) {
  return async (request: NextRequest) => {
    const user = await authenticateUser(request)

    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }
    // Add user to request context
    ;(request as any).user = user

    return handler(request)
  }
}

export function requireRole(roles: string[]) {
  return (handler: Function) => {
    return async (request: NextRequest) => {
      const user = await authenticateUser(request)

      if (!user) {
        return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
      }

      if (!roles.includes(user.role)) {
        return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 })
      }
      ;(request as any).user = user

      return handler(request)
    }
  }
}
