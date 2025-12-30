import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { PreEnrollmentStatus } from "@prisma/client"

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SECRETARY")) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { status, internalNotes } = body

    // Validar status
    const validStatuses = ["PENDING", "IN_ANALYSIS", "CONFIRMED", "WAITLIST", "REJECTED"]
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Status inválido" },
        { status: 400 }
      )
    }

    const updateData: any = {}
    if (status) {
      updateData.status = status as PreEnrollmentStatus
    }
    if (internalNotes !== undefined) {
      updateData.internalNotes = internalNotes || null
    }

    const enrollment = await prisma.preEnrollment.update({
      where: { id: params.id },
      data: updateData,
      include: {
        class: {
          include: {
            subject: true,
          },
        },
        plan: true,
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    })

    // Registrar ação no log
    await prisma.actionLog.create({
      data: {
        action: "PRE_ENROLLMENT_STATUS_UPDATE",
        userId: session.user.id,
        token: enrollment.token,
        details: `Status alterado para ${status}${internalNotes ? `. Observações: ${internalNotes}` : ""}`,
      },
    })

    return NextResponse.json(enrollment)
  } catch (error) {
    console.error("Error updating pre-enrollment:", error)
    return NextResponse.json(
      { error: "Erro ao atualizar pré-matrícula" },
      { status: 500 }
    )
  }
}

