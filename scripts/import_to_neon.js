/*
  Import JSON files produced by scripts/export_sqlite.py into Neon using Prisma client.
  Usage:
    1. Generate JSON: python scripts/export_sqlite.py
    2. Ensure .env.neon exists with DATABASE_URL pointing to Neon pooler URL
    3. npm install dotenv @prisma/client
    4. node scripts/import_to_neon.js
*/

const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');

dotenv.config({ path: path.resolve(process.cwd(), '.env.neon') });
const prisma = new PrismaClient();

function readJSON(name) {
  const p = path.resolve(__dirname, 'data', `${name}.json`);
  if (!fs.existsSync(p)) return [];
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

async function upsertUsers() {
  const rows = readJSON('users');
  console.log('Users:', rows.length);
  for (const r of rows) {
    const data = {
      id: r.id,
      name: r.name || null,
      email: r.email,
      emailVerified: r.emailVerified ? new Date(r.emailVerified) : null,
      image: r.image || null,
      password: r.password || null,
      role: r.role || 'VIEWER',
      department: r.department || null,
      status: r.status || 'ACTIVE',
      lastLogin: r.lastLogin ? new Date(r.lastLogin) : null,
      createdAt: r.createdAt ? new Date(r.createdAt) : undefined,
      updatedAt: r.updatedAt ? new Date(r.updatedAt) : undefined,
    };
    try {
      await prisma.user.upsert({ where: { id: data.id }, create: data, update: data });
    } catch (e) {
      console.error('User upsert error', e.message);
    }
  }
}

async function upsertOthers() {
  const warehouses = readJSON('warehouses');
  console.log('Warehouses:', warehouses.length);
  for (const r of warehouses) {
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
      createdAt: r.createdAt ? new Date(r.createdAt) : undefined,
      updatedAt: r.updatedAt ? new Date(r.updatedAt) : undefined,
    };
    try {
      await prisma.warehouse.upsert({ where: { id: data.id }, create: data, update: data });
    } catch (e) { console.error('warehouse', e.message); }
  }

  const suppliers = readJSON('suppliers');
  console.log('Suppliers:', suppliers.length);
  for (const r of suppliers) {
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
      createdAt: r.createdAt ? new Date(r.createdAt) : undefined,
      updatedAt: r.updatedAt ? new Date(r.updatedAt) : undefined,
    };
    try { await prisma.supplier.upsert({ where: { id: data.id }, create: data, update: data }); } catch (e) { console.error('supplier', e.message); }
  }

  const products = readJSON('products');
  console.log('Products:', products.length);
  for (const r of products) {
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
      createdAt: r.createdAt ? new Date(r.createdAt) : undefined,
      updatedAt: r.updatedAt ? new Date(r.updatedAt) : undefined,
    };
    try { await prisma.product.upsert({ where: { id: data.id }, create: data, update: data }); } catch (e) { console.error('product', e.message); }
  }

  const inventory = readJSON('inventory');
  console.log('Inventory:', inventory.length);
  for (const r of inventory) {
    const data = {
      id: r.id,
      productId: r.productId,
      warehouseId: r.warehouseId,
      quantity: Number(r.quantity) || 0,
      reservedQty: Number(r.reservedQty) || 0,
      location: r.location || null,
      lastUpdated: r.lastUpdated ? new Date(r.lastUpdated) : undefined,
    };
    try { await prisma.inventory.upsert({ where: { id: data.id }, create: data, update: data }); } catch (e) { console.error('inventory', e.message); }
  }

  const orders = readJSON('orders');
  console.log('Orders:', orders.length);
  for (const r of orders) {
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
      orderDate: r.orderDate ? new Date(r.orderDate) : undefined,
      expectedDate: r.expectedDate ? new Date(r.expectedDate) : null,
      receivedDate: r.receivedDate ? new Date(r.receivedDate) : null,
      createdById: r.createdById,
      updatedById: r.updatedById || null,
      createdAt: r.createdAt ? new Date(r.createdAt) : undefined,
      updatedAt: r.updatedAt ? new Date(r.updatedAt) : undefined,
    };
    try { await prisma.order.upsert({ where: { id: data.id }, create: data, update: data }); } catch (e) { console.error('order', e.message); }
  }

  const order_items = readJSON('order_items');
  console.log('Order items:', order_items.length);
  for (const r of order_items) {
    const data = {
      id: r.id,
      orderId: r.orderId,
      productId: r.productId,
      quantity: Number(r.quantity),
      unitPrice: typeof r.unitPrice === 'number' ? r.unitPrice : parseFloat(r.unitPrice || 0) || 0,
      totalPrice: typeof r.totalPrice === 'number' ? r.totalPrice : parseFloat(r.totalPrice || 0) || 0,
    };
    try { await prisma.orderItem.upsert({ where: { id: data.id }, create: data, update: data }); } catch (e) { console.error('order_item', e.message); }
  }

  const stock_movements = readJSON('stock_movements');
  console.log('Stock movements:', stock_movements.length);
  for (const r of stock_movements) {
    const data = {
      id: r.id,
      productId: r.productId,
      warehouseId: r.warehouseId,
      type: r.type,
      quantity: Number(r.quantity) || 0,
      reference: r.reference || null,
      notes: r.notes || null,
      userId: r.userId,
      createdAt: r.createdAt ? new Date(r.createdAt) : undefined,
    };
    try { await prisma.stockMovement.upsert({ where: { id: data.id }, create: data, update: data }); } catch (e) { console.error('stock movement', e.message); }
  }

  const audit_logs = readJSON('audit_logs');
  console.log('Audit logs:', audit_logs.length);
  for (const r of audit_logs) {
    const data = {
      id: r.id,
      userId: r.userId,
      action: r.action,
      entity: r.entity,
      entityId: r.entityId,
      oldValues: r.oldValues || null,
      newValues: r.newValues || null,
      createdAt: r.createdAt ? new Date(r.createdAt) : undefined,
    };
    try { await prisma.auditLog.upsert({ where: { id: data.id }, create: data, update: data }); } catch (e) { console.error('audit log', e.message); }
  }
}

async function main() {
  try {
    await upsertUsers();
    await upsertOthers();
    console.log('Import finished');
  } catch (e) {
    console.error('Import failed', e.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
