import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET - Fetch all suppliers
export async function GET() {
  try {
    const suppliers = await prisma.supplier.findMany({
      select: {
        id: true,
        name: true,
        code: true,
        contactPerson: true,
        isActive: true,
      },
      where: {
        isActive: true,
      },
      orderBy: {
        name: "asc",
      },
    })

    console.log("Fetched suppliers:", suppliers.length)
    return NextResponse.json({ suppliers })
  } catch (error) {
    console.error("Error fetching suppliers:", error)
    return NextResponse.json(
      { error: "Failed to fetch suppliers" },
      { status: 500 }
    )
  }
}

// POST - Create new supplier
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      code,
      email,
      phone,
      address,
      city,
      country,
      contactPerson,
      paymentTerms,
    } = body

    // Validation
    if (!name || !code) {
      return NextResponse.json(
        { error: "Name and code are required" },
        { status: 400 }
      )
    }

    // Check if supplier code already exists
    const existingSupplier = await prisma.supplier.findUnique({
      where: { code },
    })

    if (existingSupplier) {
      return NextResponse.json(
        { error: "Supplier with this code already exists" },
        { status: 409 }
      )
    }

    // Create supplier
    const supplier = await prisma.supplier.create({
      data: {
        name,
        code,
        email: email || null,
        phone: phone || null,
        address: address || null,
        city: city || null,
        country: country || "Ethiopia",
        contactPerson: contactPerson || null,
        paymentTerms: paymentTerms || null,
        isActive: true,
      },
    })

    console.log("Created supplier:", supplier.id)
    return NextResponse.json(
      {
        message: "Supplier created successfully",
        supplier,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error creating supplier:", error)
    return NextResponse.json(
      { error: "Failed to create supplier" },
      { status: 500 }
    )
  }
} 