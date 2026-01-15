import { PrismaClient, PreEnrollmentStatus } from "@prisma/client"

const prisma = new PrismaClient()

async function limparPreMatriculasIncompletas() {
  try {
    console.log("🔄 Iniciando limpeza de pré-matrículas incompletas...")

    // Buscar todas as pré-matrículas com status PENDING (incompletas)
    const preMatriculasPendentes = await prisma.preEnrollment.findMany({
      where: {
        status: PreEnrollmentStatus.PENDING,
      },
      select: {
        id: true,
        token: true,
        userId: true,
        fullName: true,
        email: true,
        createdAt: true,
      },
    })

    console.log(`📊 Encontradas ${preMatriculasPendentes.length} pré-matrículas pendentes (incompletas)`)

    if (preMatriculasPendentes.length === 0) {
      console.log("✅ Nenhuma pré-matrícula pendente encontrada. Nada a fazer.")
      return
    }

    // Buscar pré-matrículas completas para mostrar estatísticas
    const preMatriculasCompletas = await prisma.preEnrollment.findMany({
      where: {
        status: {
          not: PreEnrollmentStatus.PENDING,
        },
      },
      select: {
        id: true,
        token: true,
        status: true,
      },
    })

    console.log(`✅ Encontradas ${preMatriculasCompletas.length} pré-matrículas completas (serão mantidas)`)

    // Mostrar tokens das pré-matrículas completas
    if (preMatriculasCompletas.length > 0) {
      const tokensCompletos = preMatriculasCompletas.map(p => p.token).sort()
      console.log(`\n📋 Tokens das pré-matrículas completas (serão mantidos):`)
      console.log(`   ${tokensCompletos.slice(0, 10).join(", ")}${tokensCompletos.length > 10 ? ` ... (+${tokensCompletos.length - 10} mais)` : ""}`)
    }

    // Buscar o maior token para manter a sequência
    const ultimoToken = await prisma.preEnrollment.findFirst({
      orderBy: {
        createdAt: "desc",
      },
      select: {
        token: true,
      },
    })

    if (ultimoToken) {
      const ultimoNumero = parseInt(ultimoToken.token.replace("R", ""))
      console.log(`\n🔢 Último token no sistema: ${ultimoToken.token} (número: ${ultimoNumero})`)
      console.log(`   Próximo token será: R${String(ultimoNumero + 1).padStart(5, "0")}`)
    }

    // Confirmar antes de deletar
    console.log(`\n⚠️  ATENÇÃO: Esta operação irá deletar ${preMatriculasPendentes.length} pré-matrículas pendentes.`)
    console.log(`   As ${preMatriculasCompletas.length} pré-matrículas completas serão mantidas.`)
    console.log(`   Os tokens existentes serão preservados.\n`)

    // Deletar pré-matrículas pendentes
    console.log("🗑️  Deletando pré-matrículas pendentes...")
    
    const resultado = await prisma.preEnrollment.deleteMany({
      where: {
        status: PreEnrollmentStatus.PENDING,
      },
    })

    console.log(`✅ ${resultado.count} pré-matrícula(s) pendente(s) deletada(s) com sucesso!`)

    // Verificar tokens restantes
    const tokensRestantes = await prisma.preEnrollment.findMany({
      select: {
        token: true,
        status: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    })

    console.log(`\n📊 Status final:`)
    console.log(`   - Pré-matrículas completas mantidas: ${preMatriculasCompletas.length}`)
    console.log(`   - Pré-matrículas pendentes deletadas: ${resultado.count}`)
    console.log(`   - Total de pré-matrículas no sistema: ${preMatriculasCompletas.length}`)

    if (tokensRestantes.length > 0) {
      console.log(`\n🔢 Últimos tokens no sistema (após limpeza):`)
      tokensRestantes.forEach(p => {
        console.log(`   - ${p.token} (${p.status})`)
      })
    }

    console.log(`\n✅ Limpeza concluída com sucesso!`)
    console.log(`   Os usuários agora podem começar novas pré-matrículas.`)
    console.log(`   A sequência de tokens será mantida a partir do último token existente.`)

  } catch (error) {
    console.error("❌ Erro ao limpar pré-matrículas incompletas:", error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Executar o script
limparPreMatriculasIncompletas()
  .then(() => {
    console.log("\n✅ Script executado com sucesso!")
    process.exit(0)
  })
  .catch((error) => {
    console.error("\n❌ Erro ao executar script:", error)
    process.exit(1)
  })
