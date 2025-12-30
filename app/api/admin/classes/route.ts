import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { EducationLevel, ClassShift } from "@prisma/client"

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SECRETARY")) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { code, name, subjectId, educationLevel, dayOfWeek, startTime, endTime, maxCapacity, shift } = body

    // Verificar se código já existe
    const existing = await prisma.class.findUnique({
      where: { code },
    })

    if (existing) {
      return NextResponse.json(
        { error: "Código de turma já existe" },
        { status: 400 }
      )
    }

    const newClass = await prisma.class.create({
      data: {
        code,
        name,
        subjectId,
        educationLevel: educationLevel as EducationLevel,
        dayOfWeek,
        startTime,
        endTime,
        maxCapacity: parseInt(maxCapacity),
        shift: shift as ClassShift,
      },
      include: {
        subject: true,
      },
    })

    return NextResponse.json(newClass)
  } catch (error) {
    console.error("Error creating class:", error)
    return NextResponse.json(
      { error: "Erro ao criar turma" },
      { status: 500 }
    )
  }
}

