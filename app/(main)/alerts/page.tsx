"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AlertTriangle, Bell, CheckCircle, Clock, Package, Truck, Users, Settings } from "lucide-react"

const alerts = [
  {
    id: "1",
    type: "stock",
    severity: "critical",
    title: "Critical Stock Level",
    message: "Network switches are critically low (5 units remaining)",
    timestamp: "2024-01-16T10:30:00",
    acknowledged: false,
    category: "Inventory",
  },
  {
    id: "2",
    type: "delivery",
    severity: "high",
    title: "Delayed Shipment",
    message: "Shipment SH-2024-045 to Dire Dawa is 2 hours behind schedule",
    timestamp: "2024-01-16T09:15:00",
    acknowledged: false,
    category: "Logistics",
  },
  {
    id: "3",
    type: "quality",
    severity: "medium",
    title: "Quality Issue Reported",
    message: "Damaged items found in receipt REC-2024-089",
    timestamp: "2024-01-16T08:45:00",
    acknowledged: true,
    category: "Quality Control",
  },
  {
    id: "4",
    type: "system",
    severity: "low",
    title: "System Maintenance",
    message: "Scheduled maintenance window tonight 11 PM - 2 AM",
    timestamp: "2024-01-16T08:00:00",
    acknowledged: false,
    category: "System",
  },
  {
    id: "5",
    type: "stock",
    severity: "high",
    title: "Low Stock Alert",
    message: "CAT6 cables below minimum threshold (45 units)",
    timestamp: "2024-01-16T07:30:00",
    acknowledged: false,
    category: "Inventory",
  },
  {
    id: "6",
    type: "user",
    severity: "medium",
    title: "User Access Issue",
    message: "Multiple failed login attempts for user solomon.girma",
    timestamp: "2024-01-16T07:00:00",
    acknowledged: true,
    category: "Security",
  },
]

const getSeverityIcon = (severity: string) => {
  switch (severity) {
    case "critical":
      return <AlertTriangle className="h-4 w-4 text-red-500" />
    case "high":
      return <AlertTriangle className="h-4 w-4 text-orange-500" />
    case "medium":
      return <Bell className="h-4 w-4 text-yellow-500" />
    case "low":
      return <Bell className="h-4 w-4 text-blue-500" />
    default:
      return <Bell className="h-4 w-4 text-gray-500" />
  }
}

const getSeverityBadge = (severity: string) => {
  switch (severity) {
    case "critical":
      return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">Critical</Badge>
    case "high":
      return <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300">High</Badge>
    case "medium":
      return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">Medium</Badge>
    case "low":
      return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">Low</Badge>
    default:
      return <Badge variant="secondary">Unknown</Badge>
  }
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "Inventory":
      return <Package className="h-4 w-4" />
    case "Logistics":
      return <Truck className="h-4 w-4" />
    case "Security":
      return <Users className="h-4 w-4" />
    case "System":
      return <Settings className="h-4 w-4" />
    default:
      return <Bell className="h-4 w-4" />
  }
}

export default function AlertsPage() {
  const criticalAlerts = alerts.filter((alert) => alert.severity === "critical").length
  const highAlerts = alerts.filter((alert) => alert.severity === "high").length
  const unacknowledgedAlerts = alerts.filter((alert) => !alert.acknowledged).length
  const acknowledgedAlerts = alerts.filter((alert) => alert.acknowledged).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Alerts</h1>
          <p className="text-muted-foreground">Monitor and manage system alerts and notifications</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <CheckCircle className="h-4 w-4 mr-2" />
            Mark All Read
          </Button>
          <Button className="bg-primary hover:bg-primary/90">
            <Settings className="h-4 w-4 mr-2" />
            Alert Settings
          </Button>
        </div>
      </div>

      {/* Alert Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{criticalAlerts}</div>
            <p className="text-xs text-muted-foreground">Require immediate attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Priority</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{highAlerts}</div>
            <p className="text-xs text-muted-foreground">High priority alerts</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unacknowledged</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unacknowledgedAlerts}</div>
            <p className="text-xs text-muted-foreground">Awaiting acknowledgment</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Acknowledged</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{acknowledgedAlerts}</div>
            <p className="text-xs text-muted-foreground">Acknowledged alerts</p>
          </CardContent>
        </Card>
      </div>

      {/* Alerts List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Alerts</CardTitle>
          <CardDescription>Latest system alerts and notifications</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px]">
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-4 border rounded-lg ${
                    alert.acknowledged ? "bg-muted/30" : "bg-background"
                  } ${alert.severity === "critical" ? "border-red-200" : "border-border"}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">{getSeverityIcon(alert.severity)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium">{alert.title}</h4>
                          {getSeverityBadge(alert.severity)}
                          <Badge variant="outline" className="text-xs">
                            {getCategoryIcon(alert.category)}
                            <span className="ml-1">{alert.category}</span>
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{alert.message}</p>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>{new Date(alert.timestamp).toLocaleString()}</span>
                          </div>
                          {alert.acknowledged && (
                            <div className="flex items-center space-x-1 text-green-600">
                              <CheckCircle className="h-3 w-3" />
                              <span>Acknowledged</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {!alert.acknowledged && (
                        <Button size="sm" variant="outline">
                          Acknowledge
                        </Button>
                      )}
                      <Button size="sm" className="bg-primary hover:bg-primary/90">
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
