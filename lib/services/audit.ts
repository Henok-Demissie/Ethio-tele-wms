import { query } from "@/lib/db"

export class AuditService {
  static async logAction(
    userId: string | null,
    action: string,
    tableName?: string,
    recordId?: string,
    oldValues?: any,
    newValues?: any,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<void> {
    try {
      await query(
        `
        INSERT INTO audit_logs (
          user_id, action, table_name, record_id, 
          old_values, new_values, ip_address, user_agent
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `,
        [
          userId,
          action,
          tableName,
          recordId,
          oldValues ? JSON.stringify(oldValues) : null,
          newValues ? JSON.stringify(newValues) : null,
          ipAddress,
          userAgent,
        ],
      )
    } catch (error) {
      console.error("Failed to log audit action:", error)
      // Don't throw error to avoid breaking the main operation
    }
  }

  static async getAuditLogs(
    params: {
      page?: number
      limit?: number
      userId?: string
      action?: string
      tableName?: string
      startDate?: Date
      endDate?: Date
    } = {},
  ) {
    try {
      const { page = 1, limit = 50, userId, action, tableName, startDate, endDate } = params

      const offset = (page - 1) * limit
      let whereClause = "WHERE 1=1"
      const queryParams: any[] = []

      if (userId) {
        whereClause += ` AND al.user_id = $${queryParams.length + 1}`
        queryParams.push(userId)
      }

      if (action) {
        whereClause += ` AND al.action ILIKE $${queryParams.length + 1}`
        queryParams.push(`%${action}%`)
      }

      if (tableName) {
        whereClause += ` AND al.table_name = $${queryParams.length + 1}`
        queryParams.push(tableName)
      }

      if (startDate) {
        whereClause += ` AND al.created_at >= $${queryParams.length + 1}`
        queryParams.push(startDate)
      }

      if (endDate) {
        whereClause += ` AND al.created_at <= $${queryParams.length + 1}`
        queryParams.push(endDate)
      }

      const countQuery = `
        SELECT COUNT(*) as total
        FROM audit_logs al
        ${whereClause}
      `

      const dataQuery = `
        SELECT 
          al.*,
          u.name as user_name,
          u.email as user_email
        FROM audit_logs al
        LEFT JOIN users u ON al.user_id = u.id
        ${whereClause}
        ORDER BY al.created_at DESC
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
      console.error("Error fetching audit logs:", error)
      throw new Error("Failed to fetch audit logs")
    }
  }
}
