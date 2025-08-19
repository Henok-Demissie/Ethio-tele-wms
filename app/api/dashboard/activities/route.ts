import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    // Check if database is available
    if (!prisma) {
      console.log("Database not available, returning mock data for activities")
      return NextResponse.json({
        activities: [
          {
            id: "mock-1",
            type: "STOCK_IN",
            description: "Stock-in receipt ORD-001 from Sample Supplier",
            status: "RECEIVED",
            timestamp: new Date().toISOString(),
            user: "System User",
            details: {}
          },
          {
            id: "mock-2",
            type: "STOCK_OUT",
            description: "Stock-out request REQ-001 from Main Warehouse",
            status: "COMPLETED",
            timestamp: new Date(Date.now() - 86400000).toISOString(),
            user: "System User",
            details: {}
          }
        ]
      })
    }

    // Get recent activities from multiple sources
    const [stockInActivities, stockOutActivities, inventoryActivities] = await Promise.all([
      prisma.stockInRecord.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          supplier: { select: { name: true } },
          createdBy: { select: { name: true } }
        }
      }),
      prisma.stockOutRecord.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          warehouse: { select: { name: true } },
          createdBy: { select: { name: true } }
        }
      }),
      prisma.inventory.findMany({
        take: 5,
        orderBy: { updatedAt: "desc" },
        include: {
          product: { select: { name: true, sku: true } }
        }
      })
    ])

    // Combine and format activities
    const activities = [
      ...stockInActivities.map(record => ({
        id: `stock-in-${record.id}`,
        type: "STOCK_IN",
        description: `Stock-in receipt ${record.orderNumber} from ${record.supplier.name}`,
        status: record.status,
        timestamp: record.createdAt,
        user: record.createdBy.name,
        details: record
      })),
      ...stockOutActivities.map(record => ({
        id: `stock-out-${record.id}`,
        type: "STOCK_OUT",
        description: `Stock-out request ${record.orderNumber} from ${record.warehouse.name}`,
        status: record.status,
        timestamp: record.createdAt,
        user: record.createdBy.name,
        details: record
      })),
      ...inventoryActivities.map(inv => ({
        id: `inventory-${inv.id}`,
        type: "INVENTORY_UPDATE",
        description: `Inventory updated for ${inv.product.name} (${inv.product.sku})`,
        status: inv.quantity > 10 ? "IN_STOCK" : inv.quantity > 0 ? "LOW_STOCK" : "OUT_OF_STOCK",
        timestamp: inv.updatedAt,
        user: "System",
        details: inv
      }))
    ]

    // Sort by timestamp and take top 10
    const recentActivities = activities
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 10)

    return NextResponse.json({ activities: recentActivities })
  } catch (error) {
    console.error("Error fetching dashboard activities:", error)
    // Return mock data on error
    return NextResponse.json({
      activities: [
        {
          id: "error-fallback-1",
          type: "STOCK_IN",
          description: "Stock-in receipt ORD-001 from Sample Supplier",
          status: "RECEIVED",
          timestamp: new Date().toISOString(),
          user: "System User",
          details: {}
        }
      ]
    })
  }
}
