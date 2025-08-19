import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"

// GET - Fetch all stock-in records
export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const stockInRecords = await prisma.order.findMany({
      where: {
        type: "PURCHASE",
      },
      include: {
        supplier: true,
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

    return NextResponse.json({ stockInRecords })
  } catch (error) {
    console.error("Error fetching stock-in records:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// POST - Create new stock-in receipt
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const {
      supplierId,
      warehouseId,
      purchaseOrder,
      expectedDate,
      notes,
      items,
    } = body

    // Validate required fields
    if (!supplierId || !warehouseId || !items || items.length === 0) {
      return NextResponse.json(
        { error: "Supplier, warehouse, and items are required" },
        { status: 400 }
      )
    }

    // Calculate total amount
    const totalAmount = items.reduce(
      (sum: number, item: any) => sum + item.quantity * item.unitPrice,
      0
    )

    // Create the order (stock-in receipt)
    const order = await prisma.order.create({
      data: {
        orderNumber: `REC-${Date.now()}`,
        type: "PURCHASE",
        status: "PENDING",
        supplierId,
        warehouseId,
        totalAmount,
        notes,
        expectedDate: expectedDate ? new Date(expectedDate) : null,
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
            unitPrice: item.unitPrice,
            totalPrice: item.quantity * item.unitPrice,
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
          type: "PURCHASE",
          supplierId,
          warehouseId,
          totalAmount,
          itemsCount: items.length,
        }),
      },
    })

    return NextResponse.json(
      { 
        message: "Stock-in receipt created successfully",
        order: {
          ...order,
          items: orderItems,
        }
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error creating stock-in receipt:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 