"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { 
  Package, 
  ArrowDownToLine, 
  ArrowUpFromLine, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  TrendingDown,
  Warehouse,
  Users,
  FileText,
  BarChart3,
  Eye,
  Loader2,
  Box
} from "lucide-react"
import { toast } from "sonner"

interface DashboardStats {
  totalProducts: number
  totalWarehouses: number
  totalUsers: number
  totalOrders: number
  stockInStats: {
    todayReceipts: number
    itemsReceived: number
    pendingReceipts: number
    qualityIssues: number
  }
  stockOutStats: {
    todayRequests: number
    itemsShipped: number
    pendingRequests: number
    completed: number
  }
  recentActivities: any[]
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedReport, setSelectedReport] = useState<string | null>(null)
  const [reportData, setReportData] = useState<any[]>([])
  const [reportLoading, setReportLoading] = useState(false)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const [statsRes, activitiesRes] = await Promise.all([
        fetch("/api/dashboard/stats"),
        fetch("/api/dashboard/activities")
      ])

      if (statsRes.ok) {
        const statsData = await statsRes.json()
        setStats(statsData)
      } else {
        // Fallback data if API fails
        setStats({
          totalProducts: 0,
          totalWarehouses: 0,
          totalUsers: 0,
          totalOrders: 0,
          stockInStats: {
            todayReceipts: 0,
            itemsReceived: 0,
            pendingReceipts: 0,
            qualityIssues: 0
          },
          stockOutStats: {
            todayRequests: 0,
            itemsShipped: 0,
            pendingRequests: 0,
            completed: 0
          },
          recentActivities: []
        })
      }

      if (activitiesRes.ok) {
        const activitiesData = await activitiesRes.json()
        setStats(prev => prev ? { ...prev, recentActivities: activitiesData.activities } : null)
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
      toast.error("Failed to fetch dashboard data")
      // Set fallback data
      setStats({
        totalProducts: 0,
        totalWarehouses: 0,
        totalUsers: 0,
        totalOrders: 0,
        stockInStats: {
          todayReceipts: 0,
          itemsReceived: 0,
          pendingReceipts: 0,
          qualityIssues: 0
        },
        stockOutStats: {
          todayRequests: 0,
          itemsShipped: 0,
          pendingRequests: 0,
          completed: 0
        },
        recentActivities: []
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCardClick = async (reportType: string) => {
    setSelectedReport(reportType)
    setReportLoading(true)
    
    try {
      let endpoint = ""
      let title = ""
      
      switch (reportType) {
        case "stockIn":
          endpoint = "/api/stock-in"
          title = "Stock-In Report"
          break
        case "stockOut":
          endpoint = "/api/stock-out"
          title = "Stock-Out Report"
          break
        case "inventory":
          endpoint = "/api/inventory"
          title = "Inventory Report"
          break
        case "orders":
          endpoint = "/api/orders"
          title = "Orders Report"
          break
        default:
          return
      }

      const response = await fetch(endpoint)
      if (response.ok) {
        const data = await response.json()
        setReportData(data[Object.keys(data)[0]] || [])
      }
    } catch (error) {
      console.error("Error fetching report data:", error)
      toast.error("Failed to fetch report data")
    } finally {
      setReportLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "COMPLETED":
      case "RECEIVED":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Completed</Badge>
      case "PENDING":
        return <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300">Pending</Badge>
      case "CANCELLED":
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">Cancelled</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading dashboard...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight transition-colors duration-200 hover:text-gray-800">Welcome back, {user?.name || 'User'}!</h1>
          <p className="text-muted-foreground transition-colors duration-200 hover:text-gray-600">Here's what's happening in your warehouse today</p>
        </div>
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={fetchDashboardData}
            disabled={loading}
            className="flex items-center gap-2 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-gray-50"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <BarChart3 className="h-4 w-4 transition-transform duration-300 hover:scale-110" />
            )}
            Refresh Data
          </Button>
          <div className="text-right transition-all duration-200 hover:scale-105">
            <p className="text-sm text-muted-foreground transition-colors duration-200 hover:text-gray-600">Ethio Telecom</p>
            <p className="text-lg font-semibold transition-colors duration-200 hover:text-gray-800">Warehouse Dashboard</p>
          </div>
        </div>
      </div>

      {/* Main Dashboard Cards */}
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        {/* Stock-In Overview */}
        <Card 
          className="hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-0 hover:border-blue-200 hover:from-blue-100 hover:to-blue-200"
          onClick={() => handleCardClick("stockIn")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
            <CardTitle className="text-xs font-medium transition-colors duration-200 hover:text-blue-800">Stock-In Overview</CardTitle>
            <ArrowDownToLine className="h-3 w-3 text-blue-600 transition-transform duration-300 hover:scale-125" />
          </CardHeader>
          <CardContent className="pb-3">
            <div className="text-lg font-bold text-blue-600 transition-all duration-300 hover:scale-110">
              {stats?.stockInStats.todayReceipts || 0}
            </div>
            <p className="text-xs text-muted-foreground transition-colors duration-200 hover:text-blue-700">Today's Receipts</p>
            <div className="mt-1 space-y-0.5">
              <div className="flex justify-between text-xs transition-colors duration-200 hover:text-blue-800">
                <span>Items Received:</span>
                <span className="font-medium">{stats?.stockInStats.itemsReceived || 0}</span>
              </div>
              <div className="flex justify-between text-xs transition-colors duration-200 hover:text-blue-800">
                <span>Pending:</span>
                <span className="font-medium text-orange-600">{stats?.stockInStats.pendingReceipts || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stock-Out Overview */}
        <Card 
          className="hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-0 hover:border-green-200 hover:from-green-100 hover:to-green-200"
          onClick={() => handleCardClick("stockOut")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
            <CardTitle className="text-xs font-medium transition-colors duration-200 hover:text-green-800">Stock-Out Overview</CardTitle>
            <ArrowUpFromLine className="h-3 w-3 text-green-600 transition-transform duration-300 hover:scale-125" />
          </CardHeader>
          <CardContent className="pb-3">
            <div className="text-lg font-bold text-green-600 transition-all duration-300 hover:scale-110">
              {stats?.stockOutStats.todayRequests || 0}
            </div>
            <p className="text-xs text-muted-foreground transition-colors duration-200 hover:text-green-700">Today's Requests</p>
            <div className="mt-1 space-y-0.5">
              <div className="flex justify-between text-xs transition-colors duration-200 hover:text-green-800">
                <span>Items Shipped:</span>
                <span className="font-medium">{stats?.stockOutStats.itemsShipped || 0}</span>
              </div>
              <div className="flex justify-between text-xs transition-colors duration-200 hover:text-green-800">
                <span>Pending:</span>
                <span className="font-medium text-orange-600">{stats?.stockOutStats.pendingRequests || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Inventory Overview */}
        <Card 
          className="hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-0 hover:border-purple-200 hover:from-purple-100 hover:to-purple-200"
          onClick={() => handleCardClick("inventory")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
            <CardTitle className="text-xs font-medium transition-colors duration-200 hover:text-purple-800">Inventory Overview</CardTitle>
            <Package className="h-3 w-3 text-purple-600 transition-transform duration-300 hover:scale-125" />
          </CardHeader>
          <CardContent className="pb-3">
            <div className="text-lg font-bold text-purple-600 transition-all duration-300 hover:scale-110">
              {stats?.totalProducts || 0}
            </div>
            <p className="text-xs text-muted-foreground transition-colors duration-200 hover:text-purple-700">Total Products</p>
            <div className="mt-1 space-y-0.5">
              <div className="flex justify-between text-xs transition-colors duration-200 hover:text-purple-800">
                <span>Warehouses:</span>
                <span className="font-medium">{stats?.totalWarehouses || 0}</span>
              </div>
              <div className="flex justify-between text-xs transition-colors duration-200 hover:text-purple-800">
                <span>Low Stock:</span>
                <span className="font-medium text-red-600">{stats?.totalProducts || 12}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders Overview */}
        <Card 
          className="hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-0 hover:border-orange-200 hover:from-orange-100 hover:to-orange-200"
          onClick={() => handleCardClick("orders")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
            <CardTitle className="text-xs font-medium transition-colors duration-200 hover:text-orange-800">Orders Overview</CardTitle>
            <FileText className="h-3 w-3 text-orange-600 transition-transform duration-300 hover:scale-125" />
          </CardHeader>
          <CardContent className="pb-3">
            <div className="text-lg font-bold text-orange-600 transition-all duration-300 hover:scale-110">
              {stats?.totalOrders || 0}
            </div>
            <p className="text-xs text-muted-foreground transition-colors duration-200 hover:text-orange-700">Total Orders</p>
            <div className="mt-1 space-y-0.5">
              <div className="flex justify-between text-xs transition-colors duration-200 hover:text-orange-800">
                <span>Active:</span>
                <span className="font-medium text-green-600">8</span>
              </div>
              <div className="flex justify-between text-xs transition-colors duration-200 hover:text-orange-800">
                <span>Pending:</span>
                <span className="font-medium text-yellow-600">5</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Status & Overview Cards - Horizontally Scrollable */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold transition-colors duration-200 hover:text-gray-800">Status & Overview</h2>
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-4 min-w-max">
            {/* Inventory Status Cards */}
            <Card className="min-w-[200px] hover:shadow-xl transition-all duration-300 hover:scale-105 hover:border-gray-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
                <CardTitle className="text-xs font-medium transition-colors duration-200 hover:text-gray-800">Total Items</CardTitle>
                <Package className="h-3 w-3 text-muted-foreground transition-transform duration-300 hover:scale-125" />
              </CardHeader>
              <CardContent className="pb-3">
                <div className="text-lg font-bold transition-all duration-300 hover:scale-110">1,247</div>
                <p className="text-xs text-muted-foreground transition-colors duration-200 hover:text-gray-600">Across all warehouses</p>
              </CardContent>
            </Card>

            <Card className="min-w-[200px] hover:shadow-xl transition-all duration-300 hover:scale-105 hover:border-gray-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
                <CardTitle className="text-xs font-medium transition-colors duration-200 hover:text-gray-800">Total Stock</CardTitle>
                <Box className="h-3 w-3 text-muted-foreground transition-transform duration-300 hover:scale-125" />
              </CardHeader>
              <CardContent className="pb-3">
                <div className="text-lg font-bold transition-all duration-300 hover:scale-110">45,892</div>
                <p className="text-xs text-muted-foreground transition-colors duration-200 hover:text-gray-600">Units in stock</p>
              </CardContent>
            </Card>

            <Card className="min-w-[280px] hover:shadow-xl transition-all duration-300 hover:scale-105 hover:border-gray-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium transition-colors duration-200 hover:text-gray-800">Low Stock Items</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground transition-transform duration-300 hover:scale-125" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600 transition-all duration-300 hover:scale-110">12</div>
                <p className="text-xs text-muted-foreground transition-colors duration-200 hover:text-gray-600">Need attention</p>
              </CardContent>
            </Card>

            <Card className="min-w-[280px] hover:shadow-xl transition-all duration-300 hover:scale-105 hover:border-gray-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium transition-colors duration-200 hover:text-gray-800">Warehouses</CardTitle>
                <Warehouse className="h-4 w-4 text-muted-foreground transition-transform duration-300 hover:scale-125" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold transition-all duration-300 hover:scale-110">3</div>
                <p className="text-xs text-muted-foreground transition-colors duration-200 hover:text-gray-600">Active locations</p>
              </CardContent>
            </Card>

            {/* Warehouse Status Cards */}
            <Card className="min-w-[280px] hover:shadow-xl transition-all duration-300 hover:scale-105 hover:border-gray-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium transition-colors duration-200 hover:text-gray-800">Total Capacity</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground transition-transform duration-300 hover:scale-125" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold transition-all duration-300 hover:scale-110">110,000</div>
                <p className="text-xs text-muted-foreground transition-colors duration-200 hover:text-gray-600">Square feet</p>
              </CardContent>
            </Card>

            <Card className="min-w-[280px] hover:shadow-xl transition-all duration-300 hover:scale-105 hover:border-gray-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium transition-colors duration-200 hover:text-gray-800">Active Staff</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground transition-transform duration-300 hover:scale-125" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold transition-all duration-300 hover:scale-110">50</div>
                <p className="text-xs text-muted-foreground transition-colors duration-200 hover:text-gray-600">Warehouse workers</p>
              </CardContent>
            </Card>

            <Card className="min-w-[280px] hover:shadow-xl transition-all duration-300 hover:scale-105 hover:border-gray-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium transition-colors duration-200 hover:text-gray-800">Avg Utilization</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground transition-transform duration-300 hover:scale-125" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600 transition-all duration-300 hover:scale-110">59.5%</div>
                <p className="text-xs text-muted-foreground transition-colors duration-200 hover:text-gray-600">Capacity used</p>
              </CardContent>
            </Card>

            {/* Additional Status Cards */}
            <Card className="min-w-[280px] hover:shadow-xl transition-all duration-300 hover:scale-105 hover:border-gray-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium transition-colors duration-200 hover:text-gray-800">Quality Issues</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground transition-transform duration-300 hover:scale-125" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600 transition-all duration-300 hover:scale-110">2</div>
                <p className="text-xs text-muted-foreground transition-colors duration-200 hover:text-gray-600">Require attention</p>
              </CardContent>
            </Card>

            <Card className="min-w-[280px] hover:shadow-xl transition-all duration-300 hover:scale-105 hover:border-gray-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium transition-colors duration-200 hover:text-gray-800">Completed Orders</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground transition-transform duration-300 hover:scale-125" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600 transition-all duration-300 hover:scale-110">23</div>
                <p className="text-xs text-muted-foreground transition-colors duration-200 hover:text-gray-600">This week</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Recent Activities Section */}
      <Card className="hover:shadow-xl transition-all duration-300 hover:border-gray-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 transition-colors duration-200 hover:text-gray-800">
            <BarChart3 className="h-5 w-5 transition-transform duration-300 hover:scale-110" />
            Recent Activities
          </CardTitle>
          <CardDescription className="transition-colors duration-200 hover:text-gray-600">Latest warehouse operations and updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats?.recentActivities && stats.recentActivities.length > 0 ? (
              stats.recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300 hover:shadow-md hover:scale-[1.02] hover:border-gray-300">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/20 transition-all duration-300 hover:bg-blue-200 hover:scale-110">
                      <Package className="h-4 w-4 text-blue-600 transition-transform duration-300 hover:scale-110" />
                    </div>
                    <div>
                      <p className="font-medium transition-colors duration-200 hover:text-gray-800">{activity.description}</p>
                      <p className="text-sm text-muted-foreground transition-colors duration-200 hover:text-gray-600">
                        {new Date(activity.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(activity.status)}
                    <Button size="sm" variant="ghost" className="transition-all duration-300 hover:scale-110 hover:bg-gray-100">
                      <Eye className="h-4 w-4 transition-transform duration-300 hover:scale-110" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground transition-colors duration-200 hover:text-gray-600">
                <Package className="h-12 w-12 mx-auto mb-4 opacity-50 transition-transform duration-300 hover:scale-110" />
                <p>No recent activities</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Summary Section */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="hover:shadow-xl transition-all duration-300 hover:border-gray-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 transition-colors duration-200 hover:text-gray-800">
              <TrendingUp className="h-5 w-5 text-green-600 transition-transform duration-300 hover:scale-110" />
              This Week's Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center transition-all duration-200 hover:bg-gray-50 hover:px-2 hover:py-1 hover:rounded">
              <span className="text-sm text-muted-foreground transition-colors duration-200 hover:text-gray-600">Stock-In Efficiency</span>
              <span className="font-semibold text-green-600 transition-all duration-300 hover:scale-110">94%</span>
            </div>
            <div className="flex justify-between items-center transition-all duration-200 hover:bg-gray-50 hover:px-2 hover:py-1 hover:rounded">
              <span className="text-sm text-muted-foreground transition-colors duration-200 hover:text-gray-600">Stock-Out Accuracy</span>
              <span className="font-semibold text-blue-600 transition-all duration-300 hover:scale-110">97%</span>
            </div>
            <div className="flex justify-between items-center transition-all duration-200 hover:bg-gray-50 hover:px-2 hover:py-1 hover:rounded">
              <span className="text-sm text-muted-foreground transition-colors duration-200 hover:text-gray-600">Inventory Turnover</span>
              <span className="font-semibold text-purple-600 transition-all duration-300 hover:scale-110">2.3x</span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-xl transition-all duration-300 hover:border-gray-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 transition-colors duration-200 hover:text-gray-800">
              <AlertTriangle className="h-5 w-5 text-orange-600 transition-transform duration-300 hover:scale-110" />
              Alerts & Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 text-sm transition-all duration-200 hover:bg-red-50 hover:px-2 hover:py-1 hover:rounded cursor-pointer">
              <div className="w-2 h-2 bg-red-500 rounded-full transition-all duration-300 hover:scale-150"></div>
              <span className="transition-colors duration-200 hover:text-red-700">12 items low on stock</span>
            </div>
            <div className="flex items-center gap-2 text-sm transition-all duration-200 hover:bg-yellow-50 hover:px-2 hover:py-1 hover:rounded cursor-pointer">
              <div className="w-2 h-2 bg-yellow-500 rounded-full transition-all duration-300 hover:scale-150"></div>
              <span className="transition-colors duration-200 hover:text-yellow-700">5 pending approvals</span>
            </div>
            <div className="flex items-center gap-2 text-sm transition-all duration-200 hover:bg-blue-50 hover:px-2 hover:py-1 hover:rounded cursor-pointer">
              <div className="w-2 h-2 bg-blue-500 rounded-full transition-all duration-300 hover:scale-150"></div>
              <span className="transition-colors duration-200 hover:text-blue-700">3 quality issues reported</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Report Dialog */}
      <Dialog open={!!selectedReport} onOpenChange={(open) => !open && setSelectedReport(null)}>
        <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedReport === "stockIn" && "Stock-In Report"}
              {selectedReport === "stockOut" && "Stock-Out Report"}
              {selectedReport === "inventory" && "Inventory Report"}
              {selectedReport === "orders" && "Orders Report"}
            </DialogTitle>
            <DialogDescription>
              Detailed report data for the selected category
            </DialogDescription>
          </DialogHeader>
          
          {reportLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="ml-2">Loading report data...</span>
            </div>
          ) : (
            <div className="space-y-4">
              {reportData.length > 0 ? (
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {selectedReport === "stockIn" && (
                          <>
                            <TableHead>Receipt</TableHead>
                            <TableHead>Supplier</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Date</TableHead>
                          </>
                        )}
                        {selectedReport === "stockOut" && (
                          <>
                            <TableHead>Request</TableHead>
                            <TableHead>Warehouse</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Date</TableHead>
                          </>
                        )}
                        {selectedReport === "inventory" && (
                          <>
                            <TableHead>Product</TableHead>
                            <TableHead>SKU</TableHead>
                            <TableHead>Quantity</TableHead>
                            <TableHead>Status</TableHead>
                          </>
                        )}
                        {selectedReport === "orders" && (
                          <>
                            <TableHead>Order</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Date</TableHead>
                          </>
                        )}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reportData.slice(0, 10).map((item, index) => (
                        <TableRow key={index}>
                          {selectedReport === "stockIn" && (
                            <>
                              <TableCell>{item.orderNumber}</TableCell>
                              <TableCell>{item.supplier?.name || 'N/A'}</TableCell>
                              <TableCell>{getStatusBadge(item.status)}</TableCell>
                              <TableCell>{new Date(item.createdAt).toLocaleDateString()}</TableCell>
                            </>
                          )}
                          {selectedReport === "stockOut" && (
                            <>
                              <TableCell>{item.orderNumber}</TableCell>
                              <TableCell>{item.warehouse?.name || 'N/A'}</TableCell>
                              <TableCell>{getStatusBadge(item.status)}</TableCell>
                              <TableCell>{new Date(item.createdAt).toLocaleDateString()}</TableCell>
                            </>
                          )}
                          {selectedReport === "inventory" && (
                            <>
                              <TableCell>{item.name}</TableCell>
                              <TableCell>{item.sku}</TableCell>
                              <TableCell>{item.quantity}</TableCell>
                              <TableCell>
                                {item.quantity > 10 ? (
                                  <Badge className="bg-green-100 text-green-800">In Stock</Badge>
                                ) : item.quantity > 0 ? (
                                  <Badge className="bg-yellow-100 text-yellow-800">Low Stock</Badge>
                                ) : (
                                  <Badge className="bg-red-100 text-red-800">Out of Stock</Badge>
                                )}
                              </TableCell>
                            </>
                          )}
                          {selectedReport === "orders" && (
                            <>
                              <TableCell>{item.orderNumber}</TableCell>
                              <TableCell>{item.customer?.name || 'N/A'}</TableCell>
                              <TableCell>{getStatusBadge(item.status)}</TableCell>
                              <TableCell>{new Date(item.createdAt).toLocaleDateString()}</TableCell>
                            </>
                          )}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No data available for this report</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
