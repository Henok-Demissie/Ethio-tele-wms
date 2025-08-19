import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import crypto from "crypto"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      // Don't reveal if user exists or not for security
      return NextResponse.json(
        { message: "If an account with that email exists, we've sent a password reset link." },
        { status: 200 },
      )
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex")
    const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hour from now

    // Save reset token to database
    await prisma.passwordResetToken.create({
      data: {
        email,
        token: resetToken,
        expires: resetTokenExpiry,
        userId: user.id,
      },
    })

    // In a real app, you would send an email here
    console.log(`Password reset token for ${email}: ${resetToken}`)

    return NextResponse.json(
      {
        message: "If an account with that email exists, we've sent a password reset link.",
        // For demo purposes, include the token (remove in production)
        resetToken: resetToken,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Forgot password error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
