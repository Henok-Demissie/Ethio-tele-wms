/*
  Migration helper: copies data from local SQLite (prisma/dev-reset.db) into a Neon Postgres database.
  Usage:
    1. Install dependencies: `pnpm install` or `npm install` (we added better-sqlite3 and dotenv to package.json)
    2. Populate `.env.neon` with your Neon connection (we added a sample `.env.neon`).
    3. Run: `node scripts/migrate-to-neon.js` (or `npm run migrate:neon` if you add the script)

  Notes:
    - This script attempts to preserve IDs and relationships. It uses upsert where possible.
    - Keep backups before running on production.
*/

const sqlite3 = require('sqlite3').verbose();
const { PrismaClient } = require('@prisma/client');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(process.cwd(), '.env.neon') });


const sqlitePath = path.resolve(process.cwd(), 'prisma', 'dev-reset.db');
console.log('Opening SQLite DB:', sqlitePath);
const sqlite = new sqlite3.Database(sqlitePath, sqlite3.OPEN_READONLY, (err) => {
  if (err) {
    console.error('Failed to open SQLite DB:', err.message);
    process.exit(1);
  }
});

const prisma = new PrismaClient();


function rowsFrom(table) {
  return new Promise((resolve) => {
    sqlite.all(`SELECT * FROM ${table}`, [], (err, rows) => {
      if (err) {
        console.warn(`Table ${table} not found or error reading it:`, err.message);
        resolve([]);
      } else {
        resolve(rows);
      }
    });
  });
}

function toDate(val) {
  if (!val && val !== 0) return null;
  // SQLite may store datetimes as ISO strings or numeric timestamps
  const d = new Date(val);
  if (isNaN(d.getTime())) return null;
  return d;
}

async function migrateUsers() {
  const rows = await rowsFrom('users');
  console.log('Users to migrate:', rows.length);
  let migrated = 0;
  for (const r of rows) {
    const data = {
      id: r.id,
      name: r.name || null,
      email: r.email,
      emailVerified: toDate(r.emailVerified),
      image: r.image || null,
      password: r.password || null,
      role: r.role || 'VIEWER',
      department: r.department || null,
      status: r.status || 'ACTIVE',
      lastLogin: toDate(r.lastLogin),
      createdAt: toDate(r.createdAt) || undefined,
      updatedAt: toDate(r.updatedAt) || undefined,
    };
    try {
      await prisma.user.upsert({ where: { id: data.id }, create: data, update: data });
      migrated++;
    } catch (e) {
      console.error('Error migrating user', r.id, e.message);
    }
  }
  console.log(`Migrated users: ${migrated}`);
}

async function migrateWarehouses() {
  const rows = await rowsFrom('warehouses');
  console.log('Warehouses to migrate:', rows.length);
  let migrated = 0;
  for (const r of rows) {
    const data = {
      id: r.id,
      name: r.name,
      code: r.code,
      address: r.address || '',
      city: r.city || '',
      country: r.country || 'Ethiopia',
      manager: r.manager || null,
      phone: r.phone || null,
      email: r.email || null,
      capacity: r.capacity || null,
      isActive: r.isActive == null ? true : !!r.isActive,
      createdAt: toDate(r.createdAt) || undefined,
      updatedAt: toDate(r.updatedAt) || undefined,
    };
    try {
      await prisma.warehouse.upsert({ where: { id: data.id }, create: data, update: data });
      migrated++;
    } catch (e) {
      console.error('Error migrating warehouse', r.id, e.message);
    }
  }
  console.log(`Migrated warehouses: ${migrated}`);
}

async function migrateSuppliers() {
  const rows = await rowsFrom('suppliers');
  console.log('Suppliers to migrate:', rows.length);
  let migrated = 0;
  for (const r of rows) {
    const data = {
      id: r.id,
      name: r.name,
      code: r.code,
      email: r.email || null,
      phone: r.phone || null,
      address: r.address || null,
      city: r.city || null,
      country: r.country || 'Ethiopia',
      contactPerson: r.contactPerson || null,
      paymentTerms: r.paymentTerms || null,
      isActive: r.isActive == null ? true : !!r.isActive,
      createdAt: toDate(r.createdAt) || undefined,
      updatedAt: toDate(r.updatedAt) || undefined,
    };
    try {
      await prisma.supplier.upsert({ where: { id: data.id }, create: data, update: data });
      migrated++;
    } catch (e) {
      console.error('Error migrating supplier', r.id, e.message);
    }
  }
  console.log(`Migrated suppliers: ${migrated}`);
}

async function migrateProducts() {
  const rows = await rowsFrom('products');
  console.log('Products to migrate:', rows.length);
  let migrated = 0;
  for (const r of rows) {
    const data = {
      id: r.id,
      name: r.name,
      description: r.description || null,
      sku: r.sku,
      category: r.category || 'general',
      brand: r.brand || null,
      unitPrice: typeof r.unitPrice === 'number' ? r.unitPrice : parseFloat(r.unitPrice || 0) || 0,
      weight: r.weight == null ? null : parseFloat(r.weight),
      dimension: r.dimension || null,
      barcode: r.barcode || null,
      minStock: r.minStock == null ? 0 : Number(r.minStock),
      maxStock: r.maxStock == null ? null : Number(r.maxStock),
      isActive: r.isActive == null ? true : !!r.isActive,
      createdAt: toDate(r.createdAt) || undefined,
      updatedAt: toDate(r.updatedAt) || undefined,
    };
    try {
      await prisma.product.upsert({ where: { id: data.id }, create: data, update: data });
      migrated++;
    } catch (e) {
      console.error('Error migrating product', r.id, e.message);
    }
  }
  console.log(`Migrated products: ${migrated}`);
}

async function migrateOrdersAndItems() {
  const orderRows = await rowsFrom('orders');
  console.log('Orders to migrate:', orderRows.length);
  let ordersMigrated = 0;
  for (const r of orderRows) {
    const data = {
      id: r.id,
      orderNumber: r.orderNumber,
      type: r.type,
      status: r.status || 'PENDING',
      supplierId: r.supplierId || null,
      warehouseId: r.warehouseId,
      totalAmount: typeof r.totalAmount === 'number' ? r.totalAmount : parseFloat(r.totalAmount || 0) || 0,
      reason: r.reason || null,
      notes: r.notes || null,
      orderDate: toDate(r.orderDate) || undefined,
      expectedDate: toDate(r.expectedDate) || null,
      receivedDate: toDate(r.receivedDate) || null,
      createdById: r.createdById,
      updatedById: r.updatedById || null,
      createdAt: toDate(r.createdAt) || undefined,
      updatedAt: toDate(r.updatedAt) || undefined,
    };
    try {
      await prisma.order.upsert({ where: { id: data.id }, create: data, update: data });
      ordersMigrated++;
    } catch (e) {
      console.error('Error migrating order', r.id, e.message);
    }
  }
  console.log(`Migrated orders: ${ordersMigrated}`);

  // Order items
  const itemRows = await rowsFrom('order_items');
  console.log('Order items to migrate:', itemRows.length);
  let itemsMigrated = 0;
  for (const r of itemRows) {
    const data = {
      id: r.id,
      orderId: r.orderId,
      productId: r.productId,
      quantity: Number(r.quantity),
      unitPrice: typeof r.unitPrice === 'number' ? r.unitPrice : parseFloat(r.unitPrice || 0) || 0,
      totalPrice: typeof r.totalPrice === 'number' ? r.totalPrice : parseFloat(r.totalPrice || 0) || 0,
    };
    try {
      await prisma.orderItem.upsert({ where: { id: data.id }, create: data, update: data });
      itemsMigrated++;
    } catch (e) {
      console.error('Error migrating order item', r.id, e.message);
    }
  }
  console.log(`Migrated order items: ${itemsMigrated}`);
}

async function migrateInventory() {
  const rows = await rowsFrom('inventory');
  console.log('Inventory to migrate:', rows.length);
  let migrated = 0;
  for (const r of rows) {
    const data = {
      id: r.id,
      productId: r.productId,
      warehouseId: r.warehouseId,
      quantity: Number(r.quantity) || 0,
      reservedQty: Number(r.reservedQty) || 0,
      location: r.location || null,
      lastUpdated: toDate(r.lastUpdated) || undefined,
    };
    try {
      // inventory has unique [productId, warehouseId] - use create/update by id
      await prisma.inventory.upsert({ where: { id: data.id }, create: data, update: data });
      migrated++;
    } catch (e) {
      console.error('Error migrating inventory', r.id, e.message);
    }
  }
  console.log(`Migrated inventory: ${migrated}`);
}

async function migrateStockMovements() {
  const rows = await rowsFrom('stock_movements');
  console.log('Stock movements to migrate:', rows.length);
  let migrated = 0;
  for (const r of rows) {
    const data = {
      id: r.id,
      productId: r.productId,
      warehouseId: r.warehouseId,
      type: r.type,
      quantity: Number(r.quantity) || 0,
      reference: r.reference || null,
      notes: r.notes || null,
      userId: r.userId,
      createdAt: toDate(r.createdAt) || undefined,
    };
    try {
      await prisma.stockMovement.upsert({ where: { id: data.id }, create: data, update: data });
      migrated++;
    } catch (e) {
      console.error('Error migrating stock movement', r.id, e.message);
    }
  }
  console.log(`Migrated stock movements: ${migrated}`);
}

async function migrateAuditLogs() {
  const rows = await rowsFrom('audit_logs');
  console.log('Audit logs to migrate:', rows.length);
  let migrated = 0;
  for (const r of rows) {
    const data = {
      id: r.id,
      userId: r.userId,
      action: r.action,
      entity: r.entity,
      entityId: r.entityId,
      oldValues: r.oldValues || null,
      newValues: r.newValues || null,
      createdAt: toDate(r.createdAt) || undefined,
    };
    try {
      await prisma.auditLog.upsert({ where: { id: data.id }, create: data, update: data });
      migrated++;
    } catch (e) {
      console.error('Error migrating audit log', r.id, e.message);
    }
  }
  console.log(`Migrated audit logs: ${migrated}`);
}

async function migrateAuthTables() {
  // accounts
  const accounts = [...await rowsFrom('Account'), ...await rowsFrom('accounts')];
  console.log('Accounts to migrate:', accounts.length);
  let accMigrated = 0;
  for (const r of accounts) {
    const data = {
      id: r.id,
      userId: r.userId,
      type: r.type,
      provider: r.provider,
      providerAccountId: r.providerAccountId,
      refresh_token: r.refresh_token || null,
      access_token: r.access_token || null,
      expires_at: r.expires_at == null ? null : Number(r.expires_at),
      token_type: r.token_type || null,
      scope: r.scope || null,
      id_token: r.id_token || null,
      session_state: r.session_state || null,
    };
    try {
      await prisma.account.upsert({ where: { id: data.id }, create: data, update: data });
      accMigrated++;
    } catch (e) {
      console.error('Error migrating account', r.id, e.message);
    }
  }
  console.log(`Migrated accounts: ${accMigrated}`);

  // sessions
  const sessions = [...await rowsFrom('Session'), ...await rowsFrom('sessions')];
  console.log('Sessions to migrate:', sessions.length);
  let sesMigrated = 0;
  for (const r of sessions) {
    const data = {
      id: r.id,
      sessionToken: r.sessionToken,
      userId: r.userId,
      expires: toDate(r.expires) || undefined,
    };
    try {
      await prisma.session.upsert({ where: { id: data.id }, create: data, update: data });
      sesMigrated++;
    } catch (e) {
      console.error('Error migrating session', r.id, e.message);
    }
  }
  console.log(`Migrated sessions: ${sesMigrated}`);

  // password reset tokens
  const prt = [...await rowsFrom('password_reset_tokens'), ...await rowsFrom('PasswordResetToken')];
  console.log('PasswordResetTokens to migrate:', prt.length);
  let prtMigrated = 0;
  for (const r of prt) {
    const data = {
      id: r.id,
      email: r.email,
      token: r.token,
      expires: toDate(r.expires) || undefined,
      userId: r.userId,
      createdAt: toDate(r.createdAt) || undefined,
    };
    try {
      await prisma.passwordResetToken.upsert({ where: { id: data.id }, create: data, update: data });
      prtMigrated++;
    } catch (e) {
      console.error('Error migrating password reset token', r.id, e.message);
    }
  }
  console.log(`Migrated password reset tokens: ${prtMigrated}`);

  // verification tokens (identifier + token unique) - use createMany skipDuplicates
  const vrows = [...await rowsFrom('VerificationToken'), ...await rowsFrom('verification_tokens')];
  if (vrows.length) {
    try {
      const data = vrows.map(r => ({ identifier: r.identifier, token: r.token, expires: toDate(r.expires) }));
      // createMany may be faster; skip duplicates
      await prisma.verificationToken.createMany({ data, skipDuplicates: true });
      console.log(`Migrated verification tokens: ${data.length}`);
    } catch (e) {
      console.error('Error migrating verification tokens', e.message);
    }
  }
}

async function main() {
  console.log('Starting migration to Neon (Prisma) using DATABASE_URL from .env.neon');
  try {
    await migrateUsers();
    await migrateWarehouses();
    await migrateSuppliers();
    await migrateProducts();
    await migrateOrdersAndItems();
    await migrateInventory();
    await migrateStockMovements();
    await migrateAuditLogs();
    await migrateAuthTables();
    console.log('Migration completed.');
  } catch (e) {
    console.error('Migration failed:', e);
  } finally {
    await prisma.$disconnect();
  sqlite.close();
  }
}

main();
