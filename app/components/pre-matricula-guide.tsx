"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  CheckCircle2, 
  ClipboardList, 
  FileText, 
  CreditCard, 
  Calendar, 
  MessageSquare,
  FileCheck,
  X,
  ArrowRight,
  Users
} from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export function PreMatriculaGuide({ onClose, onContinue }: { onClose?: () => void, onContinue: () => void }) {
  const [currentStep, setCurrentStep] = useState(0)

  const steps = [
    {
      icon: ClipboardList,
      title: "Preencha seus Dados",
      description: "Informe seus dados pessoais, série atual, objetivos de estudo e nível de redação. O processo é rápido e simples!",
      details: [
        "Nome completo e dados de contato",
        "Série atual (do 6º ano ao Concurso)",
        "Objetivos (ENEM, Vestibular, Reforço, Concurso)",
        "Nível atual de redação"
      ]
    },
    {
      icon: Users,
      title: "Escolha suas Turmas",
      description: "Selecione as matérias e turmas que deseja cursar. Você pode escolher múltiplos cursos!",
      details: [
        "Redação, Gramática, Matemática ou Exatas",
        "Escolha o horário que melhor se encaixa",
        "Veja a disponibilidade de vagas em tempo real",
        "Selecione por matéria (uma turma por matéria)"
      ]
    },
    {
      icon: CreditCard,
      title: "Selecione seu Plano",
      description: "Escolha quantos módulos deseja cursar e a forma de pagamento. Quanto mais módulos, maior o desconto!",
      details: [
        "Planos de 1 a 5 módulos disponíveis",
        "Descontos progressivos à vista",
        "Taxa de matrícula R$ 100,00",
        "50% de desconto na matrícula ao escolher 2+ cursos"
      ]
    },
    {
      icon: Calendar,
      title: "Agende seu Atendimento",
      description: "Escolha uma data e horário para comparecer presencialmente e assinar o contrato.",
      details: [
        "Datas disponíveis a partir de 06/01/2026",
        "Horários de segunda a sexta-feira",
        "Local: Rua F, R. L-01, Qd.159, Goiânia - GO",
        "Compareça para confirmar sua vaga"
      ]
    },
    {
      icon: FileText,
      title: "Revise e Finalize",
      description: "Revise todas as informações, confirme seus dados e finalize sua pré-matrícula.",
      details: [
        "Verifique todos os dados inseridos",
        "Confira os cursos e planos selecionados",
        "Revise o valor total e descontos",
        "Finalize sua pré-matrícula"
      ]
    },
    {
      icon: CheckCircle2,
      title: "Receba seu Token",
      description: "Ao finalizar sua pré-matrícula, você receberá um token único (ex: R00001) para identificação.",
      details: [
        "Token único e exclusivo gerado automaticamente",
        "Anote ou salve seu token com segurança - você precisará dele!",
        "O token será exibido na tela de confirmação final",
        "⚠️ IMPORTANTE: Guarde este token para as próximas etapas"
      ]
    },
    {
      icon: MessageSquare,
      title: "Confirme seu Token no WhatsApp",
      description: "Entre em contato conosco pelo WhatsApp informando seu token para confirmar sua pré-matrícula.",
      details: [
        "📱 Entre em contato: (62) 98189-9570",
        "✅ Informe seu token de pré-matrícula recebido",
        "📝 Nossa equipe confirmará seus dados e tirará suas dúvidas",
        "⚠️ Esta confirmação é OBRIGATÓRIA para validar sua pré-matrícula"
      ]
    },
    {
      icon: FileCheck,
      title: "Compareça Presencialmente para Assinar o Contrato",
      description: "Após confirmar no WhatsApp, compareça na data agendada para assinar o contrato e confirmar oficialmente sua vaga.",
      details: [
        "📅 Compareça na data e horário que você agendou",
        "📄 Leve: RG (documento de identidade), CPF e comprovante de residência",
        "✍️ Assine o contrato presencialmente na unidade",
        "🎓 Após a assinatura, sua vaga estará CONFIRMADA no curso"
      ]
    }
  ]

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onContinue()
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const currentStepData = steps[currentStep]
  const Icon = currentStepData.icon

  return (
    <Dialog open={true} onOpenChange={() => onClose?.()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold">Como Funciona a Pré-Matrícula</DialogTitle>
            {onClose && (
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          <DialogDescription className="text-base">
            Siga este passo a passo para realizar sua pré-matrícula de forma rápida e simples
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Passo {currentStep + 1} de {steps.length}</span>
              <span>{Math.round(((currentStep + 1) / steps.length) * 100)}% completo</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 w-2 rounded-full transition-all ${
                  index === currentStep
                    ? "bg-primary w-8"
                    : index < currentStep
                    ? "bg-green-500"
                    : "bg-gray-300"
                }`}
              />
            ))}
          </div>

          {/* Current Step Content */}
          <Card className="border-2 border-primary/20">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Icon className="h-8 w-8 text-primary" />
                </div>
              </div>
              <CardTitle className="text-2xl">{currentStepData.title}</CardTitle>
              <CardDescription className="text-base mt-2">
                {currentStepData.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {currentStepData.details.map((detail, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{detail}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Important Notice */}
          {(currentStep === 5 || currentStep === 6 || currentStep === 7) && (
            <Card className={`${currentStep === 5 ? "bg-yellow-50 border-yellow-300" : currentStep === 6 ? "bg-green-50 border-green-300" : "bg-blue-50 border-blue-300"}`}>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className={`h-5 w-5 ${currentStep === 5 ? "text-yellow-600" : currentStep === 6 ? "text-green-600" : "text-blue-600"} mt-0.5 flex-shrink-0`} />
                  <div>
                    <h4 className={`font-bold ${currentStep === 5 ? "text-yellow-900" : currentStep === 6 ? "text-green-900" : "text-blue-900"} mb-2 text-lg`}>
                      {currentStep === 5 && "⚠️ ATENÇÃO: Guarde seu Token!"}
                      {currentStep === 6 && "✅ Confirmação Obrigatória no WhatsApp"}
                      {currentStep === 7 && "📋 Comparecimento Presencial Obrigatório"}
                    </h4>
                    <p className={`text-sm ${currentStep === 5 ? "text-yellow-800" : currentStep === 6 ? "text-green-800" : "text-blue-800"} leading-relaxed`}>
                      {currentStep === 5 && "Seu token é único e necessário para todas as próximas etapas. Anote ou tire um print da tela de confirmação!"}
                      {currentStep === 6 && "Você DEVE confirmar seu token no WhatsApp para validar sua pré-matrícula. Entre em contato pelo (62) 98189-9570."}
                      {currentStep === 7 && "A assinatura presencial do contrato é OBRIGATÓRIA. Sem ela, sua vaga não será confirmada. Compareça na data agendada com seus documentos."}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center gap-4">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0}
            >
              Voltar
            </Button>
            <Button onClick={nextStep} className="flex-1 max-w-xs">
              {currentStep < steps.length - 1 ? (
                <>
                  Próximo Passo
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              ) : (
                "Entendi, Vamos Começar!"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

