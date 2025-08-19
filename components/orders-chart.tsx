"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { name: "Jan", orders: 65 },
  { name: "Feb", orders: 59 },
  { name: "Mar", orders: 80 },
  { name: "Apr", orders: 81 },
  { name: "May", orders: 56 },
  { name: "Jun", orders: 89 },
]

export function OrdersChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Orders Trend</CardTitle>
        <CardDescription>Monthly order volume</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="orders" stroke="hsl(82.7, 78%, 55.5%)" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
