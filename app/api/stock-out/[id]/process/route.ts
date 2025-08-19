import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get the order with items
    const order = await prisma.order.findUnique({
      where: { id: params.id },
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

    if (order.status === "COMPLETED") {
      return NextResponse.json(
        { error: "Order has already been processed" },
        { status: 400 }
      )
    }

    // Process each item
    for (const orderItem of order.orderItems) {
      // Check if inventory exists
      const existingInventory = await prisma.inventory.findUnique({
        where: {
          productId_warehouseId: {
            productId: orderItem.productId,
            warehouseId: order.warehouseId,
          },
        },
      })

      if (!existingInventory) {
        return NextResponse.json(
          { error: `No inventory found for product ${orderItem.product.name}` },
          { status: 400 }
        )
      }

      if (existingInventory.quantity < orderItem.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for product ${orderItem.product.name}. Available: ${existingInventory.quantity}, Requested: ${orderItem.quantity}` },
          { status: 400 }
        )
      }

      // Update inventory
      await prisma.inventory.update({
        where: {
          productId_warehouseId: {
            productId: orderItem.productId,
            warehouseId: order.warehouseId,
          },
        },
        data: {
          quantity: existingInventory.quantity - orderItem.quantity,
          lastUpdated: new Date(),
        },
      })

      // Create stock movement record
      await prisma.stockMovement.create({
        data: {
          productId: orderItem.productId,
          warehouseId: order.warehouseId,
          type: "OUT",
          quantity: orderItem.quantity,
          reference: order.orderNumber,
          notes: `Stock-out from ${order.orderNumber}`,
          userId: user.id,
        },
      })
    }

    // Update order status to completed
    await prisma.order.update({
      where: { id: params.id },
      data: {
        status: "COMPLETED",
        updatedById: user.id,
      },
    })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "PROCESS",
        entity: "ORDER",
        entityId: params.id,
        oldValues: JSON.stringify({ status: "PENDING" }),
        newValues: JSON.stringify({ 
          status: "COMPLETED",
          itemsProcessed: order.orderItems.length,
        }),
      },
    })

    return NextResponse.json({
      message: "Stock-out processed successfully",
      orderId: params.id,
      processedItems: order.orderItems.length,
    })
  } catch (error) {
    console.error("Error processing stock-out:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 