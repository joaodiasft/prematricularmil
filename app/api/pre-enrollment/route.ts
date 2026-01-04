import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { PreEnrollmentStatus, StudyObjective, WritingLevel, PaymentMethod, ClassShift } from "@prisma/client"

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

    // Obter turmas selecionadas
    const selectedClasses = step4?.selectedClasses || {}
    const classIds = Object.values(selectedClasses) as string[]
    
    console.log("🎓 Turmas selecionadas:", { selectedClasses, classIds, count: classIds.length })
    
    if (classIds.length === 0) {
      console.error("❌ Erro: Nenhuma turma selecionada")
      return NextResponse.json(
        { error: "Nenhuma turma selecionada" },
        { status: 400 }
      )
    }

    // Gerar token base único (R00001, R00002, etc.)
    const lastEnrollment = await prisma.preEnrollment.findFirst({
      orderBy: {
        createdAt: "desc",
      },
    })

    let tokenNumber = 1
    if (lastEnrollment) {
      const lastNumber = parseInt(lastEnrollment.token.replace("R", ""))
      tokenNumber = lastNumber + 1
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
    if (step5.paymentMethod === "CREDIT_CARD") paymentMethod = PaymentMethod.CREDIT_CARD
    if (step5.paymentMethod === "PIX") paymentMethod = PaymentMethod.PIX
    if (step5.paymentMethod === "CASH") paymentMethod = PaymentMethod.CASH

    // Mapear turno
    let confirmationShift: ClassShift | null = null
    if (step6.selectedShift === "MORNING") confirmationShift = ClassShift.MORNING
    if (step6.selectedShift === "AFTERNOON") confirmationShift = ClassShift.AFTERNOON
    if (step6.selectedShift === "NIGHT") confirmationShift = ClassShift.NIGHT

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

    // Criar uma pré-matrícula para cada turma selecionada
    const preEnrollments = await Promise.all(
      classIds.map(async (classId, index) => {
        const currentTokenNumber = tokenNumber + index
        const token = `R${String(currentTokenNumber).padStart(5, "0")}`
        
        // Verificar se o token já existe (segurança extra)
        const tokenExists = await prisma.preEnrollment.findUnique({
          where: { token },
        })

        if (tokenExists) {
          // Se o token existe, gerar um novo
          const lastToken = await prisma.preEnrollment.findFirst({
            orderBy: { createdAt: "desc" },
          })
          const newTokenNumber = lastToken 
            ? parseInt(lastToken.token.replace("R", "")) + 1 + index
            : currentTokenNumber
          const newToken = `R${String(newTokenNumber).padStart(5, "0")}`
          
          return await prisma.preEnrollment.create({
            data: {
              token: newToken,
              userId: session.user.id,
              status: PreEnrollmentStatus.PENDING,
              fullName: step2.fullName,
              email: step2.email,
              age: step2.age ? parseInt(step2.age) : null,
              phone: step2.phone || null,
              whatsapp: step2.whatsapp || null,
              instagram: step2.instagram || null,
              currentSchool: step2.currentSchool || null,
              currentGrade: step2.currentGrade || null,
              studyObjectives,
              writingLevel,
              hasTakenENEM: step2.hasTakenENEM === "yes",
              enemScore: step2.enemScore ? parseFloat(step2.enemScore) : null,
              fatherName: step3.fatherName || "Não informado",
              fatherPhone: step3.fatherPhone || "Não informado",
              motherName: step3.motherName || "Não informado",
              motherPhone: step3.motherPhone || "Não informado",
              classId: classId,
              planId: step5.selectedPlan,
              paymentMethod,
              confirmationDate: step6.selectedDate ? new Date(step6.selectedDate) : null,
              confirmationShift,
              confirmationNotes: step6.notes || null,
            },
          })
        }
        
        return await prisma.preEnrollment.create({
          data: {
            token,
            userId: session.user.id,
            status: PreEnrollmentStatus.PENDING,
            fullName: step2.fullName,
            email: step2.email,
            age: step2.age ? parseInt(step2.age) : null,
            phone: step2.phone || null,
            whatsapp: step2.whatsapp || null,
            instagram: step2.instagram || null,
            currentSchool: step2.currentSchool || null,
            currentGrade: step2.currentGrade || null,
            studyObjectives,
            writingLevel,
            hasTakenENEM: step2.hasTakenENEM === "yes",
            enemScore: step2.enemScore ? parseFloat(step2.enemScore) : null,
            fatherName: step3.fatherName || "Não informado",
            fatherPhone: step3.fatherPhone || "Não informado",
            motherName: step3.motherName || "Não informado",
            motherPhone: step3.motherPhone || "Não informado",
            classId: classId,
            planId: step5.selectedPlan,
            paymentMethod,
            confirmationDate: step6.selectedDate ? new Date(step6.selectedDate) : null,
            confirmationShift,
            confirmationNotes: step6.notes || null,
          },
        })
      })
    )

    // Retornar o token da primeira pré-matrícula (principal)
    return NextResponse.json({ 
      success: true, 
      token: preEnrollments[0].token,
      tokens: preEnrollments.map(pe => pe.token),
      count: preEnrollments.length
    })
  } catch (error) {
    console.error("Error creating pre-enrollment:", error)
    return NextResponse.json(
      { error: "Erro ao criar pré-matrícula" },
      { status: 500 }
    )
  }
}

