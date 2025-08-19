import { type NextRequest, NextResponse } from "next/server"
import { query, transaction } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search") || ""
    const status = searchParams.get("status") || ""

    const offset = (page - 1) * limit
    let whereClause = "WHERE 1=1"
    const queryParams: any[] = []

    if (search) {
      whereClause += ` AND (o.order_number ILIKE $${queryParams.length + 1} OR o.customer_name ILIKE $${queryParams.length + 1})`
      queryParams.push(`%${search}%`)
    }

    if (status) {
      whereClause += ` AND o.status = $${queryParams.length + 1}`
      queryParams.push(status)
    }

    const countQuery = `
      SELECT COUNT(*) as total
      FROM orders o
      ${whereClause}
    `

    const dataQuery = `
      SELECT 
        o.*,
        w.name as warehouse_name,
        u.name as created_by_name,
        COUNT(oi.id) as item_count
      FROM orders o
      LEFT JOIN warehouses w ON o.warehouse_id = w.id
      LEFT JOIN users u ON o.created_by = u.id
      LEFT JOIN order_items oi ON o.id = oi.order_id
      ${whereClause}
      GROUP BY o.id, w.name, u.name
      ORDER BY o.created_at DESC
      LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}
    `

    queryParams.push(limit, offset)

    const [countResult, dataResult] = await Promise.all([
      query(countQuery, queryParams.slice(0, -2)),
      query(dataQuery, queryParams),
    ])

    const total = Number.parseInt(countResult.rows[0].total)
    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      success: true,
      data: dataResult.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    })
  } catch (error) {
    console.error("Orders API error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch orders" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      customer_name,
      customer_branch,
      warehouse_id,
      priority = "medium",
      expected_delivery_date,
      notes,
      items,
      created_by,
    } = body

    if (!customer_name || !customer_branch || !warehouse_id || !items || items.length === 0) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    const result = await transaction(async (client) => {
      // Generate order number
      const orderNumberResult = await client.query(`
        SELECT 'ORD-' || TO_CHAR(CURRENT_DATE, 'YYYY') || '-' || 
               LPAD((COALESCE(MAX(CAST(SUBSTRING(order_number FROM 10) AS INTEGER)), 0) + 1)::TEXT, 3, '0') as order_number
        FROM orders 
        WHERE order_number LIKE 'ORD-' || TO_CHAR(CURRENT_DATE, 'YYYY') || '-%'
      `)
      const orderNumber = orderNumberResult.rows[0].order_number

      // Calculate totals
      let totalItems = 0
      let totalValue = 0
      for (const item of items) {
        totalItems += item.quantity
        totalValue += item.quantity * item.unit_price
      }

      // Create order
      const orderResult = await client.query(
        `
        INSERT INTO orders (
          order_number, customer_name, customer_branch, warehouse_id,
          priority, total_items, total_value, expected_delivery_date,
          notes, created_by
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *
      `,
        [
          orderNumber,
          customer_name,
          customer_branch,
          warehouse_id,
          priority,
          totalItems,
          totalValue,
          expected_delivery_date,
          notes,
          created_by,
        ],
      )

      const order = orderResult.rows[0]

      // Create order items
      for (const item of items) {
        await client.query(
          `
          INSERT INTO order_items (
            order_id, product_id, quantity, unit_price, total_price
          ) VALUES ($1, $2, $3, $4, $5)
        `,
          [order.id, item.product_id, item.quantity, item.unit_price, item.quantity * item.unit_price],
        )

        // Reserve inventory
        await client.query(
          `
          UPDATE inventory 
          SET reserved_quantity = reserved_quantity + $1
          WHERE product_id = $2 AND warehouse_id = $3
        `,
          [item.quantity, item.product_id, warehouse_id],
        )
      }

      return order
    })

    return NextResponse.json({
      success: true,
      data: result,
      message: "Order created successfully",
    })
  } catch (error) {
    console.error("Order creation API error:", error)
    return NextResponse.json({ success: false, error: "Failed to create order" }, { status: 500 })
  }
}
