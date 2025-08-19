"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Warehouse,
  TrendingUp,
  Settings,
  FileText,
  AlertTriangle,
  ArrowUpCircle,
  ArrowDownCircle,
  Building2,
} from "lucide-react"

const coreOperations = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Inventory", href: "/inventory", icon: Package },
  { name: "Orders", href: "/orders", icon: ShoppingCart },
  { name: "Suppliers", href: "/suppliers", icon: Building2 },
]

const managementAnalytics = [
  { name: "Warehouses", href: "/warehouses", icon: Warehouse },
  { name: "Users", href: "/users", icon: Users },
  { name: "Reports", href: "/reports", icon: TrendingUp },
  { name: "Alerts", href: "/alerts", icon: AlertTriangle },
  { name: "Documents", href: "/documents", icon: FileText },
  { name: "Settings", href: "/settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const { user } = useAuth()
  const role = (user?.role || "VIEWER").toUpperCase()

  // Only true for ADMIN; hide admin-only layouts for all other roles
  const isAdmin = role === "ADMIN"

  return (
    <div className="flex flex-col w-64 bg-white shadow-lg h-screen transition-all duration-300 hover:shadow-xl">
      {/* Fixed Logo Header */}
      <div className="flex items-center justify-center h-20 px-4 bg-[hsl(82.7,78%,55.5%)] flex-shrink-0 transition-all duration-300 hover:bg-[hsl(82.7,78%,60%)]">
        <img src="/logo.png" alt="EthioTelecom Logo" className="h-12 w-auto transition-transform duration-300 hover:scale-110" />
      </div>

      {/* Scrollable Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-6 overflow-y-auto overflow-x-hidden">
        {/* Core Operations Section */}
        <div className="space-y-2">
          <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider transition-colors duration-200 hover:text-gray-700">
            Core Operations
          </h3>
          {coreOperations
            // For non-admins, hide Suppliers
            .filter((item) => isAdmin || item.name !== "Suppliers")
            .map((item) => {
            const isActive = pathname === item.href
            return (
              <Link key={item.name} href={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start transition-all duration-300 transform hover:scale-105 hover:shadow-md",
                    isActive 
                      ? "bg-[hsl(82.7,78%,55.5%)]/10 text-[hsl(82.7,78%,35%)] hover:bg-[hsl(82.7,78%,55.5%)]/20 hover:shadow-lg" 
                      : "hover:bg-gray-100 hover:text-gray-900 hover:shadow-sm"
                  )}
                >
                  <item.icon className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                  {item.name}
                </Button>
              </Link>
            )
          })}
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 transition-colors duration-200 hover:border-gray-300"></div>

        {/* Management & Analytics Section (Admin only) */}
        {isAdmin && (
          <div className="space-y-2">
            <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider transition-colors duration-200 hover:text-gray-700">
              Management & Analytics
            </h3>
            {managementAnalytics.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start transition-all duration-300 transform hover:scale-105 hover:shadow-md",
                      isActive 
                        ? "bg-[hsl(82.7,78%,55.5%)]/10 text-[hsl(82.7,78%,35%)] hover:bg-[hsl(82.7,78%,55.5%)]/20 hover:shadow-lg" 
                        : "hover:bg-gray-100 hover:text-gray-900 hover:shadow-sm"
                    )}
                  >
                    <item.icon className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                    {item.name}
                  </Button>
                </Link>
              )
            })}
          </div>
        )}
      </nav>
    </div>
  )
}
