"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Check, ArrowRight, ArrowLeft, CreditCard, QrCode, DollarSign } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface Step5Props {
  onNext: () => void
  onBack: () => void
}

interface Plan {
  id: string
  name: string
  type: string
  modules: number
  description: string
}

export default function Step5({ onNext, onBack }: Step5Props) {
  const { toast } = useToast()
  const [selectedPlan, setSelectedPlan] = useState<string>("")
  const [paymentMethod, setPaymentMethod] = useState<string>("")
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedClass, setSelectedClass] = useState<any>(null)

  useEffect(() => {
    fetchPlans()
    const saved = localStorage.getItem("preMatricula_step4")
    if (saved) {
      const data = JSON.parse(saved)
      // Buscar dados da primeira turma selecionada (para calcular preço)
      const selectedClasses = data.selectedClasses || {}
      const firstClassId = Object.values(selectedClasses)[0] as string
      if (firstClassId) {
        fetch(`/api/classes/${firstClassId}`)
          .then((res) => {
            if (!res.ok) throw new Error("Erro ao buscar turma")
            return res.json()
          })
          .then((classData) => setSelectedClass(classData))
          .catch((error) => {
            console.error("Error fetching class:", error)
          })
      }
    }
    const savedStep5 = localStorage.getItem("preMatricula_step5")
    if (savedStep5) {
      const data = JSON.parse(savedStep5)
      setSelectedPlan(data.selectedPlan || "")
      setPaymentMethod(data.paymentMethod || "")
    }
  }, [])

  const fetchPlans = async () => {
    try {
      const response = await fetch("/api/plans")
      if (!response.ok) throw new Error("Erro ao buscar planos")
      const data = await response.json()
      setPlans(data)
    } catch (error) {
      console.error("Error fetching plans:", error)
      toast({
        title: "Erro",
        description: "Erro ao carregar planos",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const calculatePrice = (plan: Plan) => {
    if (!selectedClass) return 0
    const subjectPrice = selectedClass.subject?.price || 0
    return subjectPrice * plan.modules
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedPlan) {
      toast({
        title: "Selecione um plano",
        description: "Por favor, escolha um plano para continuar",
        variant: "destructive",
      })
      return
    }
    if (!paymentMethod) {
      toast({
        title: "Selecione uma forma de pagamento",
        description: "Por favor, escolha como deseja pagar",
        variant: "destructive",
      })
      return
    }
    localStorage.setItem(
      "preMatricula_step5",
      JSON.stringify({ selectedPlan, paymentMethod })
    )
    onNext()
  }

  const planLabels: Record<string, string> = {
    FOCO: "Essencial para começar",
    INTENSIVO: "Mais prática escrita",
    EVOLUCAO: "Equilíbrio ideal",
    APROVACAO_1: "O favorito dos alunos",
    APROVACAO_2: "O favorito dos alunos",
    NOTA_1000: "Acompanhamento VIP",
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-3xl">Escolha seu plano ideal</CardTitle>
        <CardDescription>
          Selecione o pacote que melhor se adapta à sua rotina de estudos e garanta sua vaga.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid md:grid-cols-3 gap-4">
            {loading ? (
              <div className="col-span-3 text-center py-8">Carregando planos...</div>
            ) : (
              plans.map((plan) => {
                const isSelected = selectedPlan === plan.id
                const price = calculatePrice(plan)
                const isPopular = plan.type === "APROVACAO_1"

                return (
                  <Card
                    key={plan.id}
                    className={`cursor-pointer transition-all relative ${
                      isSelected ? "border-primary border-2 bg-primary/5" : "border-gray-200"
                    } ${isPopular ? "border-pink-500" : ""}`}
                    onClick={() => {
                      setSelectedPlan(plan.id)
                      localStorage.setItem(
                        "preMatricula_step5",
                        JSON.stringify({ selectedPlan: plan.id, paymentMethod })
                      )
                    }}
                  >
                    {isPopular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-pink-500 text-white text-xs px-3 py-1 rounded-full">
                        MAIS ESCOLHIDO
                      </div>
                    )}
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{plan.name}</CardTitle>
                          <CardDescription className="mt-1">
                            {planLabels[plan.type] || plan.description}
                          </CardDescription>
                        </div>
                        {isSelected && (
                          <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                            <Check className="h-4 w-4 text-white" />
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-primary mb-2">
                        R$ {price.toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-600 mb-4">
                        {plan.modules} módulo{plan.modules > 1 ? "s" : ""}
                      </div>
                      <div className="space-y-2 text-sm">
                        {plan.modules >= 1 && (
                          <div className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-green-500" />
                            <span>Correções mensais</span>
                          </div>
                        )}
                        {plan.modules >= 2 && (
                          <div className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-green-500" />
                            <span>Aulas gravadas</span>
                          </div>
                        )}
                        {plan.modules >= 3 && (
                          <div className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-green-500" />
                            <span>Plantão de dúvidas</span>
                          </div>
                        )}
                        {plan.modules >= 4 && (
                          <div className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-green-500" />
                            <span>Mentoria em grupo</span>
                          </div>
                        )}
                        {plan.modules >= 9 && (
                          <div className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-green-500" />
                            <span>Mentoria individual</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            )}
          </div>

          <div className="bg-pink-50 border border-pink-200 rounded-lg p-6">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-full bg-pink-500 flex items-center justify-center text-white text-2xl font-bold">
                %
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-2">
                  50% de desconto na taxa de matrícula
                </h3>
                <p className="text-sm text-gray-700">
                  Ao finalizar sua pré-matrícula hoje, você garante isenção de metade da taxa de inscrição inicial.
                </p>
                <Button variant="outline" size="sm" className="mt-4 border-pink-500 text-pink-600">
                  OFERTA LIMITADA
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Forma de Pagamento</h3>
            <RadioGroup
              value={paymentMethod}
              onValueChange={(value) => {
                setPaymentMethod(value)
                localStorage.setItem(
                  "preMatricula_step5",
                  JSON.stringify({ selectedPlan, paymentMethod: value })
                )
              }}
            >
              <div className="grid grid-cols-3 gap-4">
                <label htmlFor="credit" className="cursor-pointer">
                  <Card
                    className={`h-full transition-all ${
                      paymentMethod === "CREDIT_CARD" ? "border-primary border-2 bg-primary/5" : "border-gray-200"
                    }`}
                  >
                    <CardContent className="pt-6">
                      <div className="flex flex-col items-center gap-2">
                        <CreditCard className={`h-8 w-8 ${paymentMethod === "CREDIT_CARD" ? "text-primary" : "text-gray-400"}`} />
                        <Label htmlFor="credit" className="cursor-pointer">Cartão</Label>
                        <RadioGroupItem value="CREDIT_CARD" id="credit" className="mt-2" />
                      </div>
                    </CardContent>
                  </Card>
                </label>

                <label htmlFor="pix" className="cursor-pointer">
                  <Card
                    className={`h-full transition-all ${
                      paymentMethod === "PIX" ? "border-primary border-2 bg-primary/5" : "border-gray-200"
                    }`}
                  >
                    <CardContent className="pt-6">
                      <div className="flex flex-col items-center gap-2">
                        <QrCode className={`h-8 w-8 ${paymentMethod === "PIX" ? "text-primary" : "text-gray-400"}`} />
                        <Label htmlFor="pix" className="cursor-pointer">Pix</Label>
                        <RadioGroupItem value="PIX" id="pix" className="mt-2" />
                      </div>
                    </CardContent>
                  </Card>
                </label>

                <label htmlFor="cash" className="cursor-pointer">
                  <Card
                    className={`h-full transition-all ${
                      paymentMethod === "CASH" ? "border-primary border-2 bg-primary/5" : "border-gray-200"
                    }`}
                  >
                    <CardContent className="pt-6">
                      <div className="flex flex-col items-center gap-2">
                        <DollarSign className={`h-8 w-8 ${paymentMethod === "CASH" ? "text-primary" : "text-gray-400"}`} />
                        <Label htmlFor="cash" className="cursor-pointer">Dinheiro</Label>
                        <RadioGroupItem value="CASH" id="cash" className="mt-2" />
                      </div>
                    </CardContent>
                  </Card>
                </label>
              </div>
            </RadioGroup>
          </div>

          <div className="flex justify-between pt-4">
            <Button type="button" variant="outline" onClick={onBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
            <Button type="submit" size="lg">
              Avançar <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

