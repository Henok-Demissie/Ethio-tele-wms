"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, TrendingDown } from "lucide-react"

const alerts = [
  {
    id: 1,
    product: "Network Router",
    currentStock: 5,
    minStock: 10,
    status: "critical",
  },
  {
    id: 2,
    product: "Ethernet Cable",
    currentStock: 15,
    minStock: 20,
    status: "warning",
  },
  {
    id: 3,
    product: "Power Adapter",
    currentStock: 8,
    minStock: 15,
    status: "warning",
  },
]

export function StockAlerts() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <AlertTriangle className="mr-2 h-5 w-5 text-orange-500" />
          Stock Alerts
        </CardTitle>
        <CardDescription>Items requiring attention</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {alerts.map((alert) => (
            <div key={alert.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <TrendingDown className="h-4 w-4 text-red-500" />
                <div>
                  <p className="font-medium text-gray-900">{alert.product}</p>
                  <p className="text-sm text-gray-500">
                    Current: {alert.currentStock} | Min: {alert.minStock}
                  </p>
                </div>
              </div>
              <Badge variant={alert.status === "critical" ? "destructive" : "secondary"}>
                {alert.status === "critical" ? "Critical" : "Low Stock"}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
