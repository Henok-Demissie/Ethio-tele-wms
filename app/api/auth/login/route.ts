import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { isDatabaseAvailable } from "@/config/env"

export async function POST(request: NextRequest) {
  try {
    const { email, password, role } = await request.json()

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      )
    }

    // Demo admin accounts for testing
    if (email === "admin@ethiotelecom.et" && password === "admin123") {
      // Check if trying to login as admin
      if (role === "ADMIN") {
        return NextResponse.json(
          { 
            message: "Login successful",
            user: {
              id: "admin-1",
              name: "System Administrator",
              email: "admin@ethiotelecom.et",
              role: "ADMIN",
              department: "IT Administration",
            }
          },
          { status: 200 }
        )
      } else {
        return NextResponse.json(
          { error: "Please use the Admin Login tab for this account" },
          { status: 401 }
        )
      }
    }

    if (email === "admin@example.com" && password === "admin123") {
      // Check if trying to login as admin
      if (role === "ADMIN") {
        return NextResponse.json(
          { 
            message: "Login successful",
            user: {
              id: "demo-admin",
              name: "Demo Admin",
              email: "admin@example.com",
              role: "ADMIN",
              department: "IT Administration",
            }
          },
          { status: 200 }
        )
      } else {
        return NextResponse.json(
          { error: "Please use the Admin Login tab for this account" },
          { status: 401 }
        )
      }
    }
    
    // Demo regular user account
    if (email === "user@example.com" && password === "user123") {
      // Check if trying to login as regular user
      if (role === "USER") {
        return NextResponse.json(
          { 
            message: "Login successful",
            user: {
              id: "demo-user",
              name: "Demo User",
              email: "user@example.com",
              role: "VIEWER",
              department: "Operations",
            }
          },
          { status: 200 }
        )
      } else {
        return NextResponse.json(
          { error: "Please use the User Login tab for this account" },
          { status: 401 }
        )
      }
    }

    // Demo manager account
    if (email === "manager@ethiotelecom.et" && password === "manager123") {
      // Check if trying to login as admin (managers can use admin login)
      if (role === "ADMIN") {
        return NextResponse.json(
          { 
            message: "Login successful",
            user: {
              id: "manager-1",
              name: "Warehouse Manager",
              email: "manager@ethiotelecom.et",
              role: "MANAGER",
              department: "Warehouse",
            }
          },
          { status: 200 }
        )
      } else {
        return NextResponse.json(
          { error: "Please use the Admin Login tab for this account" },
          { status: 401 }
        )
      }
    }

    // If database is not available, return error
    if (!isDatabaseAvailable()) {
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

      // Set user session in response headers
      const response = NextResponse.json(
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
      
      // Set session cookies/headers for the user
      response.headers.set('x-user-id', user.id)
      response.headers.set('x-user-email', user.email)
      
      return response
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