import { NextResponse } from "next/server"
import { authOptions } from "@/auth"
import { getServerSession } from "next-auth"

export async function GET() {
  try {
    const session = await getServerSession(authOptions as any)
    const user = (session as any)?.user

    if (!user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      )
    }

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
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