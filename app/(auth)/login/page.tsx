"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Building2 } from "lucide-react"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"

export default function LoginPage() {
  const [userEmail, setUserEmail] = useState("")
  const [userPassword, setUserPassword] = useState("")
  const [adminEmail, setAdminEmail] = useState("")
  const [adminPassword, setAdminPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (
    e: React.FormEvent,
    mode: "user" | "admin",
  ) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const email = mode === "user" ? userEmail : adminEmail
    const password = mode === "user" ? userPassword : adminPassword

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, role: mode.toUpperCase() }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Invalid email or password")
      } else {
        // Check if the user role matches the login mode
        const userRole = data.user.role?.toUpperCase()
        const expectedRole = mode.toUpperCase()
        
        // For admin login, only allow ADMIN, MANAGER, SUPERVISOR roles
        if (mode === "admin" && !["ADMIN", "MANAGER", "SUPERVISOR"].includes(userRole)) {
          setError("Access denied. Admin privileges required.")
          return
        }
        
        // For user login, only allow regular user roles
        if (mode === "user" && ["ADMIN", "MANAGER", "SUPERVISOR"].includes(userRole)) {
          setError("Please use the Admin Login tab for administrative accounts.")
          return
        }

        // Store user session in localStorage
        localStorage.setItem('wms-user', JSON.stringify(data.user))
        
        // Redirect based on role
        if (["ADMIN", "MANAGER", "SUPERVISOR"].includes(userRole)) {
          window.location.href = "/dashboard"
        } else {
          window.location.href = "/dashboard"
        }
      }
    } catch (error) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="w-full max-w-md">
        <Carousel className="w-full">
          <CarouselContent>
            <CarouselItem>
              <Card className="w-full">
                <CardHeader className="space-y-1 text-center">
                  <div className="flex items-center justify-center mb-4">
                    <img src="/logo.png" alt="EthioTelecom Logo" className="h-12 w-auto" />
                  </div>
                  <CardTitle className="text-2xl font-bold">User Login</CardTitle>
                  <CardDescription>Warehouse Management System</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <form onSubmit={(e) => handleSubmit(e, "user")} className="space-y-4">
                    {error && (
                      <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="user-email">Email</Label>
                      <Input
                        id="user-email"
                        type="email"
                        placeholder="Enter your email"
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                        required
                        disabled={isLoading}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="user-password">Password</Label>
                      <Input
                        id="user-password"
                        type="password"
                        placeholder="Enter your password"
                        value={userPassword}
                        onChange={(e) => setUserPassword(e.target.value)}
                        required
                        disabled={isLoading}
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-[hsl(82.7,78%,55.5%)] hover:bg-[hsl(82.7,78%,45%)] text-white"
                      disabled={isLoading}
                    >
                      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Sign In
                    </Button>
                  </form>

                  <div className="space-y-2 text-center text-sm">
                    <Link href="/forgot-password" className="text-[hsl(82.7,78%,55.5%)] hover:underline">
                      Forgot your password?
                    </Link>
                    <div>
                      Don't have an account?{" "}
                      <Link href="/signup" className="text-[hsl(82.7,78%,55.5%)] hover:underline font-medium">
                        Sign up
                      </Link>
                    </div>
                    <div className="text-xs text-gray-500 mt-4 p-3 bg-gray-50 rounded-lg">
                      <strong>Demo User Account:</strong><br/>
                      Email: user@example.com<br/>
                      Password: user123
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>

            <CarouselItem>
              <Card className="w-full">
                <CardHeader className="space-y-1 text-center">
                  <div className="flex items-center justify-center mb-4">
                    <img src="/logo.png" alt="EthioTelecom Logo" className="h-12 w-auto" />
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Building2 className="h-5 w-5 text-muted-foreground" />
                    <CardTitle className="text-2xl font-bold">Admin Login</CardTitle>
                  </div>
                  <CardDescription>Warehouse Management System</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <form onSubmit={(e) => handleSubmit(e, "admin")} className="space-y-4">
                    {error && (
                      <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="admin-email">Email</Label>
                      <Input
                        id="admin-email"
                        type="email"
                        placeholder="Enter your admin email"
                        value={adminEmail}
                        onChange={(e) => setAdminEmail(e.target.value)}
                        required
                        disabled={isLoading}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="admin-password">Password</Label>
                      <Input
                        id="admin-password"
                        type="password"
                        placeholder="Enter your admin password"
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        required
                        disabled={isLoading}
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-[hsl(82.7,78%,55.5%)] hover:bg-[hsl(82.7,78%,45%)] text-white"
                      disabled={isLoading}
                    >
                      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Sign In
                    </Button>
                  </form>

                  <div className="space-y-2 text-center text-sm">
                    <Link href="/forgot-password" className="text-[hsl(82.7,78%,55.5%)] hover:underline">
                      Forgot your password?
                    </Link>
                    <div>
                      Don't have an account?{" "}
                      <Link href="/signup" className="text-[hsl(82.7,78%,55.5%)] hover:underline font-medium">
                        Sign up
                      </Link>
                    </div>
                    <div className="text-xs text-gray-500 mt-4 p-3 bg-gray-50 rounded-lg">
                      <strong>Demo Admin Accounts:</strong><br/>
                      Email: admin@ethiotelecom.et | Password: admin123<br/>
                      Email: admin@example.com | Password: admin123<br/>
                      Email: manager@ethiotelecom.et | Password: manager123
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </div>
  )
}
