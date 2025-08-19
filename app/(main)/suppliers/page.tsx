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
import { Search, Filter, Plus, MoreHorizontal, Building2, Phone, Mail, MapPin, Star, Edit, Trash2 } from "lucide-react"

interface Supplier {
  id: string
  name: string
  contactPerson: string
  email: string
  phone: string
  address: string
  city: string
  country: string
  category: string
  rating: number
  totalOrders: number
  totalValue: number
  status: "active" | "inactive" | "pending"
  lastOrder: string
}

const suppliers: Supplier[] = [
  {
    id: "1",
    name: "TechCorp Ltd",
    contactPerson: "John Smith",
    email: "john@techcorp.com",
    phone: "+251-11-123-4567",
    address: "Bole Road, Addis Ababa",
    city: "Addis Ababa",
    country: "Ethiopia",
    category: "Network Equipment",
    rating: 4.8,
    totalOrders: 156,
    totalValue: 2450000,
    status: "active",
    lastOrder: "2024-01-15",
  },
  {
    id: "2",
    name: "FiberTech Solutions",
    contactPerson: "Sarah Johnson",
    email: "sarah@fibertech.com",
    phone: "+251-11-234-5678",
    address: "Kazanchis, Addis Ababa",
    city: "Addis Ababa",
    country: "Ethiopia",
    category: "Connectivity",
    rating: 4.6,
    totalOrders: 89,
    totalValue: 1850000,
    status: "active",
    lastOrder: "2024-01-12",
  },
  {
    id: "3",
    name: "NetworkPro Inc",
    contactPerson: "Michael Brown",
    email: "michael@networkpro.com",
    phone: "+251-11-345-6789",
    address: "Megenagna, Addis Ababa",
    city: "Addis Ababa",
    country: "Ethiopia",
    category: "Network Equipment",
    rating: 4.2,
    totalOrders: 67,
    totalValue: 980000,
    status: "inactive",
    lastOrder: "2023-12-20",
  },
  {
    id: "4",
    name: "Samsung Ethiopia",
    contactPerson: "Kim Lee",
    email: "kim@samsung.et",
    phone: "+251-11-456-7890",
    address: "CMC Road, Addis Ababa",
    city: "Addis Ababa",
    country: "Ethiopia",
    category: "Mobile Devices",
    rating: 4.9,
    totalOrders: 234,
    totalValue: 5670000,
    status: "active",
    lastOrder: "2024-01-16",
  },
  {
    id: "5",
    name: "AccessoryWorld",
    contactPerson: "David Wilson",
    email: "david@accessoryworld.com",
    phone: "+251-11-567-8901",
    address: "Piassa, Addis Ababa",
    city: "Addis Ababa",
    country: "Ethiopia",
    category: "Accessories",
    rating: 3.8,
    totalOrders: 45,
    totalValue: 340000,
    status: "pending",
    lastOrder: "2024-01-10",
  },
]

const getStatusBadge = (status: string) => {
  switch (status) {
    case "active":
      return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Active</Badge>
    case "inactive":
      return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">Inactive</Badge>
    case "pending":
      return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">Pending</Badge>
    default:
      return <Badge variant="secondary">Unknown</Badge>
  }
}

const renderStars = (rating: number) => {
  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star key={star} className={`h-4 w-4 ${star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
      ))}
      <span className="text-sm text-muted-foreground ml-1">({rating})</span>
    </div>
  )
}

export default function SuppliersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredSuppliers, setFilteredSuppliers] = useState(suppliers)

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    const filtered = suppliers.filter(
      (supplier) =>
        supplier.name.toLowerCase().includes(term.toLowerCase()) ||
        supplier.contactPerson.toLowerCase().includes(term.toLowerCase()) ||
        supplier.category.toLowerCase().includes(term.toLowerCase()),
    )
    setFilteredSuppliers(filtered)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight transition-colors duration-200 hover:text-gray-800">Supplier Management</h1>
          <p className="text-muted-foreground transition-colors duration-200 hover:text-gray-600">Manage supplier relationships and performance tracking</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 transition-all duration-300 hover:scale-105 hover:shadow-lg">
          <Plus className="h-4 w-4 mr-2 transition-transform duration-300 hover:scale-110" />
          Add Supplier
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="transition-all duration-300 hover:shadow-lg hover:border-gray-300">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg transition-colors duration-200 hover:text-gray-800">Supplier Directory</CardTitle>
          <CardDescription className="text-sm transition-colors duration-200 hover:text-gray-600">Search and filter suppliers by various criteria</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center space-x-2 mb-3">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground transition-colors duration-200 hover:text-gray-600" />
              <Input
                placeholder="Search suppliers, contacts, or categories..."
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

          {/* Suppliers Table */}
          <div className="border rounded-lg transition-all duration-300 hover:shadow-md">
            <Table>
              <TableHeader>
                <TableRow className="h-8 hover:bg-gray-50 transition-colors duration-200">
                  <TableHead className="text-xs font-semibold py-1 px-2 transition-colors duration-200 hover:text-gray-800">Supplier</TableHead>
                  <TableHead className="text-xs font-semibold py-1 px-2 transition-colors duration-200 hover:text-gray-800">Contact</TableHead>
                  <TableHead className="text-xs font-semibold py-1 px-2 transition-colors duration-200 hover:text-gray-800">Category</TableHead>
                  <TableHead className="text-xs font-semibold py-1 px-2 transition-colors duration-200 hover:text-gray-800">Rating</TableHead>
                  <TableHead className="text-xs font-semibold py-1 px-2 transition-colors duration-200 hover:text-gray-800">Performance</TableHead>
                  <TableHead className="text-xs font-semibold py-1 px-2 transition-colors duration-200 hover:text-gray-800">Status</TableHead>
                  <TableHead className="text-xs font-semibold py-1 px-2 transition-colors duration-200 hover:text-gray-800">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSuppliers.map((supplier) => (
                  <TableRow key={supplier.id} className="h-10 transition-all duration-300 hover:bg-gray-50 hover:shadow-sm hover:scale-[1.01] cursor-pointer">
                    <TableCell className="py-1 px-2">
                      <div className="flex items-center space-x-2">
                        <div className="p-2 rounded-full bg-blue-100 transition-all duration-300 hover:bg-blue-200 hover:scale-110">
                          <Building2 className="h-4 w-4 text-blue-600 transition-transform duration-300 hover:scale-110" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-medium truncate transition-colors duration-200 hover:text-gray-800">{supplier.name}</div>
                          <div className="text-xs text-muted-foreground transition-colors duration-200 hover:text-gray-600">{supplier.city}, {supplier.country}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-1 px-2">
                      <div className="min-w-0">
                        <div className="text-xs font-medium truncate transition-colors duration-200 hover:text-gray-800">{supplier.contactPerson}</div>
                        <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                          <Phone className="h-3 w-3 transition-transform duration-300 hover:scale-110" />
                          <span className="transition-colors duration-200 hover:text-gray-600">{supplier.phone}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                          <Mail className="h-3 w-3 transition-transform duration-300 hover:scale-110" />
                          <span className="transition-colors duration-200 hover:text-gray-600">{supplier.email}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-1 px-2">
                      <Badge variant="secondary" className="text-xs transition-all duration-300 hover:scale-110 hover:bg-gray-200">
                        {supplier.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-1 px-2">
                      <div className="flex items-center space-x-1 transition-all duration-300 hover:scale-110">
                        {renderStars(supplier.rating)}
                        <span className="text-xs font-medium ml-1 transition-colors duration-200 hover:text-gray-800">({supplier.rating})</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-1 px-2">
                      <div className="min-w-0">
                        <div className="text-xs font-medium transition-colors duration-200 hover:text-gray-800">
                          {supplier.totalOrders} orders
                        </div>
                        <div className="text-xs text-muted-foreground transition-all duration-300 hover:scale-110 hover:text-green-600">
                          ${(supplier.totalValue / 1000000).toFixed(1)}M
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-1 px-2">
                      <div className="transition-transform duration-300 hover:scale-110">
                        {getStatusBadge(supplier.status)}
                      </div>
                    </TableCell>
                    <TableCell className="py-1 px-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-6 w-6 transition-all duration-300 hover:scale-110">
                            <MoreHorizontal className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Edit className="h-3 w-3 mr-2" />
                            Edit Supplier
                          </DropdownMenuItem>
                          <DropdownMenuItem>View Orders</DropdownMenuItem>
                          <DropdownMenuItem>Contact Supplier</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>View Performance</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="h-3 w-3 mr-2" />
                            Remove Supplier
                          </DropdownMenuItem>
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
