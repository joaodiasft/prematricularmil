import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { EducationLevel, ClassShift } from "@prisma/client"

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
    const { code, name, subjectId, educationLevel, dayOfWeek, startTime, endTime, maxCapacity, shift } = body

    // Se o código mudou, verificar se já existe
    if (code) {
      const existing = await prisma.class.findUnique({
        where: { code },
      })

      if (existing && existing.id !== params.id) {
        return NextResponse.json(
          { error: "Código de turma já existe" },
          { status: 400 }
        )
      }
    }

    const updated = await prisma.class.update({
      where: { id: params.id },
      data: {
        ...(code && { code }),
        ...(name && { name }),
        ...(subjectId && { subjectId }),
        ...(educationLevel && { educationLevel: educationLevel as EducationLevel }),
        ...(dayOfWeek && { dayOfWeek }),
        ...(startTime && { startTime }),
        ...(endTime && { endTime }),
        ...(maxCapacity && { maxCapacity: parseInt(maxCapacity) }),
        ...(shift && { shift: shift as ClassShift }),
      },
      include: {
        subject: true,
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error("Error updating class:", error)
    return NextResponse.json(
      { error: "Erro ao atualizar turma" },
      { status: 500 }
    )
  }
}

export async function GET(
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

    const classItem = await prisma.class.findUnique({
      where: { id: params.id },
      include: {
        subject: true,
        preEnrollments: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
      },
    })

    if (!classItem) {
      return NextResponse.json(
        { error: "Turma não encontrada" },
        { status: 404 }
      )
    }

    return NextResponse.json(classItem)
  } catch (error) {
    console.error("Error fetching class:", error)
    return NextResponse.json(
      { error: "Erro ao buscar turma" },
      { status: 500 }
    )
  }
}

