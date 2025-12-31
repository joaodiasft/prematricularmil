"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Calendar, Clock, MapPin, AlertCircle, Check, ArrowRight, ArrowLeft, Sun, Moon, FileText } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { format, addDays } from "date-fns"
import ptBR from "date-fns/locale/pt-BR"

interface Step6Props {
  onNext: () => void
  onBack: () => void
}

export default function Step6({ onNext, onBack }: Step6Props) {
  const { toast } = useToast()
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedShift, setSelectedShift] = useState<string>("")
  const [notes, setNotes] = useState("")
  const [availableDates, setAvailableDates] = useState<Date[]>([])

  useEffect(() => {
    // Gerar datas disponíveis a partir de 06/01/2026
    const startDate = new Date(2026, 0, 6)
    const dates: Date[] = []
    for (let i = 0; i < 30; i++) {
      const date = addDays(startDate, i)
      // Apenas dias úteis (segunda a sexta)
      if (date.getDay() !== 0 && date.getDay() !== 6) {
        dates.push(date)
      }
    }
    setAvailableDates(dates)

    const saved = localStorage.getItem("preMatricula_step6")
    if (saved) {
      const data = JSON.parse(saved)
      setSelectedDate(data.selectedDate ? new Date(data.selectedDate) : null)
      setSelectedShift(data.selectedShift || "")
      setNotes(data.notes || "")
    }
  }, [])

  const handleSave = () => {
    localStorage.setItem(
      "preMatricula_step6",
      JSON.stringify({
        selectedDate: selectedDate?.toISOString(),
        selectedShift,
        notes,
      })
    )
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      handleSave()
    }, 1000)
    return () => clearTimeout(timer)
  }, [selectedDate, selectedShift, notes])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedDate) {
      toast({
        title: "Selecione uma data",
        description: "Por favor, escolha uma data para confirmação",
        variant: "destructive",
      })
      return
    }
    if (!selectedShift) {
      toast({
        title: "Selecione um turno",
        description: "Por favor, escolha o turno preferencial",
        variant: "destructive",
      })
      return
    }
    handleSave()
    onNext()
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">Agendamento Presencial</CardTitle>
          <CardDescription>
            Agende sua visita para finalizar a matrícula e assinar o contrato presencialmente
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <Label className="text-base font-semibold">Selecione uma data *</Label>
              <div className="grid grid-cols-7 gap-2 max-h-64 overflow-y-auto p-2 border rounded-lg">
                {availableDates.map((date) => {
                  const isSelected = selectedDate?.getTime() === date.getTime()
                  return (
                    <button
                      key={date.toISOString()}
                      type="button"
                      onClick={() => setSelectedDate(date)}
                      className={`p-3 rounded-lg border text-sm transition-all hover:scale-105 ${
                        isSelected
                          ? "bg-primary text-white border-primary shadow-lg"
                          : "border-gray-200 hover:border-primary hover:bg-primary/5"
                      }`}
                    >
                      <div className="font-semibold">{format(date, "d", { locale: ptBR })}</div>
                      <div className="text-xs opacity-70">
                        {format(date, "MMM", { locale: ptBR })}
                      </div>
                    </button>
                  )
                })}
              </div>
              {selectedDate && (
                <div className="flex items-center gap-2 text-sm text-primary font-medium">
                  <Calendar className="h-4 w-4" />
                  <span>Data selecionada: {format(selectedDate, "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR })}</span>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <Label className="text-base font-semibold">Turno de preferência *</Label>
              <RadioGroup
                value={selectedShift}
                onValueChange={setSelectedShift}
              >
                <div className="grid gap-4">
                  {[
                    { value: "MORNING", label: "Manhã", time: "08:00 - 12:00", icon: Sun },
                    { value: "AFTERNOON", label: "Tarde", time: "13:00 - 18:00", icon: Sun },
                    { value: "NIGHT", label: "Noite", time: "19:00 - 22:00", icon: Moon },
                  ].map((shift) => {
                    const Icon = shift.icon
                    const isSelected = selectedShift === shift.value
                    return (
                      <label key={shift.value} htmlFor={shift.value} className="cursor-pointer">
                        <Card
                          className={`transition-all ${
                            isSelected ? "border-primary border-2 bg-primary/5" : "border-gray-200 hover:border-primary/50"
                          }`}
                        >
                          <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <Icon className={`h-5 w-5 ${isSelected ? "text-primary" : "text-gray-400"}`} />
                                <div>
                                  <div className="font-semibold">{shift.label}</div>
                                  <div className="text-sm text-gray-600">{shift.time}</div>
                                </div>
                              </div>
                              <RadioGroupItem value={shift.value} id={shift.value} />
                            </div>
                          </CardContent>
                        </Card>
                      </label>
                    )
                  })}
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Observações (Opcional)</Label>
              <Textarea
                id="notes"
                placeholder="Tem alguma necessidade especial ou dúvida para o atendimento?"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
              />
            </div>

            <div className="flex justify-between pt-4">
              <Button type="button" variant="outline" onClick={onBack}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
              </Button>
              <Button type="submit" size="lg">
                Confirmar Agendamento <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-pink-50 border-pink-200">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-primary" />
              <CardTitle>Documentos Necessários</CardTitle>
            </div>
            <CardDescription>
              Para agilizar sua matrícula presencial, certifique-se de trazer os documentos abaixo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                "RG e CPF do aluno (Original e Cópia)",
                "Comprovante de residência atualizado",
                "1 Foto 3x4 recente",
                "RG do responsável (caso menor de 18)",
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <CardTitle>Assinatura de Contrato</CardTitle>
            </div>
            <CardDescription>
              Informações importantes sobre o processo de matrícula
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="h-4 w-4 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-sm mb-1">Contrato Presencial</div>
                  <div className="text-sm text-gray-700">
                    Você precisará assinar o contrato de prestação de serviços no momento da confirmação presencial.
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="h-4 w-4 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-sm mb-1">Localização</div>
                  <div className="text-sm text-gray-700">
                    Rua F, R. L-01, Qd.159, Goiânia - GO, 74475-060
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="h-4 w-4 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-sm mb-1">Duração</div>
                  <div className="text-sm text-gray-700">
                    O processo de matrícula e assinatura leva aproximadamente 30 minutos.
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
