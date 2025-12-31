"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { signOut } from "next-auth/react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Calendar, Clock, MapPin, FileText, Download, Mail, MessageCircle, ArrowLeft, LogOut } from "lucide-react"
import { format } from "date-fns"
import ptBR from "date-fns/locale/pt-BR"

interface Step8Props {
  onBack: () => void
}

export default function Step8({ onBack }: Step8Props) {
  const router = useRouter()
  const [enrollmentData, setEnrollmentData] = useState<any>(null)

  useEffect(() => {
    // Buscar dados da pré-matrícula recém-criada
    fetch("/api/pre-enrollment/latest")
      .then((res) => res.json())
      .then((data) => setEnrollmentData(data))
      .catch(console.error)
  }, [])

  if (!enrollmentData) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">Carregando...</div>
        </CardContent>
      </Card>
    )
  }

  const whatsappMessage = `Olá, sou ${enrollmentData.fullName} e acabei de fazer minha pré-matrícula com token ${enrollmentData.token}. Gostaria de confirmar alguns detalhes.`
  const whatsappUrl = `https://wa.me/5562981899570?text=${encodeURIComponent(whatsappMessage)}`

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-4">
          <CheckCircle2 className="h-12 w-12 text-green-600" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Pré-matrícula realizada com sucesso!
        </h1>
        <p className="text-lg text-gray-600">
          Sua vaga está pré-reservada. Confira seu token abaixo e as instruções para garantir sua
          matrícula.
        </p>
      </div>

      {/* Token Card */}
      <Card className="mb-6 border-2 border-primary">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600 mb-1">TOKEN DE ACESSO</div>
              <div className="text-3xl font-bold text-primary mb-2">{enrollmentData.token}</div>
              <div className="text-sm text-gray-600">
                Aluno: {enrollmentData.fullName}
              </div>
              <div className="text-sm text-gray-600">
                Data de Geração: {format(new Date(enrollmentData.createdAt), "dd/MM/yyyy", { locale: ptBR })}
              </div>
            </div>
            <div className="text-right">
              <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold mb-2">
                Aguardando Confirmação
              </div>
              <div className="text-xs text-gray-600 flex items-center gap-1">
                <span className="text-primary">i</span>
                Apresente este token na secretaria da unidade.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Confirmação Presencial */}
        {enrollmentData.confirmationDate && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <CardTitle>Confirmação Presencial</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span>
                  {format(new Date(enrollmentData.confirmationDate), "EEEE, d 'de' MMMM 'de' yyyy", {
                    locale: ptBR,
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-gray-400" />
                <span>
                  {enrollmentData.confirmationShift === "MORNING"
                    ? "08:00 - 12:00"
                    : enrollmentData.confirmationShift === "AFTERNOON"
                    ? "13:00 - 18:00"
                    : "19:00 - 22:00"}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span>Unidade Central - Sala 104</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* O que levar */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <CardTitle>O que levar?</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[
                "Documento de Identidade (RG)",
                "CPF do Aluno e Responsável",
                "Comprovante de Residência",
                "Histórico Escolar Recente",
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Aviso importante */}
      <Card className="mb-6 bg-yellow-50 border-yellow-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <span className="text-yellow-600 font-bold">!</span>
            <p className="text-sm text-gray-700">
              <strong>Importante:</strong> O não comparecimento na data agendada poderá resultar na
              perda da reserva de vaga.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Ações */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <Button size="lg" variant="outline" className="flex-1">
          <Download className="mr-2 h-4 w-4" />
          Baixar Comprovante (PDF)
        </Button>
        <Button size="lg" variant="outline" className="flex-1">
          <Mail className="mr-2 h-4 w-4" />
          Enviar para meu e-mail
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button variant="link" asChild>
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="mr-2 h-4 w-4" />
            Falar no WhatsApp
          </a>
        </Button>
        <Button variant="link" asChild>
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para o início
          </Link>
        </Button>
        <Button 
          variant="outline" 
          onClick={() => signOut({ callbackUrl: "/" })}
          className="border-red-200 text-red-600 hover:bg-red-50"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sair
        </Button>
      </div>
    </div>
  )
}

