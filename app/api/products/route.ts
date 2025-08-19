import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET - Fetch all products
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        sku: true,
        category: true,
        brand: true,
        unitPrice: true,
        isActive: true,
      },
      where: {
        isActive: true,
      },
      orderBy: {
        name: "asc",
      },
    })

    console.log("Fetched products:", products.length)
    return NextResponse.json({ products })
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    )
  }
}

// POST - Create new product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      sku,
      description,
      category,
      brand,
      unitPrice,
      weight,
      dimension,
      barcode,
      minStock,
      maxStock,
    } = body

    // Validation
    if (!name || !sku || !category || !unitPrice) {
      return NextResponse.json(
        { error: "Name, SKU, category, and unit price are required" },
        { status: 400 }
      )
    }

    if (unitPrice <= 0) {
      return NextResponse.json(
        { error: "Unit price must be greater than 0" },
        { status: 400 }
      )
    }

    // Check if SKU already exists
    const existingProduct = await prisma.product.findUnique({
      where: { sku },
    })

    if (existingProduct) {
      return NextResponse.json(
        { error: "Product with this SKU already exists" },
        { status: 409 }
      )
    }

    // Create product
    const product = await prisma.product.create({
      data: {
        name,
        sku,
        description: description || "",
        category,
        brand: brand || "",
        unitPrice: parseFloat(unitPrice),
        weight: weight ? parseFloat(weight) : null,
        dimension: dimension || null,
        barcode: barcode || null,
        minStock: minStock ? parseInt(minStock) : 0,
        maxStock: maxStock ? parseInt(maxStock) : null,
        isActive: true,
      },
    })

    console.log("Created product:", product.id)
    return NextResponse.json(
      {
        message: "Product created successfully",
        product,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    )
  }
}
