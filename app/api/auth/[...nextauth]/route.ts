import NextAuth from "next-auth"
import { authOptions } from "@/auth"

const authHandler = NextAuth(authOptions)
export const { GET, POST } = authHandler
