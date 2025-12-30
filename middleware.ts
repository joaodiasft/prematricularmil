import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAdminRoute = req.nextUrl.pathname.startsWith("/admin")
    const isAdminLoginRoute = req.nextUrl.pathname.startsWith("/auth/admin/login")
    const isAlunoRoute = req.nextUrl.pathname.startsWith("/aluno")
    const isPreMatriculaRoute = req.nextUrl.pathname.startsWith("/pre-matricula")

    // Permitir acesso ao login admin sem autenticação
    if (isAdminLoginRoute) {
      return NextResponse.next()
    }

    // Se está tentando acessar área admin sem ser admin
    if (isAdminRoute && token?.role !== "ADMIN" && token?.role !== "SECRETARY") {
      return NextResponse.redirect(new URL("/auth/admin/login", req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const isAuthRoute = req.nextUrl.pathname.startsWith("/auth")
        const isPublicRoute = req.nextUrl.pathname === "/" || req.nextUrl.pathname.startsWith("/api/auth")

        // Rotas públicas
        if (isPublicRoute || isAuthRoute) {
          return true
        }

        // Rotas protegidas precisam de token
        return !!token
      },
    },
  }
)

export const config = {
  matcher: [
    "/admin/:path*",
    "/aluno/:path*",
    "/pre-matricula/:path*",
    "/auth/admin/:path*",
  ],
}

