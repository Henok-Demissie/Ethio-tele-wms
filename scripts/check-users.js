const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkUsers() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        department: true,
        status: true,
        createdAt: true
      }
    });

    console.log('Users in database:');
    console.log('==================');
    
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} (${user.email})`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Department: ${user.department || 'Not specified'}`);
      console.log(`   Status: ${user.status}`);
      console.log(`   Created: ${user.createdAt.toLocaleDateString()}`);
      console.log('---');
    });

    // Find admin users specifically
    const adminUsers = users.filter(user => user.role === 'ADMIN');
    console.log(`\nAdmin users found: ${adminUsers.length}`);
    
    if (adminUsers.length > 0) {
      console.log('\nAdmin login credentials:');
      adminUsers.forEach(admin => {
        console.log(`Email: ${admin.email}`);
        console.log(`Password: admin123 (default password)`);
      });
    }

  } catch (error) {
    console.error('Error checking users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUsers();
