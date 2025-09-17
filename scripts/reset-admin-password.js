const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function resetAdminPassword() {
  try {
    // Find admin user
    const adminUser = await prisma.user.findFirst({
      where: { 
        OR: [
          { email: 'admin@ethiotelecom.et' },
          { role: 'ADMIN' }
        ]
      }
    });

    if (!adminUser) {
      console.log('No admin user found');
      return;
    }

    console.log('Found admin user:', adminUser.email);

    // Hash the new password
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Update the password
    await prisma.user.update({
      where: { id: adminUser.id },
      data: { password: hashedPassword }
    });

    console.log('Admin password reset successfully!');
    console.log('Email:', adminUser.email);
    console.log('Password: admin123');

  } catch (error) {
    console.error('Error resetting admin password:', error);
  } finally {
    await prisma.$disconnect();
  }
}

resetAdminPassword();
