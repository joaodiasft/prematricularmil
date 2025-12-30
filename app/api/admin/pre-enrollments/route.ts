import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SECRETARY")) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      )
    }

    const enrollments = await prisma.preEnrollment.findMany({
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
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(enrollments)
  } catch (error) {
    console.error("Error fetching pre-enrollments:", error)
    return NextResponse.json(
      { error: "Erro ao buscar pré-matrículas" },
      { status: 500 }
    )
  }
}

