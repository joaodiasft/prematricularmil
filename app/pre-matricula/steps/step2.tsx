"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, Mail, Phone, Instagram, GraduationCap, Target, BarChart, ArrowRight } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface Step2Props {
  onNext: () => void
}

export default function Step2({ onNext }: Step2Props) {
  const { data: session } = useSession()
  const { toast } = useToast()
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    email: session?.user?.email || "",
    age: "",
    phone: "",
    whatsapp: "",
    instagram: "",
    currentSchool: "",
    currentGrade: "",
    studyObjectives: [] as string[],
    writingLevel: "",
    hasTakenENEM: "",
    enemScore: "",
  })

  useEffect(() => {
    // Carregar dados salvos
    const saved = localStorage.getItem("preMatricula_step2")
    if (saved) {
      setFormData(JSON.parse(saved))
    }
  }, [])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      localStorage.setItem("preMatricula_step2", JSON.stringify(formData))
      toast({
        title: "Salvo automaticamente",
        description: "Seus dados foram salvos",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao salvar dados",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      handleSave()
    }, 1000)
    return () => clearTimeout(timer)
  }, [formData])

  const handleObjectiveChange = (objective: string, checked: boolean) => {
    if (checked) {
      setFormData({
        ...formData,
        studyObjectives: [...formData.studyObjectives, objective],
      })
    } else {
      setFormData({
        ...formData,
        studyObjectives: formData.studyObjectives.filter((o) => o !== objective),
      })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.fullName || !formData.email) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha pelo menos nome e email",
        variant: "destructive",
      })
      return
    }
    handleSave()
    onNext()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-3xl">Dados Básicos</CardTitle>
        <CardDescription>
          Conte um pouco sobre você. Queremos personalizar sua jornada de aprendizado para garantir sua nota 1000.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Nome completo</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="fullName"
                  placeholder="Seu nome"
                  className="pl-10"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  className="pl-10"
                  disabled
                />
                <span className="absolute right-3 top-3 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                  Confirmado
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age">Idade</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="Ex: 17"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="(00) 00000-0000"
                    className="pl-10"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="whatsapp">WhatsApp</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="whatsapp"
                    type="tel"
                    placeholder="(00) 00000-0000"
                    className="pl-10"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="instagram">Instagram</Label>
                <div className="relative">
                  <Instagram className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="instagram"
                    placeholder="@seuinstagram"
                    className="pl-10"
                    value={formData.instagram}
                    onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="currentSchool">Onde estuda atualmente?</Label>
              <div className="relative">
                <GraduationCap className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="currentSchool"
                  placeholder="Ex: Colégio Estadual Central"
                  className="pl-10"
                  value={formData.currentSchool}
                  onChange={(e) => setFormData({ ...formData, currentSchool: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="currentGrade">Série atual</Label>
              <Select
                value={formData.currentGrade}
                onValueChange={(value) => setFormData({ ...formData, currentGrade: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione sua série" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6ef">6º ano do Ensino Fundamental</SelectItem>
                  <SelectItem value="7ef">7º ano do Ensino Fundamental</SelectItem>
                  <SelectItem value="8ef">8º ano do Ensino Fundamental</SelectItem>
                  <SelectItem value="9ef">9º ano do Ensino Fundamental</SelectItem>
                  <SelectItem value="1em">1ª série do Ensino Médio</SelectItem>
                  <SelectItem value="2em">2ª série do Ensino Médio</SelectItem>
                  <SelectItem value="3em">3ª série do Ensino Médio</SelectItem>
                  <SelectItem value="vestibular">Vestibular</SelectItem>
                  <SelectItem value="concurso">Concurso</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Objetivo de estudo</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: "ENEM", label: "Melhorar nota no ENEM" },
                { value: "MEDICINA", label: "Passar em Medicina" },
                { value: "CONCURSOS", label: "Concursos Públicos" },
                { value: "REFORCO", label: "Reforço Escolar" },
              ].map((obj) => (
                <div key={obj.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={obj.value}
                    checked={formData.studyObjectives.includes(obj.value)}
                    onCheckedChange={(checked) =>
                      handleObjectiveChange(obj.value, checked as boolean)
                    }
                  />
                  <Label htmlFor={obj.value} className="cursor-pointer">
                    {obj.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <BarChart className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Nível em redação</h3>
            </div>
            <p className="text-sm text-gray-600">
              Não se preocupe, isso é só para sabermos por onde começar!
            </p>
            <RadioGroup
              value={formData.writingLevel}
              onValueChange={(value) => setFormData({ ...formData, writingLevel: value })}
            >
              <div className="grid gap-4">
                {[
                  {
                    value: "BEGINNER",
                    label: "Iniciante",
                    description: "Nunca escrevi ou tenho muita dificuldade",
                  },
                  {
                    value: "INTERMEDIATE",
                    label: "Intermediário",
                    description: "Escrevo, mas travo na estrutura",
                  },
                  {
                    value: "ADVANCED",
                    label: "Avançado",
                    description: "Busco apenas lapidar detalhes",
                  },
                ].map((level) => (
                  <div
                    key={level.value}
                    className={`flex items-start space-x-3 p-4 border rounded-lg cursor-pointer ${
                      formData.writingLevel === level.value
                        ? "border-primary bg-primary/5"
                        : "border-gray-200"
                    }`}
                    onClick={() => setFormData({ ...formData, writingLevel: level.value })}
                  >
                    <RadioGroupItem value={level.value} id={level.value} />
                    <div className="flex-1">
                      <Label htmlFor={level.value} className="font-semibold cursor-pointer">
                        {level.label}
                      </Label>
                      <p className="text-sm text-gray-600 mt-1">{level.description}</p>
                    </div>
                    {formData.writingLevel === level.value && (
                      <div className="text-primary">✓</div>
                    )}
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Já fez o ENEM antes?</h3>
            <p className="text-sm text-gray-600">Se sim, conte-nos sua última nota.</p>
            <RadioGroup
              value={formData.hasTakenENEM}
              onValueChange={(value) => setFormData({ ...formData, hasTakenENEM: value })}
            >
              <div className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="yes" />
                  <Label htmlFor="yes">Sim</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="no" />
                  <Label htmlFor="no">Não</Label>
                </div>
              </div>
            </RadioGroup>

            {formData.hasTakenENEM === "yes" && (
              <div className="space-y-2">
                <Label htmlFor="enemScore">Qual foi sua nota na redação?</Label>
                <Input
                  id="enemScore"
                  type="number"
                  placeholder="0 a 1000pts"
                  value={formData.enemScore}
                  onChange={(e) => setFormData({ ...formData, enemScore: e.target.value })}
                />
              </div>
            )}
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit" size="lg">
              Avançar <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

