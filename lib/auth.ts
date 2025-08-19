// lib/auth.ts
import { prisma } from "./prisma";

// Export signIn if needed
export async function signIn(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return null;
  return user;
}

// Export getCurrentUser
export async function getCurrentUser() {
  const user = await prisma.user.findFirst(); // Replace with session logic if needed
  return user;
}
