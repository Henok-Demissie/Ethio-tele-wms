const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  const email = process.argv[2] || 'admin2@ethiotelecom.et'
  const password = process.argv[3] || 'admin123'
  const name = process.argv[4] || 'Secondary Admin'

  const hashedPassword = await bcrypt.hash(password, 12)

  // If user exists, update role to ADMIN; else create
  const existing = await prisma.user.findUnique({ where: { email } })

  if (existing) {
    await prisma.user.update({
      where: { email },
      data: { role: 'ADMIN', password: hashedPassword, status: 'ACTIVE' },
    })
    console.log(`✅ Updated existing user to ADMIN: ${email}`)
  } else {
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'ADMIN',
        department: 'IT',
        status: 'ACTIVE',
      },
    })
    console.log(`✅ Created new ADMIN user: ${email}`)
  }

  console.log(`\nYou can log in with:\nEmail: ${email}\nPassword: ${password}`)
}

main()
  .catch((e) => {
    console.error('❌ Error creating admin:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })



