"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Check, ArrowRight, ArrowLeft, CreditCard, QrCode, DollarSign, BookOpen, Calendar, Clock, MapPin } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"

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

interface SelectedClass {
  id: string
  code: string
  name: string
  dayOfWeek: string
  startTime: string
  endTime: string
  subject: {
    name: string
    type: string
    price: number
  }
}

export default function Step5({ onNext, onBack }: Step5Props) {
  const { toast } = useToast()
  const [selectedPlan, setSelectedPlan] = useState<string>("")
  const [paymentMethod, setPaymentMethod] = useState<string>("")
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedClasses, setSelectedClasses] = useState<SelectedClass[]>([])

  useEffect(() => {
    fetchPlans()
    const saved = localStorage.getItem("preMatricula_step4")
    if (saved) {
      const data = JSON.parse(saved)
      const selectedClassesObj = data.selectedClasses || {}
      const classIds = Object.values(selectedClassesObj) as string[]
      
      // Buscar detalhes de todas as turmas selecionadas
      Promise.all(
        classIds.map((classId) =>
          fetch(`/api/classes/${classId}`)
            .then((res) => res.json())
            .catch(() => null)
        )
      ).then((classes) => {
        setSelectedClasses(classes.filter(Boolean))
      })
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

  // Calcular preço base (soma de todos os cursos)
  const calculateBasePrice = () => {
    return selectedClasses.reduce((total, classItem) => {
      return total + (classItem.subject?.price || 0)
    }, 0)
  }

  // Calcular desconto por plano
  const getDiscount = (planType: string) => {
    const discounts: Record<string, number> = {
      INTENSIVO: 0.05, // 5%
      EVOLUCAO: 0.08, // 8%
      APROVACAO_1: 0.10, // 10%
      APROVACAO_2: 0.10, // 10%
      NOTA_1000: 0.12, // 12%
    }
    return discounts[planType] || 0
  }

  // Calcular preço final com desconto
  const calculateFinalPrice = (plan: Plan) => {
    const basePrice = calculateBasePrice()
    const discount = getDiscount(plan.type)
    const priceWithModules = basePrice * plan.modules
    return priceWithModules * (1 - discount)
  }

  // Taxa de matrícula
  const getEnrollmentFee = () => {
    const baseFee = 100.00
    // 50% desconto se escolher 2 ou mais cursos
    return selectedClasses.length >= 2 ? baseFee * 0.5 : baseFee
  }

  // Desconto Pix (até dia 10)
  const getPixDiscount = () => {
    const today = new Date()
    if (today.getDate() <= 10 && paymentMethod === "PIX") {
      return 0.05 // 5% desconto adicional
    }
    return 0
  }

  // Calcular total final
  const calculateTotal = (plan: Plan) => {
    const coursePrice = calculateFinalPrice(plan)
    const enrollmentFee = getEnrollmentFee()
    const pixDiscount = getPixDiscount()
    const totalBeforePix = coursePrice + enrollmentFee
    return totalBeforePix * (1 - pixDiscount)
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

  const selectedPlanData = plans.find((p) => p.id === selectedPlan)

  return (
    <div className="space-y-6">
      {/* Resumo dos Cursos Selecionados */}
      {selectedClasses.length > 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Resumo dos Cursos Selecionados
            </CardTitle>
            <CardDescription>
              Você selecionou {selectedClasses.length} curso{selectedClasses.length > 1 ? "s" : ""} presencial{selectedClasses.length > 1 ? "is" : ""}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {selectedClasses.map((classItem) => (
                <div key={classItem.id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                  <div className="flex-1">
                    <div className="font-semibold">{classItem.code} - {classItem.name}</div>
                    <div className="text-sm text-gray-600 mt-1">
                      {classItem.teacher && (
                        <div className="mb-1">
                          <span className="font-medium">Professor(a):</span> {classItem.teacher}
                        </div>
                      )}
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {classItem.dayOfWeek}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {classItem.startTime} às {classItem.endTime}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-primary">R$ {classItem.subject.price.toFixed(2)}</div>
                    <div className="text-xs text-gray-500">por módulo</div>
                  </div>
                </div>
              ))}
              <div className="pt-3 border-t">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Subtotal dos cursos:</span>
                  <span className="font-bold text-lg">R$ {calculateBasePrice().toFixed(2)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">Escolha seu plano ideal</CardTitle>
          <CardDescription>
            Selecione o pacote que melhor se adapta à sua rotina de estudos. <strong>Todos os planos são presenciais.</strong>
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
                  const finalPrice = calculateFinalPrice(plan)
                  const basePrice = calculateBasePrice() * plan.modules
                  const discount = getDiscount(plan.type)
                  const discountAmount = basePrice * discount
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
                        <div className="space-y-2">
                          {discount > 0 && (
                            <div className="text-xs text-gray-500 line-through">
                              R$ {basePrice.toFixed(2)}
                            </div>
                          )}
                          <div className="text-2xl font-bold text-primary">
                            R$ {finalPrice.toFixed(2)}
                          </div>
                          {discount > 0 && (
                            <Badge className="bg-green-100 text-green-800">
                              {Math.round(discount * 100)}% OFF
                            </Badge>
                          )}
                          <div className="text-sm text-gray-600">
                            {plan.modules} módulo{plan.modules > 1 ? "s" : ""}
                          </div>
                        </div>
                        <div className="space-y-2 text-sm mt-4">
                          <div className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-green-500" />
                            <span>Aulas presenciais</span>
                          </div>
                          {plan.modules >= 1 && (
                            <div className="flex items-center gap-2">
                              <Check className="h-4 w-4 text-green-500" />
                              <span>Correções mensais</span>
                            </div>
                          )}
                          {plan.modules >= 2 && (
                            <div className="flex items-center gap-2">
                              <Check className="h-4 w-4 text-green-500" />
                              <span>Material exclusivo</span>
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

            {/* Resumo Financeiro */}
            {selectedPlanData && (
              <Card className="bg-gradient-to-r from-primary/10 to-pink-50 border-primary/20">
                <CardHeader>
                  <CardTitle>Resumo Financeiro</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span>Valor dos cursos ({selectedPlanData.modules} módulo{selectedPlanData.modules > 1 ? "s" : ""}):</span>
                    <span className="font-semibold">R$ {calculateFinalPrice(selectedPlanData).toFixed(2)}</span>
                  </div>
                  {getDiscount(selectedPlanData.type) > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Desconto ({Math.round(getDiscount(selectedPlanData.type) * 100)}%):</span>
                      <span>- R$ {(calculateBasePrice() * selectedPlanData.modules * getDiscount(selectedPlanData.type)).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Taxa de matrícula:</span>
                    <span className="font-semibold">R$ {getEnrollmentFee().toFixed(2)}</span>
                  </div>
                  {selectedClasses.length >= 2 && (
                    <div className="flex justify-between text-green-600">
                      <span>Desconto matrícula (50%):</span>
                      <span>- R$ {50.00.toFixed(2)}</span>
                    </div>
                  )}
                  {paymentMethod === "PIX" && new Date().getDate() <= 10 && (
                    <div className="flex justify-between text-green-600">
                      <span>Desconto Pix (5%):</span>
                      <span>- R$ {((calculateFinalPrice(selectedPlanData) + getEnrollmentFee()) * 0.05).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="pt-3 border-t">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold">Total:</span>
                      <span className="text-2xl font-bold text-primary">R$ {calculateTotal(selectedPlanData).toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Taxa de Matrícula */}
            <div className="bg-pink-50 border border-pink-200 rounded-lg p-6">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-full bg-pink-500 flex items-center justify-center text-white text-2xl font-bold">
                  %
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">
                    Taxa de Matrícula: R$ {getEnrollmentFee().toFixed(2)}
                  </h3>
                  {selectedClasses.length >= 2 ? (
                    <p className="text-sm text-gray-700">
                      🎉 Você ganhou 50% de desconto na taxa de matrícula por escolher 2 ou mais cursos!
                    </p>
                  ) : (
                    <p className="text-sm text-gray-700">
                      Escolha 2 ou mais cursos e ganhe 50% de desconto na taxa de matrícula!
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Forma de Pagamento */}
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
                          <Label htmlFor="credit" className="cursor-pointer">Cartão de Crédito</Label>
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
                          {new Date().getDate() <= 10 && (
                            <Badge className="bg-green-100 text-green-800 text-xs">5% OFF até dia 10</Badge>
                          )}
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
    </div>
  )
}
