import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { isDatabaseAvailable } from "@/config/env"

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

    // If database is not available, allow demo login
    if (!isDatabaseAvailable()) {
      // Demo admin account
      if (email === "admin@example.com" && password === "admin123") {
        return NextResponse.json(
          { 
            message: "Login successful",
            user: {
              id: "demo-admin",
              name: "Demo Admin",
              email: "admin@example.com",
              role: "admin",
              department: "IT Administration",
            }
          },
          { status: 200 }
        )
      }
      
      // Demo regular user account
      if (email === "user@example.com" && password === "user123") {
        return NextResponse.json(
          { 
            message: "Login successful",
            user: {
              id: "demo-user",
              name: "Demo User",
              email: "user@example.com",
              role: "viewer",
              department: "Operations",
            }
          },
          { status: 200 }
        )
      }
      
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      )
    }

    try {
      const user = await prisma.user.findUnique({
        where: { email },
      })

      if (!user || !user.password) {
        return NextResponse.json(
          { error: "Invalid email or password" },
          { status: 401 }
        )
      }

      const isPasswordValid = await bcrypt.compare(password, user.password)

      if (!isPasswordValid) {
        return NextResponse.json(
          { error: "Invalid email or password" },
          { status: 401 }
        )
      }

      // Update last login
      await prisma.user.update({
        where: { id: user.id },
        data: { lastLogin: new Date() },
      })

      return NextResponse.json(
        { 
          message: "Login successful",
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            department: user.department,
          }
        },
        { status: 200 }
      )
    } catch (error) {
      console.error("Database error:", error)
      return NextResponse.json(
        { error: "Database connection error" },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 