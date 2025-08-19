import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST() {
  try {
    const cookieStore = await cookies()
    // Clear NextAuth and legacy session cookies
    cookieStore.delete("__Secure-next-auth.session-token")
    cookieStore.delete("next-auth.session-token")
    cookieStore.delete("session_token")

    return NextResponse.json({ message: "Logged out successfully" }, { status: 200 })
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}