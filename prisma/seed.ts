import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  const adminUsername = 'admin'
  const adminPassword = 'password123' // You should change this in production, but for now this is the default

  // Check if admin already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { username: adminUsername },
  })

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10)
    
    await prisma.user.create({
      data: {
        username: adminUsername,
        password: hashedPassword,
      },
    })
    
    console.log(`✅ Admin user created with username: ${adminUsername}`)
  } else {
    console.log('ℹ️ Admin user already exists. Skipping creation.')
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
