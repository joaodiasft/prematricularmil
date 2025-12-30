import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ isAdmin: false }, { status: 401 })
    }

    const isAdmin = session.user.role === "ADMIN" || session.user.role === "SECRETARY"

    return NextResponse.json({ isAdmin })
  } catch (error) {
    return NextResponse.json({ isAdmin: false }, { status: 500 })
  }
}

