import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { PreEnrollmentStatus, StudyObjective, WritingLevel, PaymentMethod, ClassShift } from "@prisma/client"

// Função auxiliar para gerar token único com retry (mantém padrão R00001, R00002, etc.)
async function generateUniqueToken(retries = 10): Promise<string> {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      // Buscar o maior número de token (não apenas o último criado)
      // Isso garante que mesmo após limpeza, a sequência continue corretamente
      const allEnrollments = await prisma.preEnrollment.findMany({
        select: { token: true },
      })

      let tokenNumber = 1
      if (allEnrollments.length > 0) {
        const numbers = allEnrollments
          .map(e => {
            const num = parseInt(e.token.replace("R", ""))
            return isNaN(num) ? 0 : num
          })
          .filter(n => n > 0)
        
        if (numbers.length > 0) {
          const maxNumber = Math.max(...numbers)
          tokenNumber = maxNumber + 1
        }
      }

      // Tentar encontrar um número disponível incrementando até encontrar um token livre
      let attemptsToFind = 0
      const maxAttemptsToFind = 100 // Limite de tentativas para encontrar número disponível
      
      while (attemptsToFind < maxAttemptsToFind) {
        const token = `R${String(tokenNumber).padStart(5, "0")}`
        
        // Verificar se o token já existe
        const exists = await prisma.preEnrollment.findUnique({
          where: { token },
          select: { id: true },
        })

        if (!exists) {
          return token
        }

        // Se existe, tentar o próximo número
        tokenNumber++
        attemptsToFind++
      }

      // Se não encontrou em 100 tentativas, aguardar e tentar novamente
      if (attempt < retries - 1) {
        await new Promise((resolve) => setTimeout(resolve, 100 * (attempt + 1)))
      }
    } catch (error) {
      console.error(`Erro ao gerar token (tentativa ${attempt + 1}):`, error)
      if (attempt < retries - 1) {
        await new Promise((resolve) => setTimeout(resolve, 100 * (attempt + 1)))
      }
    }
  }

  // Se todas as tentativas falharam, buscar o maior número e incrementar
  // Isso garante que sempre mantenha o padrão R00001, R00002, etc.
  try {
    // Buscar todos os tokens e encontrar o maior número
    const allEnrollments = await prisma.preEnrollment.findMany({
      select: { token: true },
    })

    let maxNumber = 0
    if (allEnrollments.length > 0) {
      const numbers = allEnrollments
        .map(t => {
          const num = parseInt(t.token.replace("R", ""))
          return isNaN(num) ? 0 : num
        })
        .filter(n => n > 0)
      
      if (numbers.length > 0) {
        maxNumber = Math.max(...numbers)
      }
    }

    // Incrementar e tentar encontrar um número disponível
    let nextNumber = maxNumber + 1
    let attempts = 0
    const maxAttempts = 1000 // Limite razoável para busca

    while (attempts < maxAttempts) {
      const token = `R${String(nextNumber).padStart(5, "0")}`
      
      const exists = await prisma.preEnrollment.findUnique({
        where: { token },
        select: { id: true },
      })

      if (!exists) {
        return token
      }

      nextNumber++
      attempts++
    }

    // Se não encontrou em 1000 tentativas, retornar o próximo número mesmo assim
    // (caso extremo, mas mantém o padrão)
    return `R${String(nextNumber).padStart(5, "0")}`
  } catch (error) {
    console.error("Erro ao buscar último token para fallback:", error)
    // Último recurso: buscar o último token criado
    try {
      const last = await prisma.preEnrollment.findFirst({
        orderBy: { createdAt: "desc" },
        select: { token: true },
      })
      if (last) {
        const num = parseInt(last.token.replace("R", ""))
        if (!isNaN(num)) {
          return `R${String(num + 1).padStart(5, "0")}`
        }
      }
    } catch (e) {
      console.error("Erro ao buscar último token:", e)
    }
    // Último recurso absoluto: começar do 1
    return "R00001"
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Não autenticado" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { step2, step3, step4, step5, step6 } = body

    console.log("📝 Recebendo pré-matrícula:", {
      step2: step2 ? Object.keys(step2) : null,
      step3: step3 ? Object.keys(step3) : null,
      step4: step4 ? { selectedClasses: step4.selectedClasses } : null,
      step5: step5 ? Object.keys(step5) : null,
      step6: step6 ? Object.keys(step6) : null,
    })

    // Validações básicas
    if (!step2 || !step2.fullName || !step2.email) {
      return NextResponse.json(
        { error: "Dados pessoais incompletos" },
        { status: 400 }
      )
    }

    // Obter turmas selecionadas
    const selectedClasses = step4?.selectedClasses || {}
    const classIds = Object.values(selectedClasses).filter((id): id is string => typeof id === "string")
    
    console.log("📚 Turmas selecionadas:", { selectedClasses, classIds, count: classIds.length })
    
    if (classIds.length === 0) {
      console.error("❌ Erro: Nenhuma turma selecionada")
      return NextResponse.json(
        { error: "Nenhuma turma selecionada" },
        { status: 400 }
      )
    }

    // Verificar se já existe pré-matrícula pendente para este usuário
    const existingPending = await prisma.preEnrollment.findFirst({
      where: {
        userId: session.user.id,
        status: PreEnrollmentStatus.PENDING,
      },
    })

    if (existingPending) {
      console.error("❌ Erro: Usuário já possui pré-matrícula pendente:", existingPending.token)
      return NextResponse.json(
        { error: "Você já possui uma pré-matrícula pendente. Aguarde a análise ou entre em contato." },
        { status: 400 }
      )
    }

    // Mapear objetivos de estudo
    const studyObjectives = step2.studyObjectives?.map((obj: string) => {
      if (obj === "ENEM") return StudyObjective.ENEM
      if (obj === "MEDICINA" || obj === "UFG_VESTIBULAR") return StudyObjective.UFG_VESTIBULAR
      if (obj === "REFORCO") return StudyObjective.SCHOOL_REINFORCEMENT
      if (obj === "CONCURSOS") return StudyObjective.PUBLIC_COMPETITIONS
      return StudyObjective.ENEM
    }) || []

    // Mapear nível de redação
    let writingLevel: WritingLevel | null = null
    if (step2.writingLevel === "BEGINNER") writingLevel = WritingLevel.BEGINNER
    if (step2.writingLevel === "INTERMEDIATE") writingLevel = WritingLevel.INTERMEDIATE
    if (step2.writingLevel === "ADVANCED") writingLevel = WritingLevel.ADVANCED

    // Mapear método de pagamento
    let paymentMethod: PaymentMethod | null = null
    if (step5?.paymentMethod === "CREDIT_CARD") paymentMethod = PaymentMethod.CREDIT_CARD
    if (step5?.paymentMethod === "PIX") paymentMethod = PaymentMethod.PIX
    if (step5?.paymentMethod === "CASH") paymentMethod = PaymentMethod.CASH

    // Mapear turno
    let confirmationShift: ClassShift | null = null
    if (step6?.selectedShift === "MORNING") confirmationShift = ClassShift.MORNING
    if (step6?.selectedShift === "AFTERNOON") confirmationShift = ClassShift.AFTERNOON
    if (step6?.selectedShift === "NIGHT") confirmationShift = ClassShift.NIGHT

    // Preparar dados comuns
    const commonData = {
      userId: session.user.id,
      status: PreEnrollmentStatus.PENDING,
      fullName: step2.fullName,
      email: step2.email,
      age: step2.age ? parseInt(String(step2.age)) : null,
      phone: step2.phone || null,
      whatsapp: step2.whatsapp || null,
      instagram: step2.instagram || null,
      currentSchool: step2.currentSchool || null,
      currentGrade: step2.currentGrade || null,
      studyObjectives,
      writingLevel,
      hasTakenENEM: step2.hasTakenENEM === "yes",
      enemScore: step2.enemScore ? parseFloat(String(step2.enemScore)) : null,
      fatherName: step3?.fatherName || "Não informado",
      fatherPhone: step3?.fatherPhone || "Não informado",
      motherName: step3?.motherName || "Não informado",
      motherPhone: step3?.motherPhone || "Não informado",
      planId: step5?.selectedPlan || null,
      paymentMethod,
      confirmationDate: step6?.selectedDate ? new Date(step6.selectedDate) : null,
      confirmationShift,
      confirmationNotes: step6?.notes || null,
    }

    // Criar pré-matrículas sequencialmente para evitar race conditions
    const preEnrollments = []
    for (const classId of classIds) {
      let token: string = ""
      let created: any
      let attempts = 0
      const maxAttempts = 10

      // Tentar criar com retry em caso de token duplicado
      while (attempts < maxAttempts) {
        try {
          token = await generateUniqueToken()
          
          created = await prisma.preEnrollment.create({
            data: {
              ...commonData,
              token,
              classId: classId,
            },
          })
          
          preEnrollments.push(created)
          break // Sucesso, sair do loop
        } catch (error: any) {
          // Se for erro de token duplicado, tentar novamente
          if (error.code === "P2002" && error.meta?.target?.includes("token")) {
            attempts++
            console.warn(`Token duplicado detectado (tentativa ${attempts}): ${token || "N/A"}`)
            if (attempts >= maxAttempts) {
              throw new Error(`Não foi possível gerar token único após ${maxAttempts} tentativas`)
            }
            // Aguardar um pouco antes de tentar novamente
            await new Promise((resolve) => setTimeout(resolve, 50 * attempts))
          } else {
            // Outro tipo de erro, propagar
            throw error
          }
        }
      }
    }

    // Retornar o token da primeira pré-matrícula (principal)
    return NextResponse.json({ 
      success: true, 
      token: preEnrollments[0].token,
      tokens: preEnrollments.map(pe => pe.token),
      count: preEnrollments.length
    })
  } catch (error: any) {
    console.error("Error creating pre-enrollment:", error)
    
    // Retornar mensagem de erro mais específica
    let errorMessage = "Erro ao criar pré-matrícula"
    if (error.code === "P2002") {
      if (error.meta?.target?.includes("token")) {
        errorMessage = "Erro ao gerar token único. Tente novamente."
      } else {
        errorMessage = "Dados duplicados. Verifique suas informações."
      }
    } else if (error.message) {
      errorMessage = error.message
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}
