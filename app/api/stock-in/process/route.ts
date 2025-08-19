import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { orderId, receivedItems } = body

    if (!orderId || !receivedItems || receivedItems.length === 0) {
      return NextResponse.json(
        { error: "Order ID and received items are required" },
        { status: 400 }
      )
    }

    // Get the order with items
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
        warehouse: true,
      },
    })

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      )
    }

    if (order.status === "RECEIVED") {
      return NextResponse.json(
        { error: "Order has already been received" },
        { status: 400 }
      )
    }

    // Process each received item
    for (const receivedItem of receivedItems) {
      const orderItem = order.orderItems.find(
        (item) => item.productId === receivedItem.productId
      )

      if (!orderItem) {
        continue
      }

      const receivedQuantity = receivedItem.receivedQuantity || orderItem.quantity

      // Update or create inventory record
      const existingInventory = await prisma.inventory.findUnique({
        where: {
          productId_warehouseId: {
            productId: orderItem.productId,
            warehouseId: order.warehouseId,
          },
        },
      })

      if (existingInventory) {
        // Update existing inventory
        await prisma.inventory.update({
          where: {
            productId_warehouseId: {
              productId: orderItem.productId,
              warehouseId: order.warehouseId,
            },
          },
          data: {
            quantity: existingInventory.quantity + receivedQuantity,
            lastUpdated: new Date(),
          },
        })
      } else {
        // Create new inventory record
        await prisma.inventory.create({
          data: {
            productId: orderItem.productId,
            warehouseId: order.warehouseId,
            quantity: receivedQuantity,
            reservedQty: 0,
            location: receivedItem.location || "Default",
          },
        })
      }

      // Create stock movement record
      await prisma.stockMovement.create({
        data: {
          productId: orderItem.productId,
          warehouseId: order.warehouseId,
          type: "IN",
          quantity: receivedQuantity,
          reference: order.orderNumber,
          notes: `Stock-in from ${order.orderNumber}`,
          userId: user.id,
        },
      })
    }

    // Update order status to received
    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: "RECEIVED",
        receivedDate: new Date(),
        updatedById: user.id,
      },
    })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "PROCESS",
        entity: "ORDER",
        entityId: orderId,
        oldValues: JSON.stringify({ status: "PENDING" }),
        newValues: JSON.stringify({ 
          status: "RECEIVED",
          receivedDate: new Date(),
          itemsProcessed: receivedItems.length,
        }),
      },
    })

    return NextResponse.json({
      message: "Stock-in processed successfully",
      orderId,
      processedItems: receivedItems.length,
    })
  } catch (error) {
    console.error("Error processing stock-in:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 