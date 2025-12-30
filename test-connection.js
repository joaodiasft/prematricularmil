// Script para testar conexão com banco e verificar turmas
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function test() {
  try {
    console.log('🔍 Testando conexão com banco de dados...\n')
    
    // Testar conexão
    await prisma.$connect()
    console.log('✅ Conexão com banco estabelecida!\n')
    
    // Contar turmas
    const totalClasses = await prisma.class.count()
    console.log(`📊 Total de turmas no banco: ${totalClasses}\n`)
    
    // Listar turmas do Ensino Médio
    const highSchool = await prisma.class.findMany({
      where: { educationLevel: 'HIGH_SCHOOL' },
      include: { subject: true }
    })
    
    console.log(`🏫 Turmas do Ensino Médio (${highSchool.length}):`)
    highSchool.forEach(c => {
      console.log(`   - ${c.code}: ${c.name} (${c.subject.name})`)
    })
    
    console.log('\n')
    
    // Listar turmas do Ensino Fundamental
    const middleSchool = await prisma.class.findMany({
      where: { educationLevel: 'MIDDLE_SCHOOL' },
      include: { subject: true }
    })
    
    console.log(`📚 Turmas do Ensino Fundamental (${middleSchool.length}):`)
    middleSchool.forEach(c => {
      console.log(`   - ${c.code}: ${c.name} (${c.subject.name})`)
    })
    
    console.log('\n✅ Teste concluído!')
    
  } catch (error) {
    console.error('❌ Erro:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

test()

