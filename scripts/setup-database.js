const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database setup...')

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 12)
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@ethiotelecom.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@ethiotelecom.com',
      password: hashedPassword,
      role: 'ADMIN',
      department: 'IT',
      status: 'ACTIVE',
    },
  })

  // Create warehouses
  const warehouse1 = await prisma.warehouse.upsert({
    where: { code: 'WH001' },
    update: {},
    create: {
      name: 'Main Warehouse',
      code: 'WH001',
      address: 'Addis Ababa, Ethiopia',
      city: 'Addis Ababa',
      country: 'Ethiopia',
      manager: 'John Doe',
      phone: '+251911234567',
      email: 'warehouse@ethiotelecom.com',
      capacity: 10000,
    },
  })

  const warehouse2 = await prisma.warehouse.upsert({
    where: { code: 'WH002' },
    update: {},
    create: {
      name: 'Secondary Warehouse',
      code: 'WH002',
      address: 'Dire Dawa, Ethiopia',
      city: 'Dire Dawa',
      country: 'Ethiopia',
      manager: 'Jane Smith',
      phone: '+251922345678',
      email: 'warehouse2@ethiotelecom.com',
      capacity: 5000,
    },
  })

  // Create suppliers
  const supplier1 = await prisma.supplier.upsert({
    where: { code: 'SUP001' },
    update: {},
    create: {
      name: 'Tech Supplies Ltd',
      code: 'SUP001',
      email: 'info@techsupplies.com',
      phone: '+251933456789',
      address: 'Addis Ababa, Ethiopia',
      city: 'Addis Ababa',
      country: 'Ethiopia',
      contactPerson: 'Mike Johnson',
      paymentTerms: 'Net 30',
    },
  })

  const supplier2 = await prisma.supplier.upsert({
    where: { code: 'SUP002' },
    update: {},
    create: {
      name: 'Global Electronics',
      code: 'SUP002',
      email: 'sales@globalelectronics.com',
      phone: '+251944567890',
      address: 'Nairobi, Kenya',
      city: 'Nairobi',
      country: 'Kenya',
      contactPerson: 'Sarah Wilson',
      paymentTerms: 'Net 45',
    },
  })

  // Create products
  const product1 = await prisma.product.upsert({
    where: { sku: 'PROD001' },
    update: {},
    create: {
      name: 'Laptop Computer',
      description: 'High-performance laptop for office use',
      sku: 'PROD001',
      category: 'Electronics',
      brand: 'Dell',
      unitPrice: 1500.00,
      weight: 2.5,
      dimensions: '35x24x2 cm',
      barcode: '1234567890123',
      minStock: 10,
      maxStock: 100,
    },
  })

  const product2 = await prisma.product.upsert({
    where: { sku: 'PROD002' },
    update: {},
    create: {
      name: 'Network Switch',
      description: '24-port network switch',
      sku: 'PROD002',
      category: 'Networking',
      brand: 'Cisco',
      unitPrice: 800.00,
      weight: 3.0,
      dimensions: '44x30x4 cm',
      barcode: '1234567890124',
      minStock: 5,
      maxStock: 50,
    },
  })

  const product3 = await prisma.product.upsert({
    where: { sku: 'PROD003' },
    update: {},
    create: {
      name: 'Office Chair',
      description: 'Ergonomic office chair',
      sku: 'PROD003',
      category: 'Furniture',
      brand: 'OfficeMax',
      unitPrice: 200.00,
      weight: 15.0,
      dimensions: '60x60x120 cm',
      barcode: '1234567890125',
      minStock: 20,
      maxStock: 200,
    },
  })

  // Create inventory
  await prisma.inventory.upsert({
    where: {
      productId_warehouseId: {
        productId: product1.id,
        warehouseId: warehouse1.id,
      },
    },
    update: {},
    create: {
      productId: product1.id,
      warehouseId: warehouse1.id,
      quantity: 25,
      reservedQty: 0,
      location: 'A1-B2',
    },
  })

  await prisma.inventory.upsert({
    where: {
      productId_warehouseId: {
        productId: product2.id,
        warehouseId: warehouse1.id,
      },
    },
    update: {},
    create: {
      productId: product2.id,
      warehouseId: warehouse1.id,
      quantity: 15,
      reservedQty: 0,
      location: 'C3-D4',
    },
  })

  await prisma.inventory.upsert({
    where: {
      productId_warehouseId: {
        productId: product3.id,
        warehouseId: warehouse1.id,
      },
    },
    update: {},
    create: {
      productId: product3.id,
      warehouseId: warehouse1.id,
      quantity: 50,
      reservedQty: 0,
      location: 'E5-F6',
    },
  })

  // Create sample stock-in orders
  const order1 = await prisma.order.upsert({
    where: { orderNumber: 'REC-2024-001' },
    update: {},
    create: {
      orderNumber: 'REC-2024-001',
      type: 'PURCHASE',
      status: 'PENDING',
      supplierId: supplier1.id,
      warehouseId: warehouse1.id,
      totalAmount: 3750.00,
      notes: 'Expected delivery next week',
      expectedDate: new Date('2024-02-15'),
      createdById: adminUser.id,
      updatedById: adminUser.id,
    },
  })

  const order2 = await prisma.order.upsert({
    where: { orderNumber: 'REC-2024-002' },
    update: {},
    create: {
      orderNumber: 'REC-2024-002',
      type: 'PURCHASE',
      status: 'RECEIVED',
      supplierId: supplier2.id,
      warehouseId: warehouse1.id,
      totalAmount: 1200.00,
      notes: 'All items received in good condition',
      receivedDate: new Date('2024-01-20'),
      createdById: adminUser.id,
      updatedById: adminUser.id,
    },
  })

  // Create order items
  await prisma.orderItem.create({
    data: {
      orderId: order1.id,
      productId: product1.id,
      quantity: 2,
      unitPrice: 1500.00,
      totalPrice: 3000.00,
    },
  })

  await prisma.orderItem.create({
    data: {
      orderId: order1.id,
      productId: product2.id,
      quantity: 1,
      unitPrice: 750.00,
      totalPrice: 750.00,
    },
  })

  await prisma.orderItem.create({
    data: {
      orderId: order2.id,
      productId: product3.id,
      quantity: 6,
      unitPrice: 200.00,
      totalPrice: 1200.00,
    },
  })

  console.log('🎉 Database setup completed successfully!')
  console.log('📧 Admin login: admin@ethiotelecom.com')
  console.log('🔑 Admin password: admin123')
}

main()
  .catch((e) => {
    console.error('❌ Database setup failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 