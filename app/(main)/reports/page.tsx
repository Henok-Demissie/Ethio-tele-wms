"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { BarChart3, TrendingUp, Download, Calendar, Package, ShoppingCart, Truck, DollarSign } from "lucide-react"
import { InventoryChart } from "@/components/inventory-chart"
import { OrdersChart } from "@/components/orders-chart"

const reportStats = [
  {
    title: "Total Revenue",
    value: "$2,847,650",
    change: "+12.5%",
    period: "This Month",
    icon: DollarSign,
  },
  {
    title: "Orders Processed",
    value: "1,247",
    change: "+8.2%",
    period: "This Month",
    icon: ShoppingCart,
  },
  {
    title: "Inventory Turnover",
    value: "4.2x",
    change: "+0.3x",
    period: "This Quarter",
    icon: Package,
  },
  {
    title: "Delivery Performance",
    value: "96.8%",
    change: "+2.1%",
    period: "On-time Delivery",
    icon: Truck,
  },
]

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
          <p className="text-muted-foreground">Comprehensive warehouse performance insights and analytics</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Date Range
          </Button>
          <Button size="sm" className="bg-primary hover:bg-primary/90">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {reportStats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <span>{stat.period}</span>
                  <Badge variant="secondary" className="ml-auto">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {stat.change}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Report Tabs */}
      <Tabs defaultValue="inventory" className="space-y-4">
        <TabsList>
          <TabsTrigger value="inventory">Inventory Reports</TabsTrigger>
          <TabsTrigger value="orders">Order Reports</TabsTrigger>
          <TabsTrigger value="financial">Financial Reports</TabsTrigger>
          <TabsTrigger value="performance">Performance Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="inventory" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Inventory Levels by Category</CardTitle>
                <CardDescription>Current stock distribution across product categories</CardDescription>
              </CardHeader>
              <CardContent>
                <InventoryChart />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Stock Movement Analysis</CardTitle>
                <CardDescription>Inventory turnover and movement patterns</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Fast Moving Items</span>
                    <Badge className="bg-green-100 text-green-800">342 items</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Slow Moving Items</span>
                    <Badge className="bg-yellow-100 text-yellow-800">89 items</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Dead Stock</span>
                    <Badge className="bg-red-100 text-red-800">23 items</Badge>
                  </div>
                </div>
                <Button className="w-full bg-transparent" variant="outline">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  View Detailed Analysis
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Order Trends</CardTitle>
              <CardDescription>Monthly order processing and fulfillment trends</CardDescription>
            </CardHeader>
            <CardContent>
              <OrdersChart />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financial" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Analysis</CardTitle>
                <CardDescription>Monthly revenue breakdown and trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-3xl font-bold">$2,847,650</div>
                  <div className="text-sm text-muted-foreground">Total revenue this month (+12.5% from last month)</div>
                  <Button className="w-full bg-transparent" variant="outline">
                    View Revenue Details
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Cost Analysis</CardTitle>
                <CardDescription>Operational costs and efficiency metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Storage Costs</span>
                      <span className="font-medium">$45,200</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Labor Costs</span>
                      <span className="font-medium">$128,500</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Transportation</span>
                      <span className="font-medium">$67,800</span>
                    </div>
                  </div>
                  <Button className="w-full bg-transparent" variant="outline">
                    View Cost Breakdown
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Order Fulfillment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">96.8%</div>
                <div className="text-sm text-muted-foreground">On-time delivery rate</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Accuracy Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">99.2%</div>
                <div className="text-sm text-muted-foreground">Order accuracy</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Processing Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2.4 hrs</div>
                <div className="text-sm text-muted-foreground">Average processing time</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
