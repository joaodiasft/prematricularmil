const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function createAdmin() {
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  })

  const question = (query) => new Promise((resolve) => readline.question(query, resolve))

  try {
    console.log('=== Criar Usuário Administrador ===\n')

    const email = await question('Email do admin: ')
    const name = await question('Nome do admin: ')
    const password = await question('Senha: ')

    if (!email || !name || !password) {
      console.error('Todos os campos são obrigatórios!')
      process.exit(1)
    }

    // Verificar se já existe
    const existing = await prisma.user.findUnique({
      where: { email }
    })

    if (existing) {
      console.error(`\n❌ Usuário com email ${email} já existe!`)
      if (existing.role === 'ADMIN' || existing.role === 'SECRETARY') {
        console.log('Este usuário já é um administrador.')
      } else {
        const update = await question('\nDeseja atualizar este usuário para ADMIN? (s/n): ')
        if (update.toLowerCase() === 's') {
          const hashedPassword = await bcrypt.hash(password, 10)
          await prisma.user.update({
            where: { email },
            data: {
              name,
              password: hashedPassword,
              role: 'ADMIN'
            }
          })
          console.log('\n✅ Usuário atualizado para ADMIN com sucesso!')
        } else {
          console.log('Operação cancelada.')
        }
      }
      process.exit(0)
    }

    // Criar admin
    const hashedPassword = await bcrypt.hash(password, 10)
    const admin = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role: 'ADMIN',
        emailVerified: new Date()
      }
    })

    console.log('\n✅ Usuário administrador criado com sucesso!')
    console.log(`\nEmail: ${admin.email}`)
    console.log(`Nome: ${admin.name}`)
    console.log(`Role: ${admin.role}`)
    console.log(`\nAcesse: http://localhost:3000/auth/admin/login`)

  } catch (error) {
    console.error('\n❌ Erro ao criar admin:', error.message)
    process.exit(1)
  } finally {
    readline.close()
    await prisma.$disconnect()
  }
}

createAdmin()

