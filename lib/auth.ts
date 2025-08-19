// lib/auth.ts
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";
import { authOptions } from "@/auth";
import { getServerSession } from "next-auth";

// Validates credentials and returns the user record without password when valid
export async function signIn(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.password) return null;
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) return null;
  // Exclude password before returning
  const { password: _ignored, ...userWithoutPassword } = user as any;
  return userWithoutPassword;
}

// Returns the currently authenticated user based on NextAuth session
export async function getCurrentUser() {
  const session = await getServerSession(authOptions as any);
  if (!session?.user) return null;
  // Return session user directly to avoid DB dependency
  const user = session.user as any;
  return {
    id: user.id,
    name: user.name || "",
    email: user.email || "",
    role: user.role,
    department: user.department || "",
  } as any;
}
