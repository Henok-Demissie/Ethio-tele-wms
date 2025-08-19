import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"

// GET - Fetch all stock-out records
export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const stockOutRecords = await prisma.order.findMany({
      where: {
        type: "SALE",
      },
      include: {
        warehouse: true,
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        orderItems: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json({ stockOutRecords })
  } catch (error) {
    console.error("Error fetching stock-out records:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// POST - Create new stock-out request
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const {
      warehouseId,
      reason,
      notes,
      items,
    } = body

    // Validate required fields
    if (!warehouseId || !items || items.length === 0) {
      return NextResponse.json(
        { error: "Warehouse and items are required" },
        { status: 400 }
      )
    }

    // Calculate total amount
    const totalAmount = items.reduce(
      (sum: number, item: any) => sum + item.quantity * (item.unitPrice || 0),
      0
    )

    // Create the order (stock-out request)
    const order = await prisma.order.create({
      data: {
        orderNumber: `SO-${Date.now()}`,
        type: "SALE",
        status: "PENDING",
        warehouseId,
        totalAmount,
        reason,
        notes,
        createdById: user.id,
        updatedById: user.id,
      },
    })

    // Create order items
    const orderItems = await Promise.all(
      items.map((item: any) =>
        prisma.orderItem.create({
          data: {
            orderId: order.id,
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice || 0,
            totalPrice: item.quantity * (item.unitPrice || 0),
          },
        })
      )
    )

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "CREATE",
        entity: "ORDER",
        entityId: order.id,
        newValues: JSON.stringify({
          orderNumber: order.orderNumber,
          type: "SALE",
          warehouseId,
          totalAmount,
          itemsCount: items.length,
          reason,
        }),
      },
    })

    return NextResponse.json(
      { 
        message: "Stock-out request created successfully",
        order: {
          ...order,
          items: orderItems,
        }
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error creating stock-out request:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 