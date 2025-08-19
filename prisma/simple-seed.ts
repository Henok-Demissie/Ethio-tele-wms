import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting simple database seeding...')

  // Clear existing data
  await prisma.auditLog.deleteMany()
  await prisma.stockMovement.deleteMany()
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.inventory.deleteMany()
  await prisma.product.deleteMany()
  await prisma.warehouse.deleteMany()
  await prisma.supplier.deleteMany()
  await prisma.user.deleteMany()

  console.log('🗑️  Cleared existing data')

  // Create a simple user
  const admin = await prisma.user.create({
    data: {
      name: 'System Administrator',
      email: 'admin@ethiotelecom.et',
      password: 'admin123',
      role: 'ADMIN',
      department: 'IT',
      status: 'ACTIVE',
    },
  })

  console.log('👥 Created user')

  // Create warehouses
  const mainWarehouse = await prisma.warehouse.create({
    data: {
      name: 'Main Warehouse',
      code: 'MW-001',
      address: 'Addis Ababa Central',
      city: 'Addis Ababa',
      country: 'Ethiopia',
      manager: 'Warehouse Manager',
      phone: '+251-11-123-4567',
      email: 'main.warehouse@ethiotelecom.et',
      capacity: 10000,
      isActive: true,
    },
  })

  const northWarehouse = await prisma.warehouse.create({
    data: {
      name: 'Regional Warehouse North',
      code: 'RWN-001',
      address: 'Bahir Dar',
      city: 'Bahir Dar',
      country: 'Ethiopia',
      manager: 'Regional Manager',
      phone: '+251-58-123-4567',
      email: 'north.warehouse@ethiotelecom.et',
      capacity: 5000,
      isActive: true,
    },
  })

  console.log('🏢 Created warehouses')

  // Create products
  const router = await prisma.product.create({
    data: {
      name: "Cisco Router 2900 Series",
      sku: "RTR-2900-001",
      description: "Enterprise-grade router for network infrastructure",
      category: "Network Equipment",
      brand: "Cisco",
      unitPrice: 15000,
      weight: 2.5,
      dimension: '{"length": 30, "width": 20, "height": 5}',
      barcode: "1234567890123",
      minStock: 5,
      maxStock: 50,
      isActive: true,
    },
  })

  const switch1 = await prisma.product.create({
    data: {
      name: "HP ProCurve Switch 2920",
      sku: "SW-2920-001",
      description: "24-port managed switch for enterprise networks",
      category: "Network Equipment",
      brand: "HP",
      unitPrice: 8500,
      weight: 15.0,
      dimension: '{"length": 40, "width": 20, "height": 15}',
      barcode: "1234567890125",
      minStock: 10,
      maxStock: 30,
      isActive: true,
    },
  })

  const cable = await prisma.product.create({
    data: {
      name: "Cat6 Ethernet Cable",
      sku: "CBL-CAT6-001",
      description: "High-quality Cat6 network cable",
      category: "Cables",
      brand: "Generic",
      unitPrice: 250,
      weight: 8.0,
      dimension: '{"length": 305, "width": 0.5, "height": 0.5}',
      barcode: "1234567890124",
      minStock: 20,
      maxStock: 100,
      isActive: true,
    },
  })

  console.log('🏭 Created products')

  // Create inventory items
  const inventory1 = await prisma.inventory.create({
    data: {
      productId: router.id,
      warehouseId: mainWarehouse.id,
      quantity: 25,
      reservedQty: 5,
      location: "A1-B1",
    },
  })

  const inventory2 = await prisma.inventory.create({
    data: {
      productId: switch1.id,
      warehouseId: mainWarehouse.id,
      quantity: 15,
      reservedQty: 3,
      location: "A2-B1",
    },
  })

  const inventory3 = await prisma.inventory.create({
    data: {
      productId: cable.id,
      warehouseId: mainWarehouse.id,
      quantity: 50,
      reservedQty: 10,
      location: "B1-C1",
    },
  })

  const inventory4 = await prisma.inventory.create({
    data: {
      productId: router.id,
      warehouseId: northWarehouse.id,
      quantity: 10,
      reservedQty: 2,
      location: "A1-B1",
    },
  })

  console.log('📋 Created inventory items')

  console.log('✅ Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

