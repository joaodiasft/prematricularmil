"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { 
  GraduationCap, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  Hourglass, 
  XCircle, 
  List,
  MessageCircle,
  Edit,
  ArrowLeft,
  Copy
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale/pt-BR"

export default function AlunoPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [enrollment, setEnrollment] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login")
    } else if (status === "authenticated") {
      fetchEnrollment()
    }
  }, [status, router])

  const fetchEnrollment = async () => {
    try {
      const response = await fetch("/api/pre-enrollment/latest")
      if (response.ok) {
        const data = await response.json()
        setEnrollment(data)
      }
    } catch (error) {
      console.error("Error fetching enrollment:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; variant: string; icon: any }> = {
      PENDING: {
        label: "Pendente",
        variant: "bg-yellow-100 text-yellow-800",
        icon: Hourglass,
      },
      IN_ANALYSIS: {
        label: "Em Análise",
        variant: "bg-blue-100 text-blue-800",
        icon: Clock,
      },
      CONFIRMED: {
        label: "Confirmada",
        variant: "bg-green-100 text-green-800",
        icon: CheckCircle2,
      },
      WAITLIST: {
        label: "Lista de Espera",
        variant: "bg-orange-100 text-orange-800",
        icon: List,
      },
      REJECTED: {
        label: "Recusada",
        variant: "bg-red-100 text-red-800",
        icon: XCircle,
      },
    }

    const config = statusConfig[status] || statusConfig.PENDING
    const Icon = config.icon

    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${config.variant}`}>
        <Icon className="h-4 w-4" />
        {config.label}
      </div>
    )
  }

  const copyToken = () => {
    if (enrollment?.token) {
      navigator.clipboard.writeText(enrollment.token)
      toast({
        title: "Token copiado!",
        description: "O token foi copiado para a área de transferência",
      })
    }
  }

  const whatsappMessage = `Olá, sou ${enrollment?.fullName} e gostaria de falar sobre minha pré-matrícula com token ${enrollment?.token}.`
  const whatsappUrl = `https://wa.me/5562981899570?text=${encodeURIComponent(whatsappMessage)}`

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!enrollment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-white">
        <div className="container mx-auto px-4 py-8">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-600 mb-6 hover:text-primary">
            <ArrowLeft className="h-4 w-4" />
            Voltar para página inicial
          </Link>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <GraduationCap className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Nenhuma pré-matrícula encontrada
                </h2>
                <p className="text-gray-600 mb-6">
                  Você ainda não realizou uma pré-matrícula. Comece agora!
                </p>
                <Link href="/pre-matricula">
                  <Button size="lg">Iniciar Pré-matrícula</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-600 mb-6 hover:text-primary">
          <ArrowLeft className="h-4 w-4" />
          Voltar para página inicial
        </Link>

        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Olá, {enrollment.fullName.split(" ")[0]}
            </h1>
            <p className="text-gray-600">
              Acompanhe o progresso da sua pré-matrícula abaixo.
            </p>
          </div>

          {/* Status Card */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  <CardTitle>Status Atual</CardTitle>
                </div>
                {getStatusBadge(enrollment.status)}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-6">
                {enrollment.status === "PENDING" &&
                  "Sua pré-matrícula foi enviada e está aguardando análise."}
                {enrollment.status === "IN_ANALYSIS" &&
                  "Estamos validando a documentação enviada. Fique atento, o resultado sairá em breve."}
                {enrollment.status === "CONFIRMED" &&
                  "Parabéns! Sua matrícula foi confirmada."}
                {enrollment.status === "WAITLIST" &&
                  "Você está na lista de espera. Entraremos em contato quando houver vaga disponível."}
                {enrollment.status === "REJECTED" &&
                  "Sua pré-matrícula foi recusada. Entre em contato para mais informações."}
              </p>

              {/* Timeline */}
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold">Cadastro Enviado</div>
                    <div className="text-sm text-gray-600">
                      {format(new Date(enrollment.createdAt), "d MMM, HH:mm", { locale: ptBR })}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div
                    className={`h-8 w-8 rounded-full flex items-center justify-center ${
                      enrollment.status === "IN_ANALYSIS" ||
                      enrollment.status === "CONFIRMED" ||
                      enrollment.status === "WAITLIST"
                        ? "bg-primary"
                        : "bg-gray-200"
                    }`}
                  >
                    {enrollment.status === "IN_ANALYSIS" ||
                    enrollment.status === "CONFIRMED" ||
                    enrollment.status === "WAITLIST" ? (
                      <CheckCircle2 className="h-5 w-5 text-white" />
                    ) : (
                      <Clock className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold">Análise de Documentos</div>
                    <div className="text-sm text-gray-600">
                      {enrollment.status === "IN_ANALYSIS"
                        ? "Em andamento"
                        : enrollment.status === "PENDING"
                        ? "Aguardando aprovação"
                        : "Concluído"}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div
                    className={`h-8 w-8 rounded-full flex items-center justify-center ${
                      enrollment.status === "CONFIRMED" ? "bg-primary" : "bg-gray-200"
                    }`}
                  >
                    {enrollment.status === "CONFIRMED" ? (
                      <CheckCircle2 className="h-5 w-5 text-white" />
                    ) : (
                      <Calendar className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold">Confirmação Presencial</div>
                    <div className="text-sm text-gray-600">
                      {enrollment.status === "CONFIRMED"
                        ? "Confirmado"
                        : "Aguardando aprovação"}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detalhes da Inscrição */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Detalhes da Inscrição</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm text-gray-600 mb-1">TOKEN DE INSCRIÇÃO</div>
                <div className="flex items-center gap-2">
                  <div className="px-4 py-2 bg-gray-100 rounded-lg border border-primary font-mono text-lg font-bold text-primary">
                    {enrollment.token}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={copyToken}
                    className="h-8 w-8 p-0"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <GraduationCap className="h-5 w-5 text-gray-400" />
                <div>
                  <div className="text-sm text-gray-600">Turma Selecionada</div>
                  <div className="font-semibold">
                    {enrollment.class?.code} - {enrollment.class?.name}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-gray-400" />
                <div>
                  <div className="text-sm text-gray-600">Plano Escolhido</div>
                  <div className="font-semibold">{enrollment.plan?.name}</div>
                </div>
              </div>

              {enrollment.confirmationDate && (
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-600">Confirmação Presencial</div>
                    <div className="font-semibold">
                      {format(new Date(enrollment.confirmationDate), "d MMM, 'às' HH:mm", {
                        locale: ptBR,
                      })}
                    </div>
                    <div className="text-sm text-gray-600">
                      Unidade Centro - Sala 304
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Ações */}
          <div className="flex gap-4">
            <Button variant="outline" className="flex-1" asChild>
              <Link href="/aluno/editar">
                <Edit className="mr-2 h-4 w-4" />
                Atualizar dados básicos
              </Link>
            </Button>
            <Button className="flex-1" asChild>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="mr-2 h-4 w-4" />
                Falar no WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

