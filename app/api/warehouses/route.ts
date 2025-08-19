import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET - Fetch all warehouses
export async function GET() {
  try {
    const warehouses = await prisma.warehouse.findMany({
      select: {
        id: true,
        name: true,
        code: true,
        address: true,
        city: true,
        capacity: true,
        isActive: true,
      },
      where: {
        isActive: true,
      },
      orderBy: {
        name: "asc",
      },
    })

    console.log("Fetched warehouses:", warehouses.length)
    return NextResponse.json({ warehouses })
  } catch (error) {
    console.error("Error fetching warehouses:", error)
    return NextResponse.json(
      { error: "Failed to fetch warehouses" },
      { status: 500 }
    )
  }
}

// POST - Create new warehouse
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      code,
      address,
      city,
      country,
      manager,
      phone,
      email,
      capacity,
    } = body

    // Validation
    if (!name || !code || !address || !city) {
      return NextResponse.json(
        { error: "Name, code, address, and city are required" },
        { status: 400 }
      )
    }

    // Check if warehouse code already exists
    const existingWarehouse = await prisma.warehouse.findUnique({
      where: { code },
    })

    if (existingWarehouse) {
      return NextResponse.json(
        { error: "Warehouse with this code already exists" },
        { status: 409 }
      )
    }

    // Create warehouse
    const warehouse = await prisma.warehouse.create({
      data: {
        name,
        code,
        address,
        city,
        country: country || "Ethiopia",
        manager: manager || null,
        phone: phone || null,
        email: email || null,
        capacity: capacity ? parseInt(capacity) : null,
        isActive: true,
      },
    })

    console.log("Created warehouse:", warehouse.id)
    return NextResponse.json(
      {
        message: "Warehouse created successfully",
        warehouse,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error creating warehouse:", error)
    return NextResponse.json(
      { error: "Failed to create warehouse" },
      { status: 500 }
    )
  }
} 