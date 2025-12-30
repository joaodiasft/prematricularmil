"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Lock, AlertTriangle, CheckCircle, Clock } from "lucide-react"
import { format } from "date-fns"
import ptBR from "date-fns/locale/pt-BR"

interface PasswordResetAttempt {
  id: string
  token: string
  attempts: number
  lastAttempt: string | null
  createdAt: string
  updatedAt: string
}

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

export default function RecuperacaoSenhaPage() {
  const [resetAttempts, setResetAttempts] = useState<PasswordResetAttempt[]>([])
  const [actionLogs, setActionLogs] = useState<ActionLog[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [attemptsRes, logsRes] = await Promise.all([
        fetch("/api/admin/password-reset-attempts"),
        fetch("/api/admin/action-logs?action=PASSWORD_RESET_BY_TOKEN"),
      ])

      if (attemptsRes.ok) {
        const attemptsData = await attemptsRes.json()
        setResetAttempts(Array.isArray(attemptsData) ? attemptsData : [])
      }

      if (logsRes.ok) {
        const logsData = await logsRes.json()
        setActionLogs(Array.isArray(logsData) ? logsData : [])
      }
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredAttempts = resetAttempts.filter((attempt) =>
    attempt.token.toLowerCase().includes(search.toLowerCase())
  )

  const getAttemptsBadge = (attempts: number) => {
    if (attempts >= 2) {
      return <Badge className="bg-red-100 text-red-800">Limite Atingido</Badge>
    }
    if (attempts === 1) {
      return <Badge className="bg-yellow-100 text-yellow-800">1 tentativa</Badge>
    }
    return <Badge className="bg-green-100 text-green-800">Disponível</Badge>
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Recuperação de Senha por Token</h1>
        <p className="text-gray-600 mt-1">
          Monitore todas as tentativas de recuperação de senha usando tokens de pré-matrícula
        </p>
      </div>

      {/* Search */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por token..."
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Reset Attempts */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Tentativas de Recuperação</CardTitle>
          <CardDescription>
            Tokens que foram usados para recuperação de senha (máximo 2 tentativas por token)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Carregando...</div>
          ) : filteredAttempts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Nenhuma tentativa de recuperação encontrada
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAttempts.map((attempt) => (
                <Card key={attempt.id} className="border-l-4 border-l-primary">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="font-mono font-bold text-xl text-primary">
                        {attempt.token}
                      </div>
                      {getAttemptsBadge(attempt.attempts)}
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Tentativas:</span>
                        <span className="font-semibold">{attempt.attempts} / 2</span>
                      </div>
                      {attempt.lastAttempt && (
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Última tentativa:</span>
                          <span className="text-xs">
                            {format(new Date(attempt.lastAttempt), "d MMM, HH:mm", { locale: ptBR })}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Criado em:</span>
                        <span className="text-xs">
                          {format(new Date(attempt.createdAt), "d MMM yyyy", { locale: ptBR })}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Logs */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Ações</CardTitle>
          <CardDescription>
            Registro detalhado de todas as tentativas de recuperação de senha
          </CardDescription>
        </CardHeader>
        <CardContent>
          {actionLogs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Nenhuma ação registrada ainda
            </div>
          ) : (
            <div className="space-y-3">
              {actionLogs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-start justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Lock className="h-4 w-4 text-orange-500" />
                      <span className="font-medium">Reset de Senha por Token</span>
                      {log.token && (
                        <span className="font-mono font-semibold text-primary">{log.token}</span>
                      )}
                    </div>
                    {log.details && (
                      <div className="text-sm text-gray-600 mb-1">{log.details}</div>
                    )}
                    {log.user && (
                      <div className="text-xs text-gray-500">
                        Usuário: {log.user.name || log.user.email}
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 ml-4">
                    {format(new Date(log.createdAt), "d MMM, HH:mm", { locale: ptBR })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

