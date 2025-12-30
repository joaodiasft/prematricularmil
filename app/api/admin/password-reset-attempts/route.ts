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

    const attempts = await prisma.passwordResetAttempt.findMany({
      orderBy: {
        updatedAt: "desc",
      },
    })

    return NextResponse.json(attempts)
  } catch (error) {
    console.error("Error fetching password reset attempts:", error)
    return NextResponse.json(
      { error: "Erro ao buscar tentativas" },
      { status: 500 }
    )
  }
}

