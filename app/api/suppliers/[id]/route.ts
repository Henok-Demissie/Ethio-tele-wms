import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET - Fetch single supplier by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supplier = await prisma.supplier.findUnique({
      where: { id: params.id },
    })

    if (!supplier) {
      return NextResponse.json(
        { error: "Supplier not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ supplier })
  } catch (error) {
    console.error("Error fetching supplier:", error)
    return NextResponse.json(
      { error: "Failed to fetch supplier" },
      { status: 500 }
    )
  }
}

// PUT - Update supplier
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
      isActive,
    } = body

    // Check if supplier exists
    const existingSupplier = await prisma.supplier.findUnique({
      where: { id: params.id },
    })

    if (!existingSupplier) {
      return NextResponse.json(
        { error: "Supplier not found" },
        { status: 404 }
      )
    }

    // Check if code is being changed and if it already exists
    if (code && code !== existingSupplier.code) {
      const codeExists = await prisma.supplier.findUnique({
        where: { code },
      })

      if (codeExists) {
        return NextResponse.json(
          { error: "Supplier with this code already exists" },
          { status: 409 }
        )
      }
    }

    // Update supplier
    const updatedSupplier = await prisma.supplier.update({
      where: { id: params.id },
      data: {
        name: name || existingSupplier.name,
        code: code || existingSupplier.code,
        email: email !== undefined ? email : existingSupplier.email,
        phone: phone !== undefined ? phone : existingSupplier.phone,
        address: address !== undefined ? address : existingSupplier.address,
        city: city !== undefined ? city : existingSupplier.city,
        country: country || existingSupplier.country,
        contactPerson: contactPerson !== undefined ? contactPerson : existingSupplier.contactPerson,
        paymentTerms: paymentTerms !== undefined ? paymentTerms : existingSupplier.paymentTerms,
        isActive: isActive !== undefined ? isActive : existingSupplier.isActive,
      },
    })

    console.log("Updated supplier:", updatedSupplier.id)
    return NextResponse.json({
      message: "Supplier updated successfully",
      supplier: updatedSupplier,
    })
  } catch (error) {
    console.error("Error updating supplier:", error)
    return NextResponse.json(
      { error: "Failed to update supplier" },
      { status: 500 }
    )
  }
}

// DELETE - Delete supplier (soft delete by setting isActive to false)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if supplier exists
    const existingSupplier = await prisma.supplier.findUnique({
      where: { id: params.id },
    })

    if (!existingSupplier) {
      return NextResponse.json(
        { error: "Supplier not found" },
        { status: 404 }
      )
    }

    // Check if supplier has any orders
    const ordersCount = await prisma.order.count({
      where: { supplierId: params.id },
    })

    if (ordersCount > 0) {
      return NextResponse.json(
        { error: "Cannot delete supplier with existing orders. Please deactivate instead." },
        { status: 400 }
      )
    }

    // Soft delete by setting isActive to false
    const deletedSupplier = await prisma.supplier.update({
      where: { id: params.id },
      data: { isActive: false },
    })

    console.log("Deleted supplier:", deletedSupplier.id)
    return NextResponse.json({
      message: "Supplier deleted successfully",
      supplier: deletedSupplier,
    })
  } catch (error) {
    console.error("Error deleting supplier:", error)
    return NextResponse.json(
      { error: "Failed to delete supplier" },
      { status: 500 }
    )
  }
}

