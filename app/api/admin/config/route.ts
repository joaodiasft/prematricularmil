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

    const configs = await prisma.systemConfig.findMany()
    const configMap: Record<string, string> = {}
    configs.forEach((config) => {
      configMap[config.key] = config.value
    })

    return NextResponse.json(configMap)
  } catch (error) {
    console.error("Error fetching config:", error)
    return NextResponse.json(
      { error: "Erro ao buscar configurações" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      )
    }

    const body = await request.json()

    await Promise.all([
      prisma.systemConfig.upsert({
        where: { key: "success_message" },
        update: { value: body.successMessage || "" },
        create: { key: "success_message", value: body.successMessage || "" },
      }),
      prisma.systemConfig.upsert({
        where: { key: "whatsapp_message" },
        update: { value: body.whatsappMessage || "" },
        create: { key: "whatsapp_message", value: body.whatsappMessage || "" },
      }),
      prisma.systemConfig.upsert({
        where: { key: "scheduling_start_date" },
        update: { value: body.schedulingStartDate || "" },
        create: { key: "scheduling_start_date", value: body.schedulingStartDate || "" },
      }),
      prisma.systemConfig.upsert({
        where: { key: "max_vacancies" },
        update: { value: String(body.maxVacancies || 15) },
        create: { key: "max_vacancies", value: String(body.maxVacancies || 15) },
      }),
    ])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error saving config:", error)
    return NextResponse.json(
      { error: "Erro ao salvar configurações" },
      { status: 500 }
    )
  }
}

