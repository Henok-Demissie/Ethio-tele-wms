"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { User } from "./auth"

interface AuthContextType {
  user: User | null
  loading: boolean
  signOut: () => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshUser = async () => {
    try {
      // Check localStorage for user session first
      const storedUser = localStorage.getItem('wms-user')
      if (storedUser) {
        const userData = JSON.parse(storedUser)
        setUser(userData)
        setLoading(false)
        return
      }

      const response = await fetch("/api/auth/me")
      if (response.ok) {
        const userData = await response.json()
        if (userData.user) {
          setUser(userData.user)
          localStorage.setItem('wms-user', JSON.stringify(userData.user))
        } else {
          setUser(null)
        }
      } else {
        setUser(null)
      }
    } catch (error) {
      console.error("Error fetching user:", error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      setUser(null)
      localStorage.removeItem('wms-user')
      window.location.href = "/login"
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  useEffect(() => {
    refreshUser()
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, signOut, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
} 