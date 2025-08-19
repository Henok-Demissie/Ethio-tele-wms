"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const activities = [
  {
    id: 1,
    user: "John Doe",
    action: "Added 50 units of Fiber Optic Cable",
    time: "2 hours ago",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: 2,
    user: "Jane Smith",
    action: "Created new purchase order #PO-001",
    time: "4 hours ago",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: 3,
    user: "Mike Johnson",
    action: "Updated inventory location for Network Router",
    time: "6 hours ago",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: 4,
    user: "Sarah Wilson",
    action: "Approved supplier payment for Tech Solutions Ltd",
    time: "8 hours ago",
    avatar: "/placeholder.svg?height=32&width=32",
  },
]

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest actions in your warehouse</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={activity.avatar || "/placeholder.svg"} alt={activity.user} />
                <AvatarFallback>{activity.user.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{activity.user}</p>
                <p className="text-sm text-gray-500">{activity.action}</p>
                <p className="text-xs text-gray-400">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
