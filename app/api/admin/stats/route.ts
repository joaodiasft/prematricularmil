import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { startOfDay, startOfWeek, subDays } from "date-fns"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SECRETARY")) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      )
    }

    const today = startOfDay(new Date())
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 })
    const lastWeekStart = startOfWeek(subDays(new Date(), 7), { weekStartsOn: 1 })

    const [todayCount, weekCount, totalCount, confirmedCount, pendingCount, waitlistCount, rejectedCount, inAnalysisCount] = await Promise.all([
      prisma.preEnrollment.count({
        where: {
          createdAt: {
            gte: today,
          },
        },
      }),
      prisma.preEnrollment.count({
        where: {
          createdAt: {
            gte: weekStart,
          },
        },
      }),
      prisma.preEnrollment.count(),
      prisma.preEnrollment.count({
        where: {
          status: "CONFIRMED",
        },
      }),
      prisma.preEnrollment.count({
        where: {
          status: "PENDING",
        },
      }),
      prisma.preEnrollment.count({
        where: {
          status: "WAITLIST",
        },
      }),
      prisma.preEnrollment.count({
        where: {
          status: "REJECTED",
        },
      }),
      prisma.preEnrollment.count({
        where: {
          status: "IN_ANALYSIS",
        },
      }),
    ])

    const conversion = totalCount > 0 ? Math.round((confirmedCount / totalCount) * 100) : 0

    return NextResponse.json({
      today: todayCount,
      week: weekCount,
      total: totalCount,
      conversion,
      pending: pendingCount,
      confirmed: confirmedCount,
      waitlist: waitlistCount,
      rejected: rejectedCount,
      inAnalysis: inAnalysisCount,
    })
  } catch (error) {
    console.error("Error fetching stats:", error)
    return NextResponse.json(
      { error: "Erro ao buscar estatísticas" },
      { status: 500 }
    )
  }
}

