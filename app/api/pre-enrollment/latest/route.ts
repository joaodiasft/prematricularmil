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

    const preEnrollment = await prisma.preEnrollment.findFirst({
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

    if (!preEnrollment) {
      return NextResponse.json(
        { error: "Pré-matrícula não encontrada" },
        { status: 404 }
      )
    }

    return NextResponse.json(preEnrollment)
  } catch (error) {
    console.error("Error fetching latest pre-enrollment:", error)
    return NextResponse.json(
      { error: "Erro ao buscar pré-matrícula" },
      { status: 500 }
    )
  }
}

