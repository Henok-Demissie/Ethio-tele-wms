import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"

// GET - Fetch all inventory items
export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      console.log("No authenticated user found for GET request, proceeding anyway")
    }

    const inventoryItems = await prisma.inventory.findMany({
      include: {
        product: true,
        warehouse: true,
      },
      orderBy: {
        lastUpdated: "desc",
      },
    })

    console.log("Fetched inventory items:", inventoryItems.length)
    return NextResponse.json({ inventoryItems })
  } catch (error) {
    console.error("Error fetching inventory items:", error)
    return NextResponse.json(
      { error: "Failed to fetch inventory items" },
      { status: 500 }
    )
  }
}

// POST - Create new inventory item
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      console.log("No authenticated user found for POST request, proceeding anyway")
    }

    const body = await request.json()
    const { productId, warehouseId, quantity, reservedQty, location } = body

    // Validation
    if (!productId || !warehouseId) {
      return NextResponse.json(
        { error: "Product ID and Warehouse ID are required" },
        { status: 400 }
      )
    }

    if (quantity < 0 || reservedQty < 0) {
      return NextResponse.json(
        { error: "Quantity and reserved quantity cannot be negative" },
        { status: 400 }
      )
    }

    // Check if inventory item already exists for this product and warehouse
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
        { status: 409 }
      )
    }

    // Create new inventory item
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

    // Create audit log if user is authenticated
    if (user) {
      try {
        await prisma.auditLog.create({
          data: {
            userId: user.id,
            action: "CREATE",
            entity: "INVENTORY",
            entityId: inventoryItem.id,
            newValues: JSON.stringify({
              productId,
              warehouseId,
              quantity: quantity || 0,
              reservedQty: reservedQty || 0,
              location: location || "",
            }),
          },
        })
      } catch (auditError) {
        console.error("Failed to create audit log:", auditError)
      }
    }

    console.log("Created inventory item:", inventoryItem.id)
    return NextResponse.json(
      {
        message: "Inventory item added successfully",
        inventoryItem,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error creating inventory item:", error)
    return NextResponse.json(
      { error: "Failed to create inventory item" },
      { status: 500 }
    )
  }
}







