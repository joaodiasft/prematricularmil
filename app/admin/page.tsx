"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Users, GraduationCap, BarChart3, Activity, AlertTriangle, CheckCircle, Clock, XCircle, List, DollarSign, Calendar } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import ptBR from "date-fns/locale/pt-BR"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface ActionLog {
  id: string
  action: string
  token: string | null
  details: string | null
  createdAt: string
  user: {
    name: string | null
    email: string
  } | null
}

interface Stats {
  today: number
  week: number
  total: number
  conversion: number
  pending: number
  confirmed: number
  waitlist: number
  rejected: number
  inAnalysis: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    today: 0,
    week: 0,
    total: 0,
    conversion: 0,
    pending: 0,
    confirmed: 0,
    waitlist: 0,
    rejected: 0,
    inAnalysis: 0,
  })
  const [recentLogs, setRecentLogs] = useState<ActionLog[]>([])
  const [recentEnrollments, setRecentEnrollments] = useState<any[]>([])

  useEffect(() => {
    fetchStats()
    fetchRecentLogs()
    fetchRecentEnrollments()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/admin/stats")
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error("Error fetching stats:", error)
    }
  }

  const fetchRecentLogs = async () => {
    try {
      const response = await fetch("/api/admin/action-logs?limit=10")
      if (!response.ok) {
        throw new Error("Erro ao buscar logs")
      }
      const data = await response.json()
      setRecentLogs(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Error fetching logs:", error)
      setRecentLogs([])
    }
  }

  const fetchRecentEnrollments = async () => {
    try {
      const response = await fetch("/api/admin/pre-enrollments")
      if (!response.ok) {
        throw new Error("Erro ao buscar pré-matrículas")
      }
      const data = await response.json()
      // Pegar apenas as 5 mais recentes e garantir que não há duplicatas por token
      const unique = Array.from(
        new Map((Array.isArray(data) ? data : []).map((item: any) => [item.token, item])).values()
      )
      setRecentEnrollments(unique.slice(0, 5))
    } catch (error) {
      console.error("Error fetching enrollments:", error)
      setRecentEnrollments([])
    }
  }

  const getActionLabel = (action: string) => {
    const labels: Record<string, string> = {
      PASSWORD_RESET_BY_TOKEN: "Reset de Senha por Token",
      STUDENT_DATA_UPDATE: "Atualização de Dados",
      PRE_ENROLLMENT_STATUS_UPDATE: "Atualização de Status",
    }
    return labels[action] || action
  }

  const getActionBadge = (action: string) => {
    if (action === "PASSWORD_RESET_BY_TOKEN") {
      return <Badge className="bg-orange-100 text-orange-800">Reset Senha</Badge>
    }
    if (action === "STUDENT_DATA_UPDATE") {
      return <Badge className="bg-blue-100 text-blue-800">Atualização</Badge>
    }
    if (action === "PRE_ENROLLMENT_STATUS_UPDATE") {
      return <Badge className="bg-purple-100 text-purple-800">Status</Badge>
    }
    return <Badge variant="outline">{action}</Badge>
  }

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; className: string; icon: any }> = {
      PENDING: { label: "Pendente", className: "bg-yellow-100 text-yellow-800", icon: Clock },
      IN_ANALYSIS: { label: "Em Análise", className: "bg-blue-100 text-blue-800", icon: Clock },
      CONFIRMED: { label: "Confirmada", className: "bg-green-100 text-green-800", icon: CheckCircle },
      WAITLIST: { label: "Lista de Espera", className: "bg-orange-100 text-orange-800", icon: List },
      REJECTED: { label: "Recusada", className: "bg-red-100 text-red-800", icon: XCircle },
    }
    const config = statusMap[status] || statusMap.PENDING
    const Icon = config.icon
    return <Badge className={config.className}><Icon className="h-3 w-3 mr-1" />{config.label}</Badge>
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Visão Geral</h1>
        <p className="text-gray-600 mt-1">Bem-vinda de volta, Admin.</p>
      </div>

      {/* Stats Cards - Expandido */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pré-matrículas (Hoje)</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.today}</div>
            <p className="text-xs text-green-600 mt-1">Novas hoje</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pré-matrículas (Semana)</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.week}</div>
            <p className="text-xs text-blue-600 mt-1">Esta semana</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total de Cadastros</CardTitle>
            <Users className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-gray-600 mt-1">Base total acumulada</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
            <BarChart3 className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.conversion}%</div>
            <p className="text-xs text-purple-600 mt-1">{stats.confirmed} confirmadas</p>
          </CardContent>
        </Card>
      </div>

      {/* Status Breakdown */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Pendentes</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-200" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Em Análise</p>
                <p className="text-2xl font-bold text-blue-600">{stats.inAnalysis}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Confirmadas</p>
                <p className="text-2xl font-bold text-green-600">{stats.confirmed}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-200" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Lista de Espera</p>
                <p className="text-2xl font-bold text-orange-600">{stats.waitlist}</p>
              </div>
              <List className="h-8 w-8 text-orange-200" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Recusadas</p>
                <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Enrollments e Activity Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Recent Enrollments */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <CardTitle>Pré-matrículas Recentes</CardTitle>
              </div>
              <Link href="/admin/pre-matriculas">
                <Button variant="ghost" size="sm">Ver todas</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {recentEnrollments.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Nenhuma pré-matrícula recente
              </div>
            ) : (
              <div className="space-y-3">
                {recentEnrollments.map((enrollment) => (
                  <div
                    key={enrollment.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono font-bold text-primary">{enrollment.token}</span>
                        {getStatusBadge(enrollment.status)}
                      </div>
                      <div className="text-sm font-medium">{enrollment.fullName}</div>
                      <div className="text-xs text-gray-500">{enrollment.email}</div>
                      <div className="text-xs text-gray-400 mt-1">
                        {format(new Date(enrollment.createdAt), "d MMM, HH:mm", { locale: ptBR })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity Logs */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              <CardTitle>Atividades Recentes</CardTitle>
            </div>
            <CardDescription>
              Registro de ações importantes do sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentLogs.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Nenhuma atividade registrada ainda
              </div>
            ) : (
              <div className="space-y-3">
                {recentLogs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-start justify-between p-3 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {getActionBadge(log.action)}
                        <span className="text-sm font-medium">{getActionLabel(log.action)}</span>
                      </div>
                      {log.token && (
                        <div className="text-xs text-gray-600 mb-1">
                          Token: <span className="font-mono font-semibold">{log.token}</span>
                        </div>
                      )}
                      {log.details && (
                        <div className="text-xs text-gray-600 mb-1">{log.details}</div>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 ml-2">
                      {format(new Date(log.createdAt), "d MMM, HH:mm", { locale: ptBR })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
