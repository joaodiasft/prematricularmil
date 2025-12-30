"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { GraduationCap, ArrowLeft, Copy, Check } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function ForgotPasswordPage() {
  const { toast } = useToast()
  const [token, setToken] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [newPassword, setNewPassword] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: token.trim().toUpperCase() }),
      })

      const data = await response.json()

      if (response.ok) {
        setNewPassword(data.password)
        setShowPasswordModal(true)
        
        // Fechar modal após 5 segundos
        setTimeout(() => {
          setShowPasswordModal(false)
          setToken("")
          setNewPassword("")
        }, 5000)
      } else {
        toast({
          title: "Erro",
          description: data.error || "Token inválido ou limite de tentativas excedido",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao processar a solicitação",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const copyPassword = () => {
    if (newPassword) {
      navigator.clipboard.writeText(newPassword)
      toast({
        title: "Senha copiada!",
        description: "A senha foi copiada para a área de transferência",
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link href="/auth/login" className="inline-flex items-center gap-2 text-sm text-gray-600 mb-6 hover:text-primary">
          <ArrowLeft className="h-4 w-4" />
          Voltar para login
        </Link>

        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <GraduationCap className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="text-2xl">Esqueci minha senha</CardTitle>
            <CardDescription>
              Digite o token da sua pré-matrícula para gerar uma nova senha
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="token">Token da Pré-matrícula</Label>
                <Input
                  id="token"
                  type="text"
                  placeholder="R00001"
                  className="uppercase font-mono"
                  value={token}
                  onChange={(e) => setToken(e.target.value.toUpperCase())}
                  required
                  maxLength={6}
                />
                <p className="text-xs text-gray-500">
                  Você pode usar este recurso no máximo 2 vezes por token
                </p>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Gerando nova senha..." : "Gerar nova senha"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Modal com nova senha */}
        <Dialog open={showPasswordModal} onOpenChange={setShowPasswordModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                Nova senha gerada com sucesso!
              </DialogTitle>
              <DialogDescription>
                Anote sua nova senha. Este modal será fechado automaticamente em 5 segundos.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Sua nova senha:</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="text"
                    value={newPassword}
                    readOnly
                    className="font-mono text-lg font-bold"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={copyPassword}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-sm text-yellow-800">
                  <strong>Importante:</strong> Esta ação foi registrada no painel administrativo para verificação.
                </p>
              </div>
              <Link href="/auth/login">
                <Button className="w-full">Ir para login</Button>
              </Link>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
