import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"

// PUT - Update inventory item
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const {
      productId,
      warehouseId,
      quantity,
      reservedQty,
      location,
    } = body

    // Validate required fields
    if (!productId || !warehouseId) {
      return NextResponse.json(
        { error: "Product and warehouse are required" },
        { status: 400 }
      )
    }

    // Get existing inventory item
    const existingInventory = await prisma.inventory.findUnique({
      where: { id: params.id },
    })

    if (!existingInventory) {
      return NextResponse.json(
        { error: "Inventory item not found" },
        { status: 404 }
      )
    }

    // Check if the new product-warehouse combination already exists (excluding current item)
    const duplicateInventory = await prisma.inventory.findFirst({
      where: {
        productId_warehouseId: {
          productId,
          warehouseId,
        },
        id: { not: params.id },
      },
    })

    if (duplicateInventory) {
      return NextResponse.json(
        { error: "Inventory item already exists for this product and warehouse" },
        { status: 400 }
      )
    }

    // Update inventory item
    const updatedInventory = await prisma.inventory.update({
      where: { id: params.id },
      data: {
        productId,
        warehouseId,
        quantity: quantity || 0,
        reservedQty: reservedQty || 0,
        location: location || "",
        lastUpdated: new Date(),
      },
      include: {
        product: true,
        warehouse: true,
      },
    })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "UPDATE",
        entity: "INVENTORY",
        entityId: params.id,
        oldValues: JSON.stringify({
          productId: existingInventory.productId,
          warehouseId: existingInventory.warehouseId,
          quantity: existingInventory.quantity,
          reservedQty: existingInventory.reservedQty,
          location: existingInventory.location,
        }),
        newValues: JSON.stringify({
          productId,
          warehouseId,
          quantity,
          reservedQty,
          location,
        }),
      },
    })

    return NextResponse.json({
      message: "Inventory item updated successfully",
      inventoryItem: updatedInventory,
    })
  } catch (error) {
    console.error("Error updating inventory item:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// DELETE - Delete inventory item
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get existing inventory item
    const existingInventory = await prisma.inventory.findUnique({
      where: { id: params.id },
    })

    if (!existingInventory) {
      return NextResponse.json(
        { error: "Inventory item not found" },
        { status: 404 }
      )
    }

    // Delete inventory item
    await prisma.inventory.delete({
      where: { id: params.id },
    })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "DELETE",
        entity: "INVENTORY",
        entityId: params.id,
        oldValues: JSON.stringify({
          productId: existingInventory.productId,
          warehouseId: existingInventory.warehouseId,
          quantity: existingInventory.quantity,
          reservedQty: existingInventory.reservedQty,
          location: existingInventory.location,
        }),
      },
    })

    return NextResponse.json({
      message: "Inventory item deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting inventory item:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 