const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createAdminUser() {
  try {
    // Check if admin user already exists
    const existingAdmin = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    });

    if (existingAdmin) {
      console.log('Admin user already exists:', existingAdmin.email);
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Create admin user
    const adminUser = await prisma.user.create({
      data: {
        name: 'System Administrator',
        email: 'admin@ethiotelecom.com',
        password: hashedPassword,
        role: 'ADMIN',
        department: 'IT Administration',
        status: 'ACTIVE',
        emailVerified: new Date(),
      }
    });

    console.log('Admin user created successfully:');
    console.log('Email:', adminUser.email);
    console.log('Password: admin123');
    console.log('Role:', adminUser.role);
    console.log('Department:', adminUser.department);

  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser();