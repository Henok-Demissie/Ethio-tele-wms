import { query, transaction } from "@/lib/db"
import type { Inventory, ApiResponse, PaginatedResponse, QueryParams } from "@/lib/types"

export class InventoryService {
  // Get inventory with product details
  static async getInventory(params: QueryParams = {}): Promise<PaginatedResponse<any>> {
    try {
      const { page = 1, limit = 10, search = "", sort = "created_at", order = "desc" } = params
      const offset = (page - 1) * limit

      let whereClause = "WHERE 1=1"
      const queryParams: any[] = []

      if (search) {
        whereClause += ` AND (p.name ILIKE $${queryParams.length + 1} OR p.sku ILIKE $${queryParams.length + 1})`
        queryParams.push(`%${search}%`)
      }

      const countQuery = `
        SELECT COUNT(*) as total
        FROM inventory i
        JOIN products p ON i.product_id = p.id
        JOIN warehouses w ON i.warehouse_id = w.id
        LEFT JOIN suppliers s ON p.supplier_id = s.id
        ${whereClause}
      `

      const dataQuery = `
        SELECT 
          i.*,
          p.name as product_name,
          p.sku,
          p.unit_price,
          w.name as warehouse_name,
          w.code as warehouse_code,
          s.name as supplier_name,
          CASE 
            WHEN i.quantity <= 0 THEN 'out-of-stock'
            WHEN i.quantity <= i.min_threshold THEN 'low-stock'
            ELSE 'in-stock'
          END as status
        FROM inventory i
        JOIN products p ON i.product_id = p.id
        JOIN warehouses w ON i.warehouse_id = w.id
        LEFT JOIN suppliers s ON p.supplier_id = s.id
        ${whereClause}
        ORDER BY ${sort} ${order}
        LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}
      `

      queryParams.push(limit, offset)

      const [countResult, dataResult] = await Promise.all([
        query(countQuery, queryParams.slice(0, -2)),
        query(dataQuery, queryParams),
      ])

      const total = Number.parseInt(countResult.rows[0].total)
      const totalPages = Math.ceil(total / limit)

      return {
        success: true,
        data: dataResult.rows,
        pagination: {
          page,
          limit,
          total,
          totalPages,
        },
      }
    } catch (error) {
      console.error("Error fetching inventory:", error)
      throw new Error("Failed to fetch inventory")
    }
  }

  // Get inventory by product ID
  static async getInventoryByProduct(productId: string): Promise<ApiResponse<Inventory[]>> {
    try {
      const result = await query(
        `
        SELECT 
          i.*,
          w.name as warehouse_name,
          w.code as warehouse_code
        FROM inventory i
        JOIN warehouses w ON i.warehouse_id = w.id
        WHERE i.product_id = $1
      `,
        [productId],
      )

      return {
        success: true,
        data: result.rows,
      }
    } catch (error) {
      console.error("Error fetching inventory by product:", error)
      throw new Error("Failed to fetch inventory by product")
    }
  }

  // Update inventory quantity
  static async updateInventory(
    productId: string,
    warehouseId: string,
    quantity: number,
    movementType: "in" | "out" | "adjustment",
    reason?: string,
    performedBy?: string,
  ): Promise<ApiResponse<Inventory>> {
    try {
      return await transaction(async (client) => {
        // Get current inventory
        const inventoryResult = await client.query(
          `
          SELECT * FROM inventory 
          WHERE product_id = $1 AND warehouse_id = $2
        `,
          [productId, warehouseId],
        )

        if (inventoryResult.rows.length === 0) {
          throw new Error("Inventory record not found")
        }

        const currentInventory = inventoryResult.rows[0]
        let newQuantity = currentInventory.quantity

        // Calculate new quantity based on movement type
        switch (movementType) {
          case "in":
            newQuantity += quantity
            break
          case "out":
            if (currentInventory.quantity < quantity) {
              throw new Error("Insufficient inventory")
            }
            newQuantity -= quantity
            break
          case "adjustment":
            newQuantity = quantity
            break
        }

        // Update inventory
        const updateResult = await client.query(
          `
          UPDATE inventory 
          SET quantity = $1, last_movement_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
          WHERE product_id = $2 AND warehouse_id = $3
          RETURNING *
        `,
          [newQuantity, productId, warehouseId],
        )

        // Record stock movement
        await client.query(
          `
          INSERT INTO stock_movements (
            product_id, warehouse_id, movement_type, quantity, reason, performed_by
          ) VALUES ($1, $2, $3, $4, $5, $6)
        `,
          [productId, warehouseId, movementType, quantity, reason, performedBy],
        )

        // Check for low stock alerts
        const updatedInventory = updateResult.rows[0]
        if (updatedInventory.quantity <= updatedInventory.min_threshold) {
          await client.query(
            `
            INSERT INTO alerts (type, severity, title, message, category, reference_type, reference_id)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
          `,
            [
              "stock",
              updatedInventory.quantity === 0 ? "critical" : "high",
              updatedInventory.quantity === 0 ? "Out of Stock" : "Low Stock Alert",
              `Product is ${updatedInventory.quantity === 0 ? "out of stock" : "below minimum threshold"}`,
              "Inventory",
              "product",
              productId,
            ],
          )
        }

        return {
          success: true,
          data: updatedInventory,
        }
      })
    } catch (error) {
      console.error("Error updating inventory:", error)
      throw new Error(error instanceof Error ? error.message : "Failed to update inventory")
    }
  }

  // Get low stock items
  static async getLowStockItems(warehouseId?: string): Promise<ApiResponse<any[]>> {
    try {
      let whereClause = "WHERE i.quantity <= i.min_threshold"
      const queryParams: any[] = []

      if (warehouseId) {
        whereClause += ` AND i.warehouse_id = $${queryParams.length + 1}`
        queryParams.push(warehouseId)
      }

      const result = await query(
        `
        SELECT 
          i.*,
          p.name as product_name,
          p.sku,
          w.name as warehouse_name,
          w.code as warehouse_code,
          s.name as supplier_name,
          CASE 
            WHEN i.quantity <= 0 THEN 'critical'
            WHEN i.quantity <= i.min_threshold * 0.5 THEN 'high'
            ELSE 'medium'
          END as severity
        FROM inventory i
        JOIN products p ON i.product_id = p.id
        JOIN warehouses w ON i.warehouse_id = w.id
        LEFT JOIN suppliers s ON p.supplier_id = s.id
        ${whereClause}
        ORDER BY i.quantity ASC, p.name ASC
      `,
        queryParams,
      )

      return {
        success: true,
        data: result.rows,
      }
    } catch (error) {
      console.error("Error fetching low stock items:", error)
      throw new Error("Failed to fetch low stock items")
    }
  }

  // Get stock movements
  static async getStockMovements(params: QueryParams = {}): Promise<PaginatedResponse<any>> {
    try {
      const { page = 1, limit = 10, search = "", sort = "performed_at", order = "desc" } = params
      const offset = (page - 1) * limit

      let whereClause = "WHERE 1=1"
      const queryParams: any[] = []

      if (search) {
        whereClause += ` AND (p.name ILIKE $${queryParams.length + 1} OR p.sku ILIKE $${queryParams.length + 1})`
        queryParams.push(`%${search}%`)
      }

      const countQuery = `
        SELECT COUNT(*) as total
        FROM stock_movements sm
        JOIN products p ON sm.product_id = p.id
        ${whereClause}
      `

      const dataQuery = `
        SELECT 
          sm.*,
          p.name as product_name,
          p.sku,
          w.name as warehouse_name,
          u.name as performed_by_name
        FROM stock_movements sm
        JOIN products p ON sm.product_id = p.id
        JOIN warehouses w ON sm.warehouse_id = w.id
        LEFT JOIN users u ON sm.performed_by = u.id
        ${whereClause}
        ORDER BY ${sort} ${order}
        LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}
      `

      queryParams.push(limit, offset)

      const [countResult, dataResult] = await Promise.all([
        query(countQuery, queryParams.slice(0, -2)),
        query(dataQuery, queryParams),
      ])

      const total = Number.parseInt(countResult.rows[0].total)
      const totalPages = Math.ceil(total / limit)

      return {
        success: true,
        data: dataResult.rows,
        pagination: {
          page,
          limit,
          total,
          totalPages,
        },
      }
    } catch (error) {
      console.error("Error fetching stock movements:", error)
      throw new Error("Failed to fetch stock movements")
    }
  }
}
