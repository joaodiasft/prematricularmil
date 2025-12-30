"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { User, GraduationCap, CreditCard, Calendar, ArrowRight, ArrowLeft, Edit } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { format } from "date-fns"
import ptBR from "date-fns/locale/pt-BR"

interface Step7Props {
  onNext: () => void
  onBack: () => void
}

export default function Step7({ onNext, onBack }: Step7Props) {
  const { toast } = useToast()
  const router = useRouter()
  const [confirmed, setConfirmed] = useState(false)
  const [summary, setSummary] = useState<any>(null)

  useEffect(() => {
    // Carregar todos os dados salvos
    const step2 = JSON.parse(localStorage.getItem("preMatricula_step2") || "{}")
    const step3 = JSON.parse(localStorage.getItem("preMatricula_step3") || "{}")
    const step4 = JSON.parse(localStorage.getItem("preMatricula_step4") || "{}")
    const step5 = JSON.parse(localStorage.getItem("preMatricula_step5") || "{}")
    const step6 = JSON.parse(localStorage.getItem("preMatricula_step6") || "{}")

    // Buscar dados completos
    // Compatibilidade: se não tem selectedClasses, usar selectedClass antigo
    let selectedClasses = step4.selectedClasses || {}
    if (Object.keys(selectedClasses).length === 0 && step4.selectedClass) {
      selectedClasses = { [step4.selectedClass]: step4.selectedClass }
    }
    
    const classIds = Object.values(selectedClasses) as string[]
    
    if (classIds.length > 0 && step5.selectedPlan) {
      Promise.all([
        // Buscar todas as turmas selecionadas
        Promise.all(
          classIds.map((classId) =>
            fetch(`/api/classes/${classId}`)
              .then((res) => {
                if (!res.ok) throw new Error("Erro ao buscar turma")
                return res.json()
              })
          )
        ),
        fetch(`/api/plans/${step5.selectedPlan}`)
          .then((res) => {
            if (!res.ok) throw new Error("Erro ao buscar plano")
            return res.json()
          }),
      ])
        .then(([classesData, planData]) => {
          setSummary({
            student: step2,
            parents: step3,
            classes: classesData, // Array de turmas
            plan: planData,
            payment: step5,
            schedule: step6,
          })
        })
        .catch((error) => {
          console.error("Error fetching data:", error)
          toast({
            title: "Erro",
            description: "Erro ao carregar dados",
            variant: "destructive",
          })
        })
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!confirmed) {
      toast({
        title: "Confirmação necessária",
        description: "Por favor, confirme que as informações estão corretas",
        variant: "destructive",
      })
      return
    }

    // Salvar pré-matrícula
    try {
      const response = await fetch("/api/pre-enrollment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          step2: JSON.parse(localStorage.getItem("preMatricula_step2") || "{}"),
          step3: JSON.parse(localStorage.getItem("preMatricula_step3") || "{}"),
          step4: (() => {
            const step4Data = JSON.parse(localStorage.getItem("preMatricula_step4") || "{}")
            // Garantir que selectedClasses existe
            if (!step4Data.selectedClasses || Object.keys(step4Data.selectedClasses).length === 0) {
              if (step4Data.selectedClass) {
                step4Data.selectedClasses = { [step4Data.selectedClass]: step4Data.selectedClass }
              }
            }
            return step4Data
          })(),
          step5: JSON.parse(localStorage.getItem("preMatricula_step5") || "{}"),
          step6: JSON.parse(localStorage.getItem("preMatricula_step6") || "{}"),
        }),
      })

      if (!response.ok) {
        throw new Error("Erro ao salvar pré-matrícula")
      }

      // Limpar localStorage
      localStorage.removeItem("preMatricula_step2")
      localStorage.removeItem("preMatricula_step3")
      localStorage.removeItem("preMatricula_step4")
      localStorage.removeItem("preMatricula_step5")
      localStorage.removeItem("preMatricula_step6")

      onNext()
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao finalizar pré-matrícula",
        variant: "destructive",
      })
    }
  }

  if (!summary) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">Carregando dados...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-3xl">Confira seus dados</CardTitle>
        <CardDescription>
          Por favor, revise as informações abaixo antes de finalizar sua pré-matrícula.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Dados do Aluno */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  <CardTitle>Dados do Aluno</CardTitle>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push("/pre-matricula?step=2")}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <span className="text-sm font-semibold">NOME COMPLETO:</span>{" "}
                {summary.student.fullName}
              </div>
              <div>
                <span className="text-sm font-semibold">E-MAIL:</span> {summary.student.email}
              </div>
              {summary.student.phone && (
                <div>
                  <span className="text-sm font-semibold">CELULAR:</span> {summary.student.phone}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Curso e Turma */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  <CardTitle>Curso e Turma</CardTitle>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push("/pre-matricula?step=4")}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {Array.isArray(summary.classes) && summary.classes.length > 0 ? (
                summary.classes.map((classItem: any, index: number) => (
                  <div key={classItem.id} className={index > 0 ? "pt-3 border-t" : ""}>
                    <div>
                      <span className="text-sm font-semibold">TURMA {index + 1}:</span> {classItem.code} -{" "}
                      {classItem.name}
                    </div>
                    <div>
                      <span className="text-sm font-semibold">HORÁRIO:</span> {classItem.dayOfWeek}{" "}
                      - {classItem.startTime} às {classItem.endTime}
                    </div>
                    <div>
                      <span className="text-sm font-semibold">MATÉRIA:</span> {classItem.subject?.name}
                    </div>
                  </div>
                ))
              ) : summary.class ? (
                <>
                  <div>
                    <span className="text-sm font-semibold">TURMA:</span> {summary.class?.code} -{" "}
                    {summary.class?.name}
                  </div>
                  <div>
                    <span className="text-sm font-semibold">HORÁRIO:</span> {summary.class?.dayOfWeek}{" "}
                    - {summary.class?.startTime} às {summary.class?.endTime}
                  </div>
                </>
              ) : (
                <div className="text-sm text-gray-500">Nenhuma turma selecionada</div>
              )}
            </CardContent>
          </Card>

          {/* Plano e Pagamento */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                  <CardTitle>Plano e Pagamento</CardTitle>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push("/pre-matricula?step=5")}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <span className="text-sm font-semibold">PLANO:</span> {summary.plan?.name}
              </div>
              <div>
                <span className="text-sm font-semibold">FORMA DE PAGAMENTO:</span>{" "}
                {summary.payment.paymentMethod === "CREDIT_CARD"
                  ? "Cartão de Crédito"
                  : summary.payment.paymentMethod === "PIX"
                  ? "Pix"
                  : "Dinheiro"}
              </div>
            </CardContent>
          </Card>

          {/* Confirmação Presencial */}
          {summary.schedule.selectedDate && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    <CardTitle>Confirmação Presencial</CardTitle>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push("/pre-matricula?step=6")}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <span className="text-sm font-semibold">DATA:</span>{" "}
                  {format(new Date(summary.schedule.selectedDate), "EEEE, d 'de' MMMM 'de' yyyy", {
                    locale: ptBR,
                  })}
                </div>
                <div>
                  <span className="text-sm font-semibold">TURNO:</span>{" "}
                  {summary.schedule.selectedShift === "MORNING"
                    ? "Manhã"
                    : summary.schedule.selectedShift === "AFTERNOON"
                    ? "Tarde"
                    : "Noite"}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex items-start space-x-2 pt-4 border-t">
            <Checkbox
              id="confirm"
              checked={confirmed}
              onCheckedChange={(checked) => setConfirmed(checked as boolean)}
            />
            <Label htmlFor="confirm" className="cursor-pointer">
              Li e confirmo que todas as informações acima estão corretas e concordo com os
              termos da pré-matrícula.
            </Label>
          </div>

          <div className="flex justify-between pt-4">
            <Button type="button" variant="outline" onClick={onBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
            <Button type="submit" size="lg" disabled={!confirmed}>
              Confirmar Pré-matrícula <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

