// lib/auth.ts
import { prisma } from "./prisma";
import { UserAccount } from "./types";

// Export the User type for compatibility
export type User = UserAccount;

// Export signIn if needed
export async function signIn(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return null;
  
  // Convert Prisma user to UserAccount type
  return {
    id: user.id,
    name: user.name || '',
    email: user.email,
    role: user.role as UserAccount['role'],
    department: user.department || '',
    status: user.status as UserAccount['status'],
    lastLogin: user.lastLogin?.toISOString() || new Date().toISOString(),
    createdDate: user.createdAt.toISOString(),
    permissions: [], // You can add permissions logic here
    avatar: user.image || undefined
  };
}

// Export getCurrentUser
export async function getCurrentUser(): Promise<UserAccount | null> {
  try {
    // For now, get the first user as a placeholder
    // In a real app, you'd get this from the session
    const user = await prisma.user.findFirst();
    if (!user) return null;
    
    return {
      id: user.id,
      name: user.name || '',
      email: user.email,
      role: user.role as UserAccount['role'],
      department: user.department || '',
      status: user.status as UserAccount['status'],
      lastLogin: user.lastLogin?.toISOString() || new Date().toISOString(),
      createdDate: user.createdAt.toISOString(),
      permissions: [], // You can add permissions logic here
      avatar: user.image || undefined
    };
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}
