"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Filter, Plus, Truck, MapPin, Package, Clock, CheckCircle } from "lucide-react"

const shipments = [
  {
    id: "1",
    trackingNumber: "SH-2024-001",
    destination: "Addis Ababa Branch",
    origin: "Main Warehouse",
    status: "in-transit",
    items: 25,
    weight: "150 kg",
    carrier: "EthioTelecom Logistics",
    departureDate: "2024-01-16",
    estimatedArrival: "2024-01-17",
  },
  {
    id: "2",
    trackingNumber: "SH-2024-002",
    destination: "Dire Dawa Branch",
    origin: "Main Warehouse",
    status: "delivered",
    items: 18,
    weight: "95 kg",
    carrier: "Express Delivery",
    departureDate: "2024-01-14",
    estimatedArrival: "2024-01-15",
  },
  {
    id: "3",
    trackingNumber: "SH-2024-003",
    destination: "Bahir Dar Branch",
    origin: "Regional Hub",
    status: "preparing",
    items: 32,
    weight: "200 kg",
    carrier: "EthioTelecom Logistics",
    departureDate: "2024-01-17",
    estimatedArrival: "2024-01-18",
  },
]

const getStatusBadge = (status: string) => {
  switch (status) {
    case "delivered":
      return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Delivered</Badge>
    case "in-transit":
      return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">In Transit</Badge>
    case "preparing":
      return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">Preparing</Badge>
    case "delayed":
      return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">Delayed</Badge>
    default:
      return <Badge variant="secondary">Unknown</Badge>
  }
}

export default function ShipmentsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Shipment Tracking</h1>
          <p className="text-muted-foreground">Monitor and track all warehouse shipments</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          Create Shipment
        </Button>
      </div>

      {/* Shipment Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Shipments</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Currently in transit</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delivered Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">Successful deliveries</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Preparing</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">Being prepared</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">On-Time Rate</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94.5%</div>
            <p className="text-xs text-muted-foreground">Delivery performance</p>
          </CardContent>
        </Card>
      </div>

      {/* Shipments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Shipment Tracking</CardTitle>
          <CardDescription>Track all outbound shipments and deliveries</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search shipments..." className="pl-8" />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>

          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tracking Number</TableHead>
                  <TableHead>Route</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Weight</TableHead>
                  <TableHead>Carrier</TableHead>
                  <TableHead>Departure</TableHead>
                  <TableHead>ETA</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shipments.map((shipment) => (
                  <TableRow key={shipment.id}>
                    <TableCell>
                      <div className="font-medium">{shipment.trackingNumber}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1 text-sm">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <span>{shipment.origin}</span>
                        <span>→</span>
                        <span>{shipment.destination}</span>
                      </div>
                    </TableCell>
                    <TableCell>{shipment.items} items</TableCell>
                    <TableCell>{shipment.weight}</TableCell>
                    <TableCell>{shipment.carrier}</TableCell>
                    <TableCell>{new Date(shipment.departureDate).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(shipment.estimatedArrival).toLocaleDateString()}</TableCell>
                    <TableCell>{getStatusBadge(shipment.status)}</TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline">
                        Track
                      </Button>
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
