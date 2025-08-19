"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { name: "Cables", value: 150 },
  { name: "Routers", value: 25 },
  { name: "Switches", value: 45 },
  { name: "Modems", value: 80 },
  { name: "Accessories", value: 120 },
]

export function InventoryChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Inventory Overview</CardTitle>
        <CardDescription>Current stock levels by category</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="hsl(82.7, 78%, 55.5%)" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
