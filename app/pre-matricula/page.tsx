"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Step2 from "./steps/step2"
import Step3 from "./steps/step3"
import Step4 from "./steps/step4"
import Step5 from "./steps/step5"
import Step6 from "./steps/step6"
import Step7 from "./steps/step7"
import Step8 from "./steps/step8"

const TOTAL_STEPS = 7

export default function PreMatriculaPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(2)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login")
    }
  }, [status, router])

  useEffect(() => {
    const progressValue = ((currentStep - 1) / TOTAL_STEPS) * 100
    setProgress(progressValue)
  }, [currentStep])

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  const handleNext = () => {
    if (currentStep < 8) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 2) {
      setCurrentStep(currentStep - 1)
    } else {
      router.push("/")
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 2:
        return <Step2 onNext={handleNext} />
      case 3:
        return <Step3 onNext={handleNext} onBack={handleBack} />
      case 4:
        return <Step4 onNext={handleNext} onBack={handleBack} />
      case 5:
        return <Step5 onNext={handleNext} onBack={handleBack} />
      case 6:
        return <Step6 onNext={handleNext} onBack={handleBack} />
      case 7:
        return <Step7 onNext={handleNext} onBack={handleBack} />
      case 8:
        return <Step8 onBack={handleBack} />
      default:
        return <Step2 onNext={handleNext} />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-primary">
            <ArrowLeft className="h-4 w-4" />
            Voltar para página inicial
          </Link>
          {session?.user && (
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">{session.user.name || "Aluno"}</div>
                <div className="text-xs text-gray-500">{session.user.email}</div>
              </div>
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border-2 border-primary">
                {session.user.image ? (
                  <img 
                    src={session.user.image} 
                    alt={session.user.name || "Avatar"} 
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-primary font-semibold text-lg">
                    {(session.user.name || session.user.email || "A")[0].toUpperCase()}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-primary">
                ETAPA {currentStep} DE {TOTAL_STEPS + 1}
              </span>
              <span className="text-sm text-gray-600">
                {Math.round(progress)}% concluído
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {renderStep()}
        </div>
      </div>
    </div>
  )
}

