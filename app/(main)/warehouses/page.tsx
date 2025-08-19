"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Building2, MapPin, Package, Users, Activity, Plus } from "lucide-react"

const warehouses = [
  {
    id: "1",
    name: "Main Warehouse - Addis Ababa",
    code: "WH-AA-001",
    address: "Bole Road, Addis Ababa, Ethiopia",
    manager: "Tigist Haile",
    capacity: "50,000 sq ft",
    utilization: 78,
    totalProducts: 2847,
    activeStaff: 24,
    status: "active",
    type: "Distribution Center",
  },
  {
    id: "2",
    name: "Regional Hub - Dire Dawa",
    code: "WH-DD-002",
    address: "Industrial Zone, Dire Dawa, Ethiopia",
    manager: "Ahmed Hassan",
    capacity: "25,000 sq ft",
    utilization: 65,
    totalProducts: 1456,
    activeStaff: 12,
    status: "active",
    type: "Regional Hub",
  },
  {
    id: "3",
    name: "Storage Facility - Bahir Dar",
    code: "WH-BD-003",
    address: "Commercial District, Bahir Dar, Ethiopia",
    manager: "Rahel Mulugeta",
    capacity: "15,000 sq ft",
    utilization: 45,
    totalProducts: 892,
    activeStaff: 8,
    status: "active",
    type: "Storage Facility",
  },
  {
    id: "4",
    name: "Backup Warehouse - Hawassa",
    code: "WH-HW-004",
    address: "Industrial Park, Hawassa, Ethiopia",
    manager: "Solomon Girma",
    capacity: "20,000 sq ft",
    utilization: 30,
    totalProducts: 567,
    activeStaff: 6,
    status: "maintenance",
    type: "Backup Facility",
  },
]

const getStatusBadge = (status: string) => {
  switch (status) {
    case "active":
      return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Active</Badge>
    case "maintenance":
      return (
        <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">Maintenance</Badge>
      )
    case "inactive":
      return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">Inactive</Badge>
    default:
      return <Badge variant="secondary">Unknown</Badge>
  }
}

const getUtilizationColor = (utilization: number) => {
  if (utilization >= 80) return "text-red-600"
  if (utilization >= 60) return "text-yellow-600"
  return "text-green-600"
}

export default function WarehousesPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight transition-colors duration-200 hover:text-gray-800">Warehouse Management</h1>
          <p className="text-muted-foreground transition-colors duration-200 hover:text-gray-600">Monitor and manage all warehouse facilities</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 transition-all duration-300 hover:scale-105 hover:shadow-lg">
          <Plus className="h-4 w-4 mr-2 transition-transform duration-300 hover:scale-110" />
          Add Warehouse
        </Button>
      </div>

      {/* Warehouse Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        {warehouses.map((warehouse) => (
          <Card key={warehouse.id} className="transition-all duration-300 hover:shadow-xl hover:scale-105 hover:border-gray-300 cursor-pointer">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg transition-colors duration-200 hover:text-gray-800">{warehouse.name}</CardTitle>
                  <CardDescription className="transition-colors duration-200 hover:text-gray-600">{warehouse.code}</CardDescription>
                </div>
                <div className="transition-transform duration-300 hover:scale-110">
                  {getStatusBadge(warehouse.status)}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2 text-sm transition-colors duration-200 hover:text-gray-700">
                <MapPin className="h-4 w-4 text-muted-foreground transition-transform duration-300 hover:scale-110" />
                <span className="transition-colors duration-200 hover:text-gray-800">{warehouse.address}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm transition-colors duration-200 hover:text-gray-700">
                    <Users className="h-4 w-4 text-muted-foreground transition-transform duration-300 hover:scale-110" />
                    <span className="transition-colors duration-200 hover:text-gray-800">{warehouse.manager}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm transition-colors duration-200 hover:text-gray-700">
                    <Building2 className="h-4 w-4 text-muted-foreground transition-transform duration-300 hover:scale-110" />
                    <span className="transition-colors duration-200 hover:text-gray-800">{warehouse.type}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm transition-colors duration-200 hover:text-gray-700">
                    <Package className="h-4 w-4 text-muted-foreground transition-transform duration-300 hover:scale-110" />
                    <span className="transition-colors duration-200 hover:text-gray-800">{warehouse.capacity}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm transition-colors duration-200 hover:text-gray-700">
                    <Activity className="h-4 w-4 text-muted-foreground transition-transform duration-300 hover:scale-110" />
                    <span className="transition-colors duration-200 hover:text-gray-800">{warehouse.activeStaff} staff</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="transition-colors duration-200 hover:text-gray-700">Utilization</span>
                  <span className={`font-medium transition-all duration-300 hover:scale-110 ${getUtilizationColor(warehouse.utilization)}`}>
                    {warehouse.utilization}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 transition-all duration-300 hover:bg-gray-300">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 hover:scale-y-110 ${
                      warehouse.utilization >= 80 ? 'bg-red-500' : 
                      warehouse.utilization >= 60 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${warehouse.utilization}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-2">
                <div className="text-sm transition-colors duration-200 hover:text-gray-700">
                  <span className="font-medium transition-all duration-300 hover:scale-110">{warehouse.totalProducts}</span> products
                </div>
                <Button variant="outline" size="sm" className="transition-all duration-300 hover:scale-105 hover:shadow-md hover:bg-gray-50">
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
