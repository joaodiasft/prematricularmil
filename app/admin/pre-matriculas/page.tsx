"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Download, MoreVertical, Eye, CheckCircle, XCircle, Clock, List } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale/pt-BR"

interface PreEnrollment {
  id: string
  token: string
  fullName: string
  email: string
  age: number | null
  phone: string | null
  whatsapp: string | null
  instagram: string | null
  currentSchool: string | null
  currentGrade: string | null
  studyObjectives: string[]
  writingLevel: string | null
  hasTakenENEM: boolean
  enemScore: number | null
  fatherName: string | null
  fatherPhone: string | null
  motherName: string | null
  motherPhone: string | null
  status: string
  createdAt: string
  confirmationDate: string | null
  confirmationShift: string | null
  confirmationNotes: string | null
  internalNotes: string | null
  class: {
    id: string
    code: string
    name: string
    dayOfWeek: string
    startTime: string
    endTime: string
    subject: {
      name: string
    }
  }
  plan: {
    id: string
    name: string
  }
  paymentMethod: string | null
}

export default function PreMatriculasPage() {
  const { toast } = useToast()
  const [enrollments, setEnrollments] = useState<PreEnrollment[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [selectedEnrollment, setSelectedEnrollment] = useState<PreEnrollment | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [internalNotes, setInternalNotes] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  useEffect(() => {
    fetchEnrollments()
  }, [])

  const fetchEnrollments = async () => {
    try {
      const response = await fetch("/api/admin/pre-enrollments")
      if (!response.ok) {
        throw new Error("Erro ao buscar pré-matrículas")
      }
      const data = await response.json()
      // Remover duplicatas por token - manter apenas a mais recente
      const uniqueMap = new Map()
      const enrollmentsArray = Array.isArray(data) ? data : []
      enrollmentsArray.forEach((enrollment: PreEnrollment) => {
        const existing = uniqueMap.get(enrollment.token)
        if (!existing || new Date(enrollment.createdAt) > new Date(existing.createdAt)) {
          uniqueMap.set(enrollment.token, enrollment)
        }
      })
      setEnrollments(Array.from(uniqueMap.values()))
    } catch (error) {
      console.error("Error fetching enrollments:", error)
      toast({
        title: "Erro",
        description: "Erro ao carregar pré-matrículas",
        variant: "destructive",
      })
      setEnrollments([])
    } finally {
      setLoading(false)
    }
  }

  const handleViewDetails = (enrollment: PreEnrollment) => {
    setSelectedEnrollment(enrollment)
    setInternalNotes(enrollment.internalNotes || "")
    setIsDialogOpen(true)
  }

  const handleStatusChange = async (newStatus: string) => {
    if (!selectedEnrollment) return

    try {
      const response = await fetch(`/api/admin/pre-enrollments/${selectedEnrollment.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
          internalNotes,
        }),
      })

      if (response.ok) {
        toast({
          title: "Status atualizado!",
          description: "O status da pré-matrícula foi atualizado com sucesso",
        })
        fetchEnrollments()
        setIsDialogOpen(false)
      } else {
        throw new Error("Erro ao atualizar")
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar status",
        variant: "destructive",
      })
    }
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

    return (
      <Badge className={config.className}>
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    )
  }

  const getWritingLevelLabel = (level: string | null) => {
    const levels: Record<string, string> = {
      BEGINNER: "Iniciante",
      INTERMEDIATE: "Intermediário",
      ADVANCED: "Avançado",
    }
    return levels[level || ""] || "Não informado"
  }

  const getPaymentMethodLabel = (method: string | null) => {
    const methods: Record<string, string> = {
      CREDIT_CARD: "Cartão de Crédito",
      PIX: "PIX",
      CASH: "Dinheiro",
    }
    return methods[method || ""] || "Não informado"
  }

  const filteredEnrollments = enrollments.filter((enrollment) => {
    const matchesSearch =
      enrollment.fullName.toLowerCase().includes(search.toLowerCase()) ||
      enrollment.email.toLowerCase().includes(search.toLowerCase()) ||
      enrollment.token.toLowerCase().includes(search.toLowerCase()) ||
      enrollment.phone?.toLowerCase().includes(search.toLowerCase()) ||
      enrollment.whatsapp?.toLowerCase().includes(search.toLowerCase())

    const matchesStatus = statusFilter === "all" || enrollment.status === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Pré-Matrículas</h1>
        <p className="text-gray-600 mt-1">
          Gerencie todas as solicitações de matrícula recebidas e agende confirmações.
        </p>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por token, nome, email ou telefone..."
                className="pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="PENDING">Pendente</SelectItem>
                <SelectItem value="IN_ANALYSIS">Em Análise</SelectItem>
                <SelectItem value="CONFIRMED">Confirmada</SelectItem>
                <SelectItem value="WAITLIST">Lista de Espera</SelectItem>
                <SelectItem value="REJECTED">Recusada</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Cards Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Total: {filteredEnrollments.length} pré-matrícula(s)</CardTitle>
          <CardDescription>Clique no card para ver e gerenciar os detalhes de cada cadastro</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Carregando...</div>
          ) : filteredEnrollments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Nenhuma pré-matrícula encontrada
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredEnrollments.map((enrollment) => (
                <Card
                  key={enrollment.id}
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => handleViewDetails(enrollment)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <div className="font-mono font-bold text-lg text-primary">
                        {enrollment.token}
                      </div>
                      {getStatusBadge(enrollment.status)}
                    </div>
                    <CardTitle className="text-lg">{enrollment.fullName}</CardTitle>
                    <CardDescription>{enrollment.email}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {enrollment.age && (
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Idade:</span> {enrollment.age} anos
                      </div>
                    )}
                    {enrollment.whatsapp && (
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">WhatsApp:</span> {enrollment.whatsapp}
                      </div>
                    )}
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Turma:</span> {enrollment.class?.code} - {enrollment.class?.subject?.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Plano:</span> {enrollment.plan?.name}
                    </div>
                    <div className="text-xs text-gray-400 pt-2 border-t">
                      {format(new Date(enrollment.createdAt), "d MMM yyyy 'às' HH:mm", { locale: ptBR })}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-2"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleViewDetails(enrollment)
                      }}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Ver detalhes completos
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog de Detalhes */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalhes da Pré-matrícula - {selectedEnrollment?.token}</DialogTitle>
            <DialogDescription>
              Visualize e gerencie todas as informações do cadastro
            </DialogDescription>
          </DialogHeader>

          {selectedEnrollment && (
            <div className="space-y-6">
              {/* Dados do Aluno */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Dados do Aluno</CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-gray-500">Nome Completo</Label>
                    <div className="font-medium">{selectedEnrollment.fullName}</div>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">E-mail</Label>
                    <div className="font-medium">{selectedEnrollment.email}</div>
                  </div>
                  {selectedEnrollment.age && (
                    <div>
                      <Label className="text-xs text-gray-500">Idade</Label>
                      <div className="font-medium">{selectedEnrollment.age} anos</div>
                    </div>
                  )}
                  {selectedEnrollment.phone && (
                    <div>
                      <Label className="text-xs text-gray-500">Telefone</Label>
                      <div className="font-medium">{selectedEnrollment.phone}</div>
                    </div>
                  )}
                  {selectedEnrollment.whatsapp && (
                    <div>
                      <Label className="text-xs text-gray-500">WhatsApp</Label>
                      <div className="font-medium">{selectedEnrollment.whatsapp}</div>
                    </div>
                  )}
                  {selectedEnrollment.instagram && (
                    <div>
                      <Label className="text-xs text-gray-500">Instagram</Label>
                      <div className="font-medium">{selectedEnrollment.instagram}</div>
                    </div>
                  )}
                  {selectedEnrollment.currentSchool && (
                    <div>
                      <Label className="text-xs text-gray-500">Escola Atual</Label>
                      <div className="font-medium">{selectedEnrollment.currentSchool}</div>
                    </div>
                  )}
                  {selectedEnrollment.currentGrade && (
                    <div>
                      <Label className="text-xs text-gray-500">Série/Ano</Label>
                      <div className="font-medium">{selectedEnrollment.currentGrade}</div>
                    </div>
                  )}
                  <div>
                    <Label className="text-xs text-gray-500">Nível de Redação</Label>
                    <div className="font-medium">{getWritingLevelLabel(selectedEnrollment.writingLevel)}</div>
                  </div>
                  {selectedEnrollment.hasTakenENEM && (
                    <div>
                      <Label className="text-xs text-gray-500">Nota ENEM</Label>
                      <div className="font-medium">
                        {selectedEnrollment.enemScore || "Não informada"}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Dados dos Responsáveis */}
              {(selectedEnrollment.fatherName || selectedEnrollment.motherName) && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Dados dos Responsáveis</CardTitle>
                  </CardHeader>
                  <CardContent className="grid md:grid-cols-2 gap-4">
                    {selectedEnrollment.fatherName && (
                      <>
                        <div>
                          <Label className="text-xs text-gray-500">Nome do Pai</Label>
                          <div className="font-medium">{selectedEnrollment.fatherName}</div>
                        </div>
                        {selectedEnrollment.fatherPhone && (
                          <div>
                            <Label className="text-xs text-gray-500">Telefone do Pai</Label>
                            <div className="font-medium">{selectedEnrollment.fatherPhone}</div>
                          </div>
                        )}
                      </>
                    )}
                    {selectedEnrollment.motherName && (
                      <>
                        <div>
                          <Label className="text-xs text-gray-500">Nome da Mãe</Label>
                          <div className="font-medium">{selectedEnrollment.motherName}</div>
                        </div>
                        {selectedEnrollment.motherPhone && (
                          <div>
                            <Label className="text-xs text-gray-500">Telefone da Mãe</Label>
                            <div className="font-medium">{selectedEnrollment.motherPhone}</div>
                          </div>
                        )}
                      </>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Curso e Plano */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Curso e Plano</CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-gray-500">Turma</Label>
                    <div className="font-medium">
                      {selectedEnrollment.class?.code} - {selectedEnrollment.class?.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {selectedEnrollment.class?.dayOfWeek} - {selectedEnrollment.class?.startTime} às{" "}
                      {selectedEnrollment.class?.endTime}
                    </div>
                    <div className="text-sm text-gray-600">
                      Matéria: {selectedEnrollment.class?.subject?.name}
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Plano</Label>
                    <div className="font-medium">{selectedEnrollment.plan?.name}</div>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Método de Pagamento</Label>
                    <div className="font-medium">
                      {getPaymentMethodLabel(selectedEnrollment.paymentMethod)}
                    </div>
                  </div>
                  {selectedEnrollment.confirmationDate && (
                    <div>
                      <Label className="text-xs text-gray-500">Data de Confirmação</Label>
                      <div className="font-medium">
                        {format(new Date(selectedEnrollment.confirmationDate), "d MMM yyyy 'às' HH:mm", {
                          locale: ptBR,
                        })}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Gerenciamento */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Gerenciamento</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="status">Alterar Status</Label>
                    <Select
                      value={selectedEnrollment.status}
                      onValueChange={handleStatusChange}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PENDING">Pendente</SelectItem>
                        <SelectItem value="IN_ANALYSIS">Em Análise</SelectItem>
                        <SelectItem value="CONFIRMED">Confirmada</SelectItem>
                        <SelectItem value="WAITLIST">Lista de Espera</SelectItem>
                        <SelectItem value="REJECTED">Recusada</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="internalNotes">Observações Internas</Label>
                    <Textarea
                      id="internalNotes"
                      value={internalNotes}
                      onChange={(e) => setInternalNotes(e.target.value)}
                      placeholder="Adicione observações internas sobre este cadastro..."
                      rows={4}
                    />
                  </div>
                  <Button onClick={() => handleStatusChange(selectedEnrollment.status)}>
                    Salvar Alterações
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
