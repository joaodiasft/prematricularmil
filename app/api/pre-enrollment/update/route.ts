import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Não autenticado" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { enrollmentId, ...updateData } = body

    if (!enrollmentId) {
      return NextResponse.json(
        { error: "ID da pré-matrícula é obrigatório" },
        { status: 400 }
      )
    }

    // Verificar se a pré-matrícula pertence ao usuário
    const enrollment = await prisma.preEnrollment.findFirst({
      where: {
        id: enrollmentId,
        userId: session.user.id,
      },
    })

    if (!enrollment) {
      return NextResponse.json(
        { error: "Pré-matrícula não encontrada ou não pertence a você" },
        { status: 404 }
      )
    }

    // Preparar dados para atualização
    const updatePayload: any = {}
    
    if (updateData.fullName !== undefined) updatePayload.fullName = updateData.fullName
    if (updateData.email !== undefined) updatePayload.email = updateData.email
    if (updateData.age !== undefined) {
      updatePayload.age = updateData.age && updateData.age !== "" ? parseInt(updateData.age) : null
    }
    if (updateData.phone !== undefined) updatePayload.phone = updateData.phone || null
    if (updateData.whatsapp !== undefined) updatePayload.whatsapp = updateData.whatsapp || null
    if (updateData.instagram !== undefined) updatePayload.instagram = updateData.instagram || null
    if (updateData.currentSchool !== undefined) updatePayload.currentSchool = updateData.currentSchool || null
    if (updateData.currentGrade !== undefined) updatePayload.currentGrade = updateData.currentGrade || null

    // Atualizar a pré-matrícula específica
    const updated = await prisma.preEnrollment.update({
      where: { id: enrollmentId },
      data: updatePayload,
    })

    // Registrar ação no log
    await prisma.actionLog.create({
      data: {
        action: "STUDENT_DATA_UPDATE",
        userId: session.user.id,
        token: enrollment.token,
        details: `Aluno atualizou seus dados básicos`,
      },
    })

    return NextResponse.json({ success: true, enrollment: updated })
  } catch (error) {
    console.error("Error updating enrollment:", error)
    return NextResponse.json(
      { error: "Erro ao atualizar pré-matrícula" },
      { status: 500 }
    )
  }
}

