"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Phone, ArrowRight, ArrowLeft, Info } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface Step3Props {
  onNext: () => void
  onBack: () => void
}

export default function Step3({ onNext, onBack }: Step3Props) {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    fatherName: "",
    fatherPhone: "",
    motherName: "",
    motherPhone: "",
  })

  useEffect(() => {
    const saved = localStorage.getItem("preMatricula_step3")
    if (saved) {
      setFormData(JSON.parse(saved))
    }
  }, [])

  const handleSave = () => {
    localStorage.setItem("preMatricula_step3", JSON.stringify(formData))
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      handleSave()
    }, 1000)
    return () => clearTimeout(timer)
  }, [formData])

  const handleSkip = () => {
    // Preencher com valores padrão para não deixar vazio no banco
    const defaultData = {
      fatherName: "Não informado",
      fatherPhone: "Não informado",
      motherName: "Não informado",
      motherPhone: "Não informado",
    }
    localStorage.setItem("preMatricula_step3", JSON.stringify(defaultData))
    onNext()
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSave()
    onNext()
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-3xl">Dados dos Responsáveis</CardTitle>
            <CardDescription>
              Preencha os dados abaixo para facilitar nossa comunicação. Esta etapa é opcional.
            </CardDescription>
          </div>
          <Button type="button" variant="ghost" onClick={handleSkip}>
            Pular esta etapa
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-600" />
                  <CardTitle className="text-lg">Dados do Pai</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fatherName">Nome Completo</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="fatherName"
                      placeholder="Ex: João da Silva"
                      className="pl-10"
                      value={formData.fatherName}
                      onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fatherPhone">WhatsApp</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="fatherPhone"
                      type="tel"
                      placeholder="(00) 00000-0000"
                      className="pl-10"
                      value={formData.fatherPhone}
                      onChange={(e) => setFormData({ ...formData, fatherPhone: e.target.value })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-pink-600" />
                  <CardTitle className="text-lg">Dados da Mãe</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="motherName">Nome Completo</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="motherName"
                      placeholder="Ex: Maria da Silva"
                      className="pl-10"
                      value={formData.motherName}
                      onChange={(e) => setFormData({ ...formData, motherName: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="motherPhone">WhatsApp</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="motherPhone"
                      type="tel"
                      placeholder="(00) 00000-0000"
                      className="pl-10"
                      value={formData.motherPhone}
                      onChange={(e) => setFormData({ ...formData, motherPhone: e.target.value })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 flex items-start gap-3">
            <Info className="h-5 w-5 text-primary mt-0.5" />
            <p className="text-sm text-gray-700">
              Caso prefira, você pode pular esta etapa agora e fornecer esses dados posteriormente na área do aluno.
            </p>
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

