import { NextResponse } from "next/server"

export async function GET() {
  try {
    // For now, return null to let the frontend handle session via localStorage
    // This prevents the webpack error
    return NextResponse.json({ user: null })
  } catch (error) {
    console.error("Error getting current user:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 