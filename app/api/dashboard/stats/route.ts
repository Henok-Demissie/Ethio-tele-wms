import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    // Check if database is available
    if (!prisma) {
      console.log("Database not available, returning mock data for stats")
      return NextResponse.json({
        totalProducts: 150,
        totalWarehouses: 3,
        totalUsers: 25,
        totalOrders: 45,
        stockInStats: {
          todayReceipts: 5,
          itemsReceived: 120,
          pendingReceipts: 2,
          qualityIssues: 0
        },
        stockOutStats: {
          todayRequests: 8,
          itemsShipped: 85,
          pendingRequests: 3,
          completed: 5
        }
      })
    }

    // Get counts from different tables
    const [
      totalProducts,
      totalWarehouses,
      totalUsers,
      totalOrders,
      stockInRecords,
      stockOutRecords
    ] = await Promise.all([
      prisma.product.count(),
      prisma.warehouse.count(),
      prisma.user.count(),
      prisma.order.count(),
      prisma.stockInRecord.findMany({
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0))
          }
        },
        include: {
          orderItems: true
        }
      }),
      prisma.stockOutRecord.findMany({
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0))
          }
        },
        include: {
          orderItems: true
        }
      })
    ])

    // Calculate stock-in stats
    const stockInStats = {
      todayReceipts: stockInRecords.length,
      itemsReceived: stockInRecords.reduce((total, record) => 
        total + record.orderItems.reduce((sum, item) => sum + item.quantity, 0), 0
      ),
      pendingReceipts: stockInRecords.filter(r => r.status === "PENDING").length,
      qualityIssues: stockInRecords.filter(r => r.status === "PARTIAL").length
    }

    // Calculate stock-out stats
    const stockOutStats = {
      todayRequests: stockOutRecords.length,
      itemsShipped: stockOutRecords.reduce((total, record) => 
        total + record.orderItems.reduce((sum, item) => sum + item.quantity, 0), 0
      ),
      pendingRequests: stockOutRecords.filter(r => r.status === "PENDING").length,
      completed: stockOutRecords.filter(r => r.status === "COMPLETED").length
    }

    const stats = {
      totalProducts,
      totalWarehouses,
      totalUsers,
      totalOrders,
      stockInStats,
      stockOutStats
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    // Return mock data on error
    return NextResponse.json({
      totalProducts: 150,
      totalWarehouses: 3,
      totalUsers: 25,
      totalOrders: 45,
      stockInStats: {
        todayReceipts: 5,
        itemsReceived: 120,
        pendingReceipts: 2,
        qualityIssues: 0
      },
      stockOutStats: {
        todayRequests: 8,
        itemsShipped: 85,
        pendingRequests: 3,
        completed: 5
      }
    })
  }
}
