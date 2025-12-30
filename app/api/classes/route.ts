import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { EducationLevel } from "@prisma/client"

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    console.log("🔍 Buscando turmas no banco de dados...")
    
    const [highSchoolClasses, middleSchoolClasses] = await Promise.all([
      prisma.class.findMany({
        where: {
          educationLevel: EducationLevel.HIGH_SCHOOL,
        },
        include: {
          subject: true,
        },
        orderBy: {
          code: "asc",
        },
      }),
      prisma.class.findMany({
        where: {
          educationLevel: EducationLevel.MIDDLE_SCHOOL,
        },
        include: {
          subject: true,
        },
        orderBy: {
          code: "asc",
        },
      }),
    ])

    console.log(`✅ Encontradas ${highSchoolClasses.length} turmas do Ensino Médio`)
    console.log(`✅ Encontradas ${middleSchoolClasses.length} turmas do Ensino Fundamental`)

    const response = {
      highSchool: highSchoolClasses,
      middleSchool: middleSchoolClasses,
    }

    return NextResponse.json(response, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, max-age=0',
      },
    })
  } catch (error) {
    console.error("❌ Error fetching classes:", error)
    return NextResponse.json(
      { 
        error: "Erro ao buscar turmas",
        details: error instanceof Error ? error.message : "Erro desconhecido",
        highSchool: [],
        middleSchool: [],
      },
      { status: 500 }
    )
  }
}
