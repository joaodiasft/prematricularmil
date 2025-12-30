import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import crypto from "crypto"

export async function POST(request: Request) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json(
        { error: "Token é obrigatório" },
        { status: 400 }
      )
    }

    // Buscar pré-matrícula pelo token
    const preEnrollment = await prisma.preEnrollment.findUnique({
      where: { token: token.toUpperCase() },
      include: { user: true },
    })

    if (!preEnrollment || !preEnrollment.user) {
      return NextResponse.json(
        { error: "Token inválido" },
        { status: 400 }
      )
    }

    // Verificar tentativas de reset
    let resetAttempt = await prisma.passwordResetAttempt.findUnique({
      where: { token: token.toUpperCase() },
    })

    if (!resetAttempt) {
      resetAttempt = await prisma.passwordResetAttempt.create({
        data: {
          token: token.toUpperCase(),
          attempts: 0,
        },
      })
    }

    // Verificar limite de 2 tentativas
    if (resetAttempt.attempts >= 2) {
      return NextResponse.json(
        { error: "Limite de tentativas excedido. Este token já foi usado 2 vezes." },
        { status: 400 }
      )
    }

    // Gerar nova senha aleatória
    const newPassword = crypto.randomBytes(8).toString("hex")
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // Atualizar senha do usuário
    await prisma.user.update({
      where: { id: preEnrollment.userId },
      data: {
        password: hashedPassword,
      },
    })

    // Incrementar tentativas
    await prisma.passwordResetAttempt.update({
      where: { token: token.toUpperCase() },
      data: {
        attempts: resetAttempt.attempts + 1,
        lastAttempt: new Date(),
      },
    })

    // Registrar ação no log
    const clientIp = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"
    const userAgent = request.headers.get("user-agent") || "unknown"

    await prisma.actionLog.create({
      data: {
        action: "PASSWORD_RESET_BY_TOKEN",
        userId: preEnrollment.userId,
        token: token.toUpperCase(),
        details: `Senha resetada usando token ${token.toUpperCase()}. Tentativa ${resetAttempt.attempts + 1} de 2.`,
        ipAddress: clientIp,
        userAgent: userAgent,
      },
    })

    return NextResponse.json({
      success: true,
      password: newPassword,
      attemptsRemaining: 2 - (resetAttempt.attempts + 1),
    })
  } catch (error) {
    console.error("Error in forgot password:", error)
    return NextResponse.json(
      { error: "Erro ao processar solicitação" },
      { status: 500 }
    )
  }
}
