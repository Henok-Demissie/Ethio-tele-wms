import { NextResponse } from "next/server"

export async function GET() {
  try {
    // For demo purposes, return a demo regular user
    // In a real app, you would check session/JWT tokens
    return NextResponse.json({
      user: {
        id: "demo-user",
        name: "Demo User",
        email: "user@example.com",
        role: "viewer",
        department: "Operations",
      }
    })
  } catch (error) {
    console.error("Error getting current user:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 