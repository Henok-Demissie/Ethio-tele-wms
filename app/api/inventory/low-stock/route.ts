import { type NextRequest, NextResponse } from "next/server"
import { InventoryService } from "@/lib/services/inventory"

export async function GET(request: NextRequest) {
  try {
    // const { searchParams } = new URL(request.url)
    // const warehouseId = searchParams.get("warehouseId") || undefined

    const result = await InventoryService.getLowStockItems()

    return NextResponse.json(result)
  } catch (error) {
    console.error("Low stock API error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch low stock items" }, { status: 500 })
  }
}
