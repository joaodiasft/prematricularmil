import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const classData = await prisma.class.findUnique({
      where: {
        id: params.id,
      },
      include: {
        subject: true,
      },
    })

    if (!classData) {
      return NextResponse.json(
        { error: "Turma não encontrada" },
        { status: 404 }
      )
    }

    return NextResponse.json(classData)
  } catch (error) {
    console.error("Error fetching class:", error)
    return NextResponse.json(
      { error: "Erro ao buscar turma" },
      { status: 500 }
    )
  }
}

