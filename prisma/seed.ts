import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

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

  // Create users
  const hashedPassword = await bcrypt.hash('admin123', 12)
  
  const admin = await prisma.user.create({
    data: {
      name: 'System Administrator',
      email: 'admin@ethiotelecom.et',
      password: hashedPassword,
      role: 'ADMIN',
      department: 'IT',
      status: 'ACTIVE',
    },
  })

  const manager = await prisma.user.create({
    data: {
      name: 'Warehouse Manager',
      email: 'manager@ethiotelecom.et',
      password: hashedPassword,
      role: 'MANAGER',
      department: 'Warehouse',
      status: 'ACTIVE',
    },
  })

  const supervisor = await prisma.user.create({
    data: {
      name: 'Inventory Supervisor',
      email: 'supervisor@ethiotelecom.et',
      password: hashedPassword,
      role: 'SUPERVISOR',
      department: 'Logistics',
      status: 'ACTIVE',
    },
  })

  const operator = await prisma.user.create({
    data: {
      name: 'Warehouse Operator',
      email: 'operator@ethiotelecom.et',
      password: hashedPassword,
      role: 'OPERATOR',
      department: 'Warehouse',
      status: 'ACTIVE',
    },
  })

  console.log('👥 Created users')

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

  const southWarehouse = await prisma.warehouse.create({
    data: {
      name: 'Regional Warehouse South',
      code: 'RWS-001',
      address: 'Hawassa',
      city: 'Hawassa',
      country: 'Ethiopia',
      manager: 'Regional Manager',
      phone: '+251-46-123-4567',
      email: 'south.warehouse@ethiotelecom.et',
      capacity: 5000,
      isActive: true,
    },
  })

  console.log('🏢 Created warehouses')

  // Create suppliers
  const techCorp = await prisma.supplier.create({
    data: {
      name: 'TechCorp Ethiopia',
      code: 'TECH-001',
      contactPerson: 'John Smith',
      email: 'sales@techcorp.et',
      phone: '+251-11-123-4567',
      address: 'Bole, Addis Ababa',
      city: 'Addis Ababa',
      country: 'Ethiopia',
      paymentTerms: 'Net 30',
      isActive: true,
    },
  })

  const networkSol = await prisma.supplier.create({
    data: {
      name: 'Network Solutions Ltd',
      code: 'NET-001',
      contactPerson: 'Sarah Johnson',
      email: 'info@netsol.et',
      phone: '+251-11-234-5678',
      address: 'Kazanchis, Addis Ababa',
      city: 'Addis Ababa',
      country: 'Ethiopia',
      paymentTerms: 'Net 45',
      isActive: true,
    },
  })

  const powerSys = await prisma.supplier.create({
    data: {
      name: 'Power Systems Inc',
      code: 'PWR-001',
      contactPerson: 'Michael Brown',
      email: 'contact@powersys.et',
      phone: '+251-11-345-6789',
      address: 'Merkato, Addis Ababa',
      city: 'Addis Ababa',
      country: 'Ethiopia',
      paymentTerms: 'Net 30',
      isActive: true,
    },
  })

  console.log('🏭 Created suppliers')

  // Create products
  const router = await prisma.product.create({
    data: {
      name: 'Cisco Router 2900 Series',
      sku: 'RTR-2900-001',
      description: 'Enterprise-grade router for network infrastructure',
      category: 'Network Equipment',
      brand: 'Cisco',
      unitPrice: 15000.00,
      weight: 2.5,
                dimension: '{"length": 30, "width": 20, "height": 5}',
      barcode: '1234567890123',
      minStock: 5,
      maxStock: 50,
      isActive: true,
    },
  })

  const cable = await prisma.product.create({
    data: {
      name: 'Ethernet Cable Cat6',
      sku: 'CBL-CAT6-001',
      description: 'High-speed ethernet cable 305m roll',
      category: 'Cables & Accessories',
      brand: 'Generic',
      unitPrice: 250.00,
      weight: 8.0,
                dimension: '{"length": 305, "width": 0.5, "height": 0.5}',
      barcode: '1234567890124',
      minStock: 20,
      maxStock: 200,
      isActive: true,
    },
  })

  const ups = await prisma.product.create({
    data: {
      name: 'UPS 3000VA',
      sku: 'UPS-3000-001',
      description: 'Uninterruptible power supply 3000VA capacity',
      category: 'Power & Backup',
      brand: 'APC',
      unitPrice: 8500.00,
      weight: 15.0,
                dimension: '{"length": 40, "width": 20, "height": 15}',
      barcode: '1234567890125',
      minStock: 10,
      maxStock: 100,
      isActive: true,
    },
  })

  const phone = await prisma.product.create({
    data: {
      name: 'IP Phone Cisco 7841',
      sku: 'PHN-7841-001',
      description: 'VoIP desk phone with advanced features',
      category: 'Telecommunications',
      brand: 'Cisco',
      unitPrice: 1200.00,
      weight: 0.8,
      dimensions: '{"length": 20, "width": 15, "height": 8}',
      barcode: '1234567890126',
      minStock: 15,
      maxStock: 150,
      isActive: true,
    },
  })

  const switch24 = await prisma.product.create({
    data: {
      name: 'Network Switch 24-Port',
      sku: 'SWT-24P-001',
      description: '24-port managed ethernet switch',
      category: 'Network Equipment',
      brand: 'HP',
      unitPrice: 5500.00,
      weight: 3.2,
      dimensions: '{"length": 35, "width": 25, "height": 4}',
      barcode: '1234567890127',
      minStock: 8,
      maxStock: 80,
      isActive: true,
    },
  })

  const fiberCable = await prisma.product.create({
    data: {
      name: 'Fiber Optic Cable SM',
      sku: 'CBL-FO-SM-001',
      description: 'Single-mode fiber optic cable 1km',
      category: 'Cables & Accessories',
      brand: 'Generic',
      unitPrice: 450.00,
      weight: 5.0,
      dimensions: '{"length": 1000, "width": 0.1, "height": 0.1}',
      barcode: '1234567890128',
      minStock: 25,
      maxStock: 250,
      isActive: true,
    },
  })

  console.log('📦 Created products')

  // Create inventory items
  const inventory1 = await prisma.inventory.create({
    data: {
      productId: router.id,
      warehouseId: mainWarehouse.id,
      quantity: 25,
      reservedQty: 2,
      location: 'A1-B2',
    },
  })

  const inventory2 = await prisma.inventory.create({
    data: {
      productId: cable.id,
      warehouseId: mainWarehouse.id,
      quantity: 150,
      reservedQty: 10,
      location: 'C3-D4',
    },
  })

  const inventory3 = await prisma.inventory.create({
    data: {
      productId: ups.id,
      warehouseId: mainWarehouse.id,
      quantity: 45,
      reservedQty: 5,
      location: 'E5-F6',
    },
  })

  const inventory4 = await prisma.inventory.create({
    data: {
      productId: phone.id,
      warehouseId: mainWarehouse.id,
      quantity: 80,
      reservedQty: 8,
      location: 'G7-H8',
    },
  })

  const inventory5 = await prisma.inventory.create({
    data: {
      productId: switch24.id,
      warehouseId: mainWarehouse.id,
      quantity: 35,
      reservedQty: 3,
      location: 'I9-J10',
    },
  })

  const inventory6 = await prisma.inventory.create({
    data: {
      productId: fiberCable.id,
      warehouseId: mainWarehouse.id,
      quantity: 120,
      reservedQty: 15,
      location: 'K11-L12',
    },
  })

  // Add some inventory to regional warehouses
  await prisma.inventory.create({
    data: {
      productId: router.id,
      warehouseId: northWarehouse.id,
      quantity: 10,
      reservedQty: 1,
      location: 'A1-B1',
    },
  })

  await prisma.inventory.create({
    data: {
      productId: cable.id,
      warehouseId: northWarehouse.id,
      quantity: 50,
      reservedQty: 5,
      location: 'C1-D1',
    },
  })

  await prisma.inventory.create({
    data: {
      productId: phone.id,
      warehouseId: southWarehouse.id,
      quantity: 20,
      reservedQty: 2,
      location: 'A1-B1',
    },
  })

  console.log('📋 Created inventory items')

  // Create sample orders
  const order1 = await prisma.order.create({
    data: {
      orderNumber: 'PO-2024-001',
      type: 'PURCHASE',
      status: 'PENDING',
      supplierId: techCorp.id,
      warehouseId: mainWarehouse.id,
      totalAmount: 75000.00,
      notes: 'Quarterly network equipment order',
      orderDate: new Date(),
      expectedDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      createdById: manager.id,
    },
  })

  const order2 = await prisma.order.create({
    data: {
      orderNumber: 'PO-2024-002',
      type: 'PURCHASE',
      status: 'APPROVED',
      supplierId: networkSol.id,
      warehouseId: mainWarehouse.id,
      totalAmount: 32500.00,
      notes: 'Network switches for expansion',
      orderDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      expectedDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      createdById: manager.id,
    },
  })

  console.log('📋 Created orders')

  // Create order items
  await prisma.orderItem.create({
    data: {
      orderId: order1.id,
      productId: router.id,
      quantity: 5,
      unitPrice: 15000.00,
      totalPrice: 75000.00,
    },
  })

  await prisma.orderItem.create({
    data: {
      orderId: order2.id,
      productId: switch24.id,
      quantity: 6,
      unitPrice: 5500.00,
      totalPrice: 33000.00,
    },
  })

  console.log('📦 Created order items')

  // Create sample stock movements
  await prisma.stockMovement.create({
    data: {
      productId: router.id,
      warehouseId: mainWarehouse.id,
      type: 'IN',
      quantity: 25,
      reference: 'INIT-001',
      notes: 'Initial stock setup',
      userId: admin.id,
    },
  })

  await prisma.stockMovement.create({
    data: {
      productId: cable.id,
      warehouseId: mainWarehouse.id,
      type: 'IN',
      quantity: 150,
      reference: 'INIT-002',
      notes: 'Initial stock setup',
      userId: admin.id,
    },
  })

  await prisma.stockMovement.create({
    data: {
      productId: ups.id,
      warehouseId: mainWarehouse.id,
      type: 'IN',
      quantity: 45,
      reference: 'INIT-003',
      notes: 'Initial stock setup',
      userId: admin.id,
    },
  })

  console.log('📊 Created stock movements')

  // Create sample audit logs
  await prisma.auditLog.create({
    data: {
      userId: admin.id,
      action: 'CREATE',
      entity: 'INVENTORY',
      entityId: inventory1.id,
      newValues: JSON.stringify({
        productId: router.id,
        warehouseId: mainWarehouse.id,
        quantity: 25,
        reservedQty: 2,
        location: 'A1-B2',
      }),
    },
  })

  await prisma.auditLog.create({
    data: {
      userId: manager.id,
      action: 'CREATE',
      entity: 'ORDER',
      entityId: order1.id,
      newValues: JSON.stringify({
        orderNumber: 'PO-2024-001',
        type: 'PURCHASE',
        status: 'PENDING',
        supplierId: techCorp.id,
        warehouseId: mainWarehouse.id,
        totalAmount: 75000.00,
      }),
    },
  })

  console.log('📝 Created audit logs')

  console.log('✅ Database seeding completed successfully!')
  console.log('')
  console.log('🔑 Login credentials:')
  console.log('Admin: admin@ethiotelecom.et / admin123')
  console.log('Manager: manager@ethiotelecom.et / admin123')
  console.log('Supervisor: supervisor@ethiotelecom.et / admin123')
  console.log('Operator: operator@ethiotelecom.et / admin123')
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
