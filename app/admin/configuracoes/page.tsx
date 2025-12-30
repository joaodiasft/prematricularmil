"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Palette, MessageSquare, Calendar } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function ConfiguracoesPage() {
  const { toast } = useToast()
  const [config, setConfig] = useState({
    successMessage: "",
    whatsappMessage: "",
    schedulingEnabled: true,
    schedulingStartDate: "",
    maxVacancies: 15,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchConfig()
  }, [])

  const fetchConfig = async () => {
    try {
      const response = await fetch("/api/admin/config")
      const data = await response.json()
      setConfig({
        successMessage: data.success_message || "",
        whatsappMessage: data.whatsapp_message || "",
        schedulingEnabled: data.scheduling_enabled !== false,
        schedulingStartDate: data.scheduling_start_date || "",
        maxVacancies: parseInt(data.max_vacancies || "15"),
      })
    } catch (error) {
      console.error("Error fetching config:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      const response = await fetch("/api/admin/config", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(config),
      })

      if (response.ok) {
        toast({
          title: "Configurações salvas",
          description: "As alterações foram salvas com sucesso",
        })
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao salvar configurações",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return <div className="text-center py-12">Carregando...</div>
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Configurações do Sistema</h1>
        <p className="text-gray-600 mt-1">
          Gerencie textos, datas e identidade visual da pré-matrícula para personalizar a experiência dos alunos.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Identidade Visual */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Palette className="h-5 w-5 text-primary" />
              <CardTitle>Identidade Visual</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Logotipo do Curso</Label>
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                <div className="text-gray-400 mb-2">📷</div>
                <p className="text-sm text-gray-600">Clique para enviar ou arraste</p>
                <p className="text-xs text-gray-500 mt-1">SVG, PNG, JPG (MAX. 2MB)</p>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Cor Principal</Label>
              <div className="flex items-center gap-3">
                <Input
                  type="color"
                  value="#EE2B5B"
                  className="w-20 h-10"
                  readOnly
                />
                <Input
                  type="text"
                  value="#EE2B5B"
                  className="flex-1"
                  readOnly
                />
              </div>
              <p className="text-xs text-gray-500">
                Usada em botões, links e destaques.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Comunicação Automatizada */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              <CardTitle>Comunicação Automatizada</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Orientações Finais (Tela de Sucesso)</Label>
                <Button variant="link" size="sm" className="text-primary">
                  Ver exemplo
                </Button>
              </div>
              <p className="text-xs text-gray-500">
                Este texto aparecerá para o aluno assim que ele completar o cadastro.
              </p>
              <Textarea
                value={config.successMessage}
                onChange={(e) => setConfig({ ...config, successMessage: e.target.value })}
                rows={6}
                placeholder="Parabéns! Sua pré-matrícula foi realizada com sucesso..."
              />
            </div>
            <div className="space-y-2">
              <Label>Mensagem Padrão (WhatsApp)</Label>
              <p className="text-xs text-gray-500">
                Mensagem pré-definida para contato rápido via WhatsApp Web.
              </p>
              <Textarea
                value={config.whatsappMessage}
                onChange={(e) => setConfig({ ...config, whatsappMessage: e.target.value })}
                rows={4}
                placeholder="Olá {nome_aluno}, tudo bem?..."
              />
              <p className="text-xs text-green-600 flex items-center gap-1">
                <span>✓</span> Variáveis disponíveis: {`{nome_aluno}, {protocolo}`}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Agendamento */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            <CardTitle>Agendamento</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Agendamento</Label>
              <p className="text-sm text-gray-500">Ativar/desativar sistema de agendamento</p>
            </div>
            <Switch
              checked={config.schedulingEnabled}
              onCheckedChange={(checked) =>
                setConfig({ ...config, schedulingEnabled: checked })
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Início dos Agendamentos</Label>
              <Input
                type="date"
                value={config.schedulingStartDate}
                onChange={(e) =>
                  setConfig({ ...config, schedulingStartDate: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Limite de Vagas / Horário</Label>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    setConfig({
                      ...config,
                      maxVacancies: Math.max(1, config.maxVacancies - 1),
                    })
                  }
                >
                  -
                </Button>
                <Input
                  type="number"
                  value={config.maxVacancies}
                  onChange={(e) =>
                    setConfig({ ...config, maxVacancies: parseInt(e.target.value) || 1 })
                  }
                  className="text-center"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    setConfig({ ...config, maxVacancies: config.maxVacancies + 1 })
                  }
                >
                  +
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end mt-6">
        <Button size="lg" onClick={handleSave}>
          Salvar Alterações
        </Button>
      </div>
    </div>
  )
}

