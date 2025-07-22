import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const existingUser = await prisma.user.findUnique({
    where: { username: 'admin' }
  })

  if (!existingUser) {
    await prisma.user.create({
      data: {
        username: 'admin',
        password: '$2a$10$example.hash.here',
        name: 'Administrator',
        role: 'admin'
      }
    })
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 