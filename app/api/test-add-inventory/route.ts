import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      productId,
      warehouseId,
      quantity,
      reservedQty,
      location,
    } = body

    console.log("Test add inventory request:", body)

    // Validate required fields
    if (!productId || !warehouseId) {
      return NextResponse.json(
        { error: "Product and warehouse are required" },
        { status: 400 }
      )
    }

    // Check if inventory item already exists
    const existingInventory = await prisma.inventory.findUnique({
      where: {
        productId_warehouseId: {
          productId,
          warehouseId,
        },
      },
    })

    if (existingInventory) {
      return NextResponse.json(
        { error: "Inventory item already exists for this product and warehouse" },
        { status: 400 }
      )
    }

    // Create inventory item
    const inventoryItem = await prisma.inventory.create({
      data: {
        productId,
        warehouseId,
        quantity: quantity || 0,
        reservedQty: reservedQty || 0,
        location: location || "",
      },
      include: {
        product: true,
        warehouse: true,
      },
    })

    console.log("Created inventory item:", inventoryItem)

    return NextResponse.json(
      { 
        message: "Inventory item added successfully",
        inventoryItem
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error adding inventory item:", error)
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
} 