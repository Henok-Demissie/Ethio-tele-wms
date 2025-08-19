import { NextRequest, NextResponse } from "next/server"
import { signIn } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      )
    }

    // Attempt to sign in
    const user = await signIn(email, password)

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      )
    }

    // Session is handled via NextAuth JWT cookie; no manual cookie here

    return NextResponse.json({ message: "Login successful", user }, { status: 200 })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 