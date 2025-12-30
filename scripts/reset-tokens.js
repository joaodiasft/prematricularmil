const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function resetTokens() {
  try {
    console.log('🔄 Iniciando reset de tokens...')
    
    // Deletar todas as pré-matrículas
    const deleted = await prisma.preEnrollment.deleteMany({})
    console.log(`✅ ${deleted.count} pré-matrícula(s) deletada(s)`)
    
    // Deletar todos os logs de ação relacionados (se existir)
    try {
      const deletedLogs = await prisma.actionLog.deleteMany({})
      console.log(`✅ ${deletedLogs.count} log(s) de ação deletado(s)`)
    } catch (error) {
      console.log('⚠️  Logs de ação não encontrados ou já deletados')
    }
    
    // Deletar tentativas de recuperação de senha (se existir)
    try {
      const deletedPasswordResets = await prisma.passwordResetAttempt.deleteMany({})
      console.log(`✅ ${deletedPasswordResets.count} tentativa(s) de recuperação deletada(s)`)
    } catch (error) {
      console.log('⚠️  Tentativas de recuperação não encontradas ou já deletadas')
    }
    
    console.log('\n✨ Reset completo! Os tokens agora começarão do R00001')
    console.log('📝 Você pode começar novos cadastros agora.')
    
  } catch (error) {
    console.error('❌ Erro ao resetar tokens:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

resetTokens()

