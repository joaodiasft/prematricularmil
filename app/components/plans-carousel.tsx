"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle2, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"

interface Plan {
  name: string
  modules: number
  pricePrazo: number
  priceVista: number
  discount: number
  popular: boolean
  features: string[]
}

interface PlansCarouselProps {
  plans: Plan[]
  session: any
}

export function PlansCarousel({ plans, session }: PlansCarouselProps) {
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return
    const container = scrollContainerRef.current
    const cardWidth = container.offsetWidth / Math.min(3, plans.length)
    const scrollAmount = direction === "left" ? -cardWidth : cardWidth
    container.scrollBy({ left: scrollAmount, behavior: "smooth" })
  }

  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return
    const updateScrollButtons = () => {
      setCanScrollLeft(container.scrollLeft > 0)
      setCanScrollRight(container.scrollLeft < container.scrollWidth - container.offsetWidth - 10)
    }
    container.addEventListener("scroll", updateScrollButtons)
    updateScrollButtons()
    return () => container.removeEventListener("scroll", updateScrollButtons)
  }, [plans])

  return (
    <div className="relative max-w-7xl mx-auto">
      {canScrollLeft && (
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-3 shadow-lg hover:bg-gray-50 transition-all border-2 border-primary/20 hover:border-primary/40"
          aria-label="Plano anterior"
        >
          <ChevronLeft className="h-6 w-6 text-primary" />
        </button>
      )}
      <div
        ref={scrollContainerRef}
        className="flex gap-6 overflow-x-auto scroll-smooth px-12 py-4"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {plans.map((plan, index) => (
          <div key={index} className="flex-shrink-0 w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] xl:w-[calc(20%-19.2px)]">
            <Card className={`relative border-2 flex flex-col h-full transition-all hover:shadow-2xl ${plan.popular ? "border-primary shadow-xl scale-105 bg-gradient-to-br from-primary/5 to-white" : "border-gray-200 hover:border-primary/50"}`}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                  <Badge className="bg-primary text-white px-4 py-1.5 text-sm font-bold shadow-lg">⭐ Mais Escolhido</Badge>
                </div>
              )}
              <CardHeader className="text-center pb-4 pt-6">
                <CardTitle className="text-2xl font-bold mb-3">{plan.name}</CardTitle>
                <div className="space-y-2 mb-3">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">À Vista</div>
                    <div className="text-3xl font-bold text-primary">R$ {plan.priceVista.toFixed(2).replace(".", ",")}</div>
                    <div className="text-xs text-green-600 font-semibold mt-1">Economize R$ {plan.discount.toFixed(2).replace(".", ",")}</div>
                  </div>
                  <div className="border-t pt-2">
                    <div className="text-xs text-gray-500 mb-1">A Prazo</div>
                    <div className="text-xl font-semibold text-gray-700 line-through">R$ {plan.pricePrazo.toFixed(2).replace(".", ",")}</div>
                  </div>
                </div>
                <CardDescription className="font-semibold text-primary">{plan.modules} módulo{plan.modules > 1 ? "s" : ""} • {plan.modules * 4} encontros</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <ul className="space-y-2.5 mb-6 flex-1">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700 leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link href={session ? "/pre-matricula" : "/auth/register"} className="block mt-auto">
                  <Button className={`w-full ${plan.popular ? "shadow-lg" : ""}`} variant={plan.popular ? "default" : "outline"} size="lg">
                    Escolher {plan.name}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
      {canScrollRight && (
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-3 shadow-lg hover:bg-gray-50 transition-all border-2 border-primary/20 hover:border-primary/40"
          aria-label="Próximo plano"
        >
          <ChevronRight className="h-6 w-6 text-primary" />
        </button>
      )}
    </div>
  )
}
