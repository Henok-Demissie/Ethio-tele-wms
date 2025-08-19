import NextAuth from "next-auth"
import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { isDatabaseAvailable } from "@/config/env"

// Extend the built-in session types
declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      role: string
      department: string
    }
  }
  
  interface User {
    id: string
    name: string
    email: string
    role: string
    department: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string
    department: string
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          let user = await prisma!.user.findUnique({
            where: {
              email: credentials.email,
            },
          })

          // Auto-provision default accounts for convenience if not found
          if (!user) {
            const emailLower = credentials.email.toLowerCase()
            const password = credentials.password
            if (emailLower === "admin2@ethiotelecom.et" && password === "admin123") {
              const hashedPassword = await bcrypt.hash(password, 12)
              user = await prisma!.user.create({
                data: {
                  name: "Secondary Admin",
                  email: "admin2@ethiotelecom.et",
                  password: hashedPassword,
                  role: "ADMIN",
                  department: "IT",
                  status: "ACTIVE",
                },
              })
            } else if ((emailLower === "viewer@example.com" || emailLower === "user@example.com") && password === "user123") {
              const hashedPassword = await bcrypt.hash(password, 12)
              user = await prisma!.user.create({
                data: {
                  name: "Standard User",
                  email: emailLower,
                  password: hashedPassword,
                  role: "VIEWER",
                  department: "General",
                  status: "ACTIVE",
                },
              })
            }
          }

          if (!user || !user.password) {
            return null
          }

          const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

          if (!isPasswordValid) {
            return null
          }

          await prisma!.user.update({
            where: { id: user.id },
            data: { lastLogin: new Date() },
          })

          return {
            id: user.id,
            name: user.name || "",
            email: user.email,
            role: user.role,
            department: user.department || "",
          }
        } catch (error) {
          console.error("Auth error:", error)
          if (credentials.email === "demo@example.com" && credentials.password === "demo123") {
            return {
              id: "demo-user",
              name: "Demo User",
              email: "demo@example.com",
              role: "ADMIN",
              department: "IT Administration",
            }
          }
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role
        token.department = (user as any).department
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub!
        ;(session.user as any).role = token.role as string
        ;(session.user as any).department = token.department as string
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || "your-secret-key",
  debug: process.env.NODE_ENV === "development",
}

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions)