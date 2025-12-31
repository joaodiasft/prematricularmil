"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Save } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function EditarDadosPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [enrollment, setEnrollment] = useState<any>(null)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    age: "",
    phone: "",
    whatsapp: "",
    instagram: "",
    currentSchool: "",
    currentGrade: "",
  })

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
        if (data && data.id) {
          setEnrollment(data)
          setFormData({
            fullName: data.fullName || "",
            email: data.email || "",
            age: data.age?.toString() || "",
            phone: data.phone || "",
            whatsapp: data.whatsapp || "",
            instagram: data.instagram || "",
            currentSchool: data.currentSchool || "",
            currentGrade: data.currentGrade || "",
          })
        } else {
          throw new Error("Dados inválidos recebidos")
        }
      } else {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || "Erro ao carregar pré-matrícula")
      }
    } catch (error) {
      console.error("Error fetching enrollment:", error)
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao carregar dados",
        variant: "destructive",
      })
      setEnrollment(null)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!enrollment || !enrollment.id) {
      toast({
        title: "Erro",
        description: "Pré-matrícula não encontrada. Por favor, recarregue a página.",
        variant: "destructive",
      })
      return
    }

    setSaving(true)

    try {
      const response = await fetch("/api/pre-enrollment/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          enrollmentId: enrollment.id,
          fullName: formData.fullName,
          email: formData.email,
          age: formData.age,
          phone: formData.phone,
          whatsapp: formData.whatsapp,
          instagram: formData.instagram,
          currentSchool: formData.currentSchool,
          currentGrade: formData.currentGrade,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Dados atualizados!",
          description: "Suas informações foram salvas com sucesso",
        })
        // Atualizar enrollment local
        setEnrollment({ ...enrollment, ...formData })
        setTimeout(() => {
          router.push("/aluno")
        }, 1000)
      } else {
        throw new Error(data.error || "Erro ao atualizar")
      }
    } catch (error) {
      console.error("Error updating enrollment:", error)
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao salvar dados. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

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
          <Link href="/aluno" className="inline-flex items-center gap-2 text-sm text-gray-600 mb-6 hover:text-primary">
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Link>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Nenhuma pré-matrícula encontrada
                </h2>
                <p className="text-gray-600 mb-6">
                  Você ainda não realizou uma pré-matrícula.
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
        <Link href="/aluno" className="inline-flex items-center gap-2 text-sm text-gray-600 mb-6 hover:text-primary">
          <ArrowLeft className="h-4 w-4" />
          Voltar para área do aluno
        </Link>

        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl">Atualizar Dados Básicos</CardTitle>
              <CardDescription>
                Atualize suas informações pessoais quando necessário
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Nome Completo *</Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="age">Idade</Label>
                    <Input
                      id="age"
                      type="number"
                      min="1"
                      max="100"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone/Celular</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="(62) 99999-9999"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="whatsapp">WhatsApp</Label>
                    <Input
                      id="whatsapp"
                      type="tel"
                      placeholder="(62) 99999-9999"
                      value={formData.whatsapp}
                      onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="instagram">Instagram</Label>
                    <Input
                      id="instagram"
                      type="text"
                      placeholder="@seuinstagram"
                      value={formData.instagram}
                      onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentSchool">Escola Atual</Label>
                    <Input
                      id="currentSchool"
                      value={formData.currentSchool}
                      onChange={(e) => setFormData({ ...formData, currentSchool: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="currentGrade">Série/Ano Atual</Label>
                    <Input
                      id="currentGrade"
                      placeholder="9º ano, 1ª EM, etc."
                      value={formData.currentGrade}
                      onChange={(e) => setFormData({ ...formData, currentGrade: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button type="submit" disabled={saving} className="flex-1">
                    <Save className="mr-2 h-4 w-4" />
                    {saving ? "Salvando..." : "Salvar Alterações"}
                  </Button>
                  <Link href="/aluno">
                    <Button type="button" variant="outline">
                      Cancelar
                    </Button>
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

