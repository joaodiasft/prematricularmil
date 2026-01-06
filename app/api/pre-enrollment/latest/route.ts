import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Não autenticado" },
        { status: 401 }
      )
    }

    // Buscar todas as pré-matrículas do usuário
    const preEnrollments = await prisma.preEnrollment.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        class: {
          include: {
            subject: true,
          },
        },
        plan: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    if (!preEnrollments || preEnrollments.length === 0) {
      return NextResponse.json(
        { error: "Pré-matrícula não encontrada" },
        { status: 404 }
      )
    }

    // A mais recente é a principal (para manter compatibilidade)
    const latest = preEnrollments[0]
    
    // Coletar todas as turmas únicas (pode haver múltiplas pré-matrículas com a mesma turma)
    const uniqueClasses = preEnrollments
      .map(pe => pe.class)
      .filter((classItem, index, self) => 
        index === self.findIndex(c => c?.id === classItem?.id)
      )
    
    // Retornar a principal com todas as turmas
    return NextResponse.json({
      ...latest,
      allEnrollments: preEnrollments,
      classes: uniqueClasses.length > 0 ? uniqueClasses : (latest.class ? [latest.class] : []),
    })
  } catch (error) {
    console.error("Error fetching latest pre-enrollment:", error)
    return NextResponse.json(
      { error: "Erro ao buscar pré-matrícula" },
      { status: 500 }
    )
  }
}

