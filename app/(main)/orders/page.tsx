"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Search, Filter, Plus, MoreHorizontal, Eye, Truck, CheckCircle, Clock, AlertCircle } from "lucide-react"

interface Order {
  id: string
  orderNumber: string
  customer: string
  branch: string
  items: number
  totalValue: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  priority: "low" | "medium" | "high" | "urgent"
  orderDate: string
  expectedDelivery: string
}

const orders: Order[] = [
  {
    id: "1",
    orderNumber: "ORD-2024-001",
    customer: "Addis Ababa Branch",
    branch: "Main Office",
    items: 25,
    totalValue: 15750.0,
    status: "processing",
    priority: "high",
    orderDate: "2024-01-15",
    expectedDelivery: "2024-01-20",
  },
  {
    id: "2",
    orderNumber: "ORD-2024-002",
    customer: "Dire Dawa Branch",
    branch: "Regional Office",
    items: 12,
    totalValue: 8900.5,
    status: "shipped",
    priority: "medium",
    orderDate: "2024-01-14",
    expectedDelivery: "2024-01-19",
  },
  {
    id: "3",
    orderNumber: "ORD-2024-003",
    customer: "Bahir Dar Branch",
    branch: "Regional Office",
    items: 8,
    totalValue: 4200.0,
    status: "delivered",
    priority: "low",
    orderDate: "2024-01-12",
    expectedDelivery: "2024-01-17",
  },
  {
    id: "4",
    orderNumber: "ORD-2024-004",
    customer: "Hawassa Branch",
    branch: "Regional Office",
    items: 35,
    totalValue: 22100.75,
    status: "pending",
    priority: "urgent",
    orderDate: "2024-01-16",
    expectedDelivery: "2024-01-21",
  },
  {
    id: "5",
    orderNumber: "ORD-2024-005",
    customer: "Mekelle Branch",
    branch: "Regional Office",
    items: 18,
    totalValue: 11250.0,
    status: "cancelled",
    priority: "medium",
    orderDate: "2024-01-13",
    expectedDelivery: "2024-01-18",
  },
]

const getStatusIcon = (status: string) => {
  switch (status) {
    case "pending":
      return <Clock className="h-4 w-4 text-yellow-500" />
    case "processing":
      return <AlertCircle className="h-4 w-4 text-blue-500" />
    case "shipped":
      return <Truck className="h-4 w-4 text-purple-500" />
    case "delivered":
      return <CheckCircle className="h-4 w-4 text-green-500" />
    case "cancelled":
      return <AlertCircle className="h-4 w-4 text-red-500" />
    default:
      return <Clock className="h-4 w-4 text-gray-500" />
  }
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "pending":
      return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 text-xs px-2 py-0.5">Pending</Badge>
    case "processing":
      return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 text-xs px-2 py-0.5">Processing</Badge>
    case "shipped":
      return <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 text-xs px-2 py-0.5">Shipped</Badge>
    case "delivered":
      return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 text-xs px-2 py-0.5">Delivered</Badge>
    case "cancelled":
      return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 text-xs px-2 py-0.5">Cancelled</Badge>
    default:
      return <Badge variant="secondary" className="text-xs px-2 py-0.5">Unknown</Badge>
  }
}

const getPriorityBadge = (priority: string) => {
  switch (priority) {
    case "urgent":
      return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 text-xs px-2 py-0.5">Urgent</Badge>
    case "high":
      return <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300 text-xs px-2 py-0.5">High</Badge>
    case "medium":
      return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 text-xs px-2 py-0.5">Medium</Badge>
    case "low":
      return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 text-xs px-2 py-0.5">Low</Badge>
    default:
      return <Badge variant="secondary" className="text-xs px-2 py-0.5">Normal</Badge>
  }
}

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredOrders, setFilteredOrders] = useState(orders)

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    const filtered = orders.filter(
      (order) =>
        order.orderNumber.toLowerCase().includes(term.toLowerCase()) ||
        order.customer.toLowerCase().includes(term.toLowerCase()) ||
        order.branch.toLowerCase().includes(term.toLowerCase()),
    )
    setFilteredOrders(filtered)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight transition-colors duration-200 hover:text-gray-800">Order Management</h1>
          <p className="text-muted-foreground transition-colors duration-200 hover:text-gray-600">Track and manage all warehouse orders and shipments</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 transition-all duration-300 hover:scale-105 hover:shadow-lg">
          <Plus className="h-4 w-4 mr-2 transition-transform duration-300 hover:scale-110" />
          Create Order
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="transition-all duration-300 hover:shadow-lg hover:border-gray-300">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg transition-colors duration-200 hover:text-gray-800">Order Tracking</CardTitle>
          <CardDescription className="text-sm transition-colors duration-200 hover:text-gray-600">Monitor order status and manage fulfillment process</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center space-x-2 mb-3">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground transition-colors duration-200 hover:text-gray-600" />
              <Input
                placeholder="Search orders, customer, or branch..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-7 h-8 text-sm transition-all duration-300 hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>
            <Button variant="outline" size="sm" className="h-8 transition-all duration-300 hover:scale-105 hover:shadow-md hover:bg-gray-50">
              <Filter className="h-3.5 w-3.5 mr-2 transition-transform duration-300 hover:scale-110" />
              Filter
            </Button>
          </div>

          {/* Orders Table */}
          <div className="border rounded-lg transition-all duration-300 hover:shadow-md">
            <Table>
              <TableHeader>
                <TableRow className="h-8 hover:bg-gray-50 transition-colors duration-200">
                  <TableHead className="text-xs font-semibold py-1 px-2 transition-colors duration-200 hover:text-gray-800">Order</TableHead>
                  <TableHead className="text-xs font-semibold py-1 px-2 transition-colors duration-200 hover:text-gray-800">Customer</TableHead>
                  <TableHead className="text-xs font-semibold py-1 px-2 transition-colors duration-200 hover:text-gray-800">Items</TableHead>
                  <TableHead className="text-xs font-semibold py-1 px-2 transition-colors duration-200 hover:text-gray-800">Total Value</TableHead>
                  <TableHead className="text-xs font-semibold py-1 px-2 transition-colors duration-200 hover:text-gray-800">Priority</TableHead>
                  <TableHead className="text-xs font-semibold py-1 px-2 transition-colors duration-200 hover:text-gray-800">Status</TableHead>
                  <TableHead className="text-xs font-semibold py-1 px-2 transition-colors duration-200 hover:text-gray-800">Expected Delivery</TableHead>
                  <TableHead className="text-xs font-semibold py-1 px-2 transition-colors duration-200 hover:text-gray-800">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id} className="h-10 transition-all duration-300 hover:bg-gray-50 hover:shadow-sm hover:scale-[1.01] cursor-pointer">
                    <TableCell className="py-1 px-2">
                      <div className="flex items-center space-x-2">
                        <div className="transition-transform duration-300 hover:scale-110">
                          {getStatusIcon(order.status)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-medium truncate transition-colors duration-200 hover:text-gray-800">{order.orderNumber}</div>
                          <div className="text-xs text-muted-foreground transition-colors duration-200 hover:text-gray-600">
                            {new Date(order.orderDate).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-1 px-2">
                      <div className="min-w-0">
                        <div className="text-xs font-medium truncate transition-colors duration-200 hover:text-gray-800">{order.customer}</div>
                        <div className="text-xs text-muted-foreground truncate transition-colors duration-200 hover:text-gray-600">{order.branch}</div>
                      </div>
                    </TableCell>
                    <TableCell className="py-1 px-2">
                      <span className="text-xs font-medium transition-colors duration-200 hover:text-gray-800">{order.items}</span>
                      <span className="text-xs text-muted-foreground transition-colors duration-200 hover:text-gray-600"> items</span>
                    </TableCell>
                    <TableCell className="py-1 px-2">
                      <span className="text-xs font-medium transition-all duration-300 hover:scale-110 hover:text-green-600">${order.totalValue.toLocaleString()}</span>
                    </TableCell>
                    <TableCell className="py-1 px-2">
                      <div className="transition-transform duration-300 hover:scale-110">
                        {getPriorityBadge(order.priority)}
                      </div>
                    </TableCell>
                    <TableCell className="py-1 px-2">
                      <div className="transition-transform duration-300 hover:scale-110">
                        {getStatusBadge(order.status)}
                      </div>
                    </TableCell>
                    <TableCell className="py-1 px-2">
                      <div className="text-xs">{new Date(order.expectedDelivery).toLocaleDateString()}</div>
                    </TableCell>
                    <TableCell className="py-1 px-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-6 w-6">
                            <MoreHorizontal className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Eye className="h-3 w-3 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Truck className="h-3 w-3 mr-2" />
                            Track Shipment
                          </DropdownMenuItem>
                          <DropdownMenuItem>Update Status</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>Print Invoice</DropdownMenuItem>
                          <DropdownMenuItem>Download PDF</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
