"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  GraduationCap, 
  BookOpen, 
  Users, 
  Award,
  CheckCircle2, 
  Star, 
  TrendingUp, 
  Clock, 
  MessageSquare,
  Target,
  Zap,
  Shield,
  ArrowRight,
  Phone,
  Mail,
  Instagram,
  Facebook,
  Youtube,
  ChevronDown,
  Play,
  MapPin,
  Calendar,
  Sparkles,
  Trophy,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import { useSession } from "next-auth/react"
import { useState, useEffect, useRef } from "react"

export default function HomePage() {
  const { data: session } = useSession()

  // Componente PlansCarousel incorporado diretamente
  const PlansCarousel = ({ plans, session }: { plans: any[], session: any }) => {
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
                    {plan.features.map((feature: string, i: number) => (
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

  const stats = [
    { number: "5.000+", label: "Alunos Aprovados" },
    { number: "98%", label: "Taxa de Satisfação" },
    { number: "850+", label: "Nota 1000 no ENEM" },
    { number: "24h", label: "Tempo de Correção" },
  ]

  const features = [
    {
      icon: Clock,
      title: "Correção em 24h",
      description: "Receba correções detalhadas e comentadas em tempo recorde. Não espere semanas pelo seu feedback.",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      icon: Users,
      title: "Mentorias ao Vivo",
      description: "Tire dúvidas diretamente com os professores em aulas semanais focadas em repertório e estrutura.",
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      icon: Award,
      title: "Plataforma Gamificada",
      description: "Acompanhe seu progresso visualmente, ganhe medalhas e veja sua evolução gráfica a cada redação.",
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    {
      icon: Target,
      title: "Foco em Medicina",
      description: "Método específico para quem quer Medicina. Estratégias comprovadas para alcançar a nota 1000.",
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      icon: Zap,
      title: "Material Exclusivo",
      description: "Acesso a repertórios atualizados, temas previstos e modelos de redação nota 1000.",
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
    {
      icon: Shield,
      title: "Garantia de Resultado",
      description: "Se você seguir o método e não melhorar, devolvemos seu investimento. Confiança total.",
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
  ]

  const testimonials = [
    {
      name: "Maria Luiza Mendes de Souza",
      course: "Nota 940 no ENEM 2024 | Aluna 900+ no curso",
      text: "Hoje, posso dizer que alcancei um nível de excelência na redação, no enem 2024 consegui com muito esforço alcançar a nota 940, além de ser aluna 900+ no curso, escrevendo com mais segurança, domínio e consciência do que é exigido. Ao término das aulas, saio sem nenhuma dúvida, preparada para qualquer tema!",
      rating: 5,
    },
    {
      name: "Moriah Basilio Moreira Almeida Correa",
      course: "Nota 920 no ENEM | Aluna há 4-5 anos",
      text: "Frequento o curso de redação da professora Martha há 4-5 anos e, graças a ele, aprendi muito. A didática da professora é excelente! No 9º ano do Ensino Fundamental, participei do ENEM como treineira e consegui tirar 920 na redação. Por isso, recomendo muito esse curso tanto para estudantes quanto para pessoas já formadas!",
      rating: 5,
    },
    {
      name: "Isabela Pereira",
      course: "Aluna do curso",
      text: "O curso Redação Nota Mil é maravilhoso! Oferece uma metodologia clara e prática, ajudando a desenvolver habilidades essenciais para escrever redações de qualidade.",
      rating: 5,
    },
    {
      name: "Ana Paula Gomes Soares",
      course: "Nota 920 no ENEM 2024 | 8º ano do Ensino Fundamental",
      text: "O material é impecável, didático e muito completo. Graças ao método e às orientações da professora Martha Cristina, consegui alcançar 920 pontos na redação do Enem 2024, ainda cursando o 8º ano! Recomendo muito para aqueles que buscam aprimorar suas habilidades de escrita com qualidade e eficiência!!!!",
      rating: 5,
    },
    {
      name: "Livia Porfirio",
      course: "Nota 940 no ENEM 2024",
      text: "Que lugar maravilhoso!! As aulas foram muito úteis e me ajudaram a aprimorar minha escrita. Sou grata pela professora Martinha pelo suporte e pelas dicas valiosas. E graças a isso, consegui tirar 940 na redação do Enem em 2024! A cada aula me sinto mais próxima da nota 1000!",
      rating: 5,
    },
  ]

  const galleryImages = [
    { url: "https://i.im.ge/2026/01/04/B4eOR6.photo-2025-09-30-20-55-01.jpeg", course: "Medicina", label: "Aluno aprovado em Medicina" },
    { url: "https://i.im.ge/2026/01/04/B4eQnx.photo-2025-09-30-20-57-45.jpeg", course: "Direito", label: "Aluno aprovado em Direito" },
    { url: "https://i.im.ge/2026/01/04/B4eXPJ.photo-2025-10-19-13-18-02.jpeg", course: "Engenharia", label: "Aluno aprovado em Engenharia" },
    { url: "https://i.im.ge/2026/01/04/B4GGQc.photo-2025-10-19-13-18-07.jpeg", course: "Medicina", label: "Aluno aprovado em Medicina" },
    { url: "https://i.im.ge/2026/01/04/B4elky.photo-2025-09-08-18-47-25.jpeg", course: "Direito", label: "Aluno aprovado em Direito" },
    { url: "https://i.im.ge/2026/01/04/B4e2TF.photo-2025-09-10-23-02-47.jpeg", course: "Engenharia", label: "Aluno aprovado em Engenharia" },
    { url: "https://i.im.ge/2026/01/04/B4eq4X.photo-2025-09-21-22-33-55.jpeg", course: "Medicina", label: "Aluno aprovado em Medicina" },
    { url: "https://i.im.ge/2026/01/04/B4e7th.photo-2025-09-25-18-25-05.jpeg", course: "Direito", label: "Aluno aprovado em Direito" },
  ]

  const plans = [
    {
      name: "1 Módulo",
      modules: 1,
      pricePrazo: 300,
      priceVista: 270,
      discount: 30,
      popular: false,
      features: [
        "4 encontros presenciais",
        "1 módulo completo",
        "Correções em 24h",
        "Material exclusivo",
        "Suporte via WhatsApp",
        "1 redação por aula",
      ],
    },
    {
      name: "2 Módulos",
      modules: 2,
      pricePrazo: 600,
      priceVista: 520,
      discount: 80,
      popular: true,
      features: [
        "8 encontros presenciais",
        "2 módulos completos",
        "Correções em 24h",
        "Material exclusivo",
        "Suporte via WhatsApp",
        "1 redação por aula",
      ],
    },
    {
      name: "3 Módulos",
      modules: 3,
      pricePrazo: 900,
      priceVista: 750,
      discount: 150,
      popular: false,
      features: [
        "12 encontros presenciais",
        "3 módulos completos",
        "Correções em 24h",
        "Material exclusivo",
        "Suporte via WhatsApp",
        "1 redação por aula",
      ],
    },
    {
      name: "4 Módulos",
      modules: 4,
      pricePrazo: 1200,
      priceVista: 960,
      discount: 240,
      popular: false,
      features: [
        "16 encontros presenciais",
        "4 módulos completos",
        "Correções em 24h",
        "Material exclusivo",
        "Suporte via WhatsApp",
        "1 redação por aula",
      ],
    },
    {
      name: "5 Módulos",
      modules: 5,
      pricePrazo: 1500,
      priceVista: 1170,
      discount: 330,
      popular: false,
      features: [
        "20 encontros presenciais",
        "5 módulos completos",
        "Correções em 24h",
        "Material exclusivo",
        "Suporte via WhatsApp",
        "1 redação por aula",
      ],
    },
  ]

  const faqs = [
    {
      question: "Como funciona a correção em 24h?",
      answer: "Você envia sua redação pela plataforma e recebe uma correção detalhada com comentários específicos em até 24 horas, incluindo sugestões de melhoria e pontuação por competência.",
    },
    {
      question: "Preciso ter conhecimento prévio?",
      answer: "Não! Nosso método é adaptado para todos os níveis, desde iniciantes até quem já tem experiência. Começamos do básico e evoluímos gradualmente.",
    },
    {
      question: "As aulas são ao vivo ou gravadas?",
      answer: "Oferecemos ambos! Mentorias ao vivo semanais para tirar dúvidas e aulas gravadas disponíveis 24/7 para você estudar no seu ritmo.",
    },
    {
      question: "Posso cancelar a qualquer momento?",
      answer: "Sim, você pode cancelar sua assinatura a qualquer momento sem multas ou taxas adicionais.",
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b bg-white/95 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center relative group">
                  <GraduationCap className="h-6 w-6 text-white" />
                  {/* Login Admin Escondido */}
                  <Link 
                    href="/auth/admin/login" 
                    className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900/80 flex items-center justify-center z-10"
                    title="Acesso Admin"
                  >
                    <span className="text-white text-xs font-bold">ADMIN</span>
                  </Link>
                </div>
                <Link href="/" className="text-2xl font-bold text-gray-900 hover:text-primary transition-colors">
                  Redação Nota Mil
                </Link>
              </div>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="#sobre" className="text-gray-700 hover:text-primary transition-colors">
                Sobre
              </Link>
              <Link href="#planos" className="text-gray-700 hover:text-primary transition-colors">
                Planos
              </Link>
              <Link href="#depoimentos" className="text-gray-700 hover:text-primary transition-colors">
                Depoimentos
              </Link>
              <Link href="#faq" className="text-gray-700 hover:text-primary transition-colors">
                FAQ
              </Link>
            </nav>
            <div className="flex items-center gap-3">
              {session ? (
                <Link href="/aluno">
                  <Button variant="outline">Área do Aluno</Button>
                </Link>
              ) : (
                <>
                  <Link href="/auth/login">
                    <Button variant="ghost">Entrar</Button>
                  </Link>
                  <Link href="/auth/register">
                    <Button>Começar Agora</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-pink-50 to-white py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">
              🎯 Método Validado por 5.000+ Alunos
            </Badge>
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Sua aprovação em{" "}
              <span className="text-primary">Medicina</span> começa com uma{" "}
              <span className="text-primary">Redação Nota 1000</span>
            </h1>
            <p className="text-xl lg:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Método comprovado que já ajudou mais de 850 alunos a alcançarem a nota máxima no ENEM. 
              Garanta sua vaga e tenha acesso à correção mais detalhada do Brasil.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href={session ? "/pre-matricula" : "/auth/register"}>
                <Button size="lg" className="text-lg px-8 py-6 h-auto">
                  Quero garantir minha vaga
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="#planos">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 h-auto">
                  <Play className="mr-2 h-5 w-5" />
                  Ver planos e preços
                </Button>
              </Link>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl lg:text-4xl font-bold text-primary mb-2">
                    {stat.number}
                  </div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="sobre" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Por que escolher a Redação Nota Mil?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Um método completo e testado que transforma sua redação em uma máquina de pontos
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card key={index} className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
                  <CardHeader>
                    <div className={`h-14 w-14 rounded-full ${feature.bgColor} flex items-center justify-center mb-4`}>
                      <Icon className={`h-7 w-7 ${feature.color}`} />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                    <CardDescription className="text-base mt-2">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Como Funciona
            </h2>
            <p className="text-xl text-gray-600">
              Um processo simples e eficaz em 4 passos
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {[
              { step: "01", title: "Faça sua Pré-matrícula", desc: "Preencha o formulário e escolha seu plano ideal" },
              { step: "02", title: "Acesse a Plataforma", desc: "Receba seu acesso e comece a estudar imediatamente" },
              { step: "03", title: "Pratique e Receba Correções", desc: "Escreva redações e receba feedback detalhado em 24h" },
              { step: "04", title: "Alcance a Nota 1000", desc: "Evolua constantemente até dominar a redação perfeita" },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="h-16 w-16 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="depoimentos" className="py-24 bg-gradient-to-br from-white via-primary/5 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 text-base px-4 py-2">
              Depoimentos Reais
            </Badge>
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 mb-6 shadow-lg">
              <MessageSquare className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              O que nossos alunos dizem
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Histórias reais de quem alcançou excelência e aprovação no ENEM e vestibulares
            </p>
          </div>
          <div className="flex gap-6 overflow-x-auto scroll-smooth px-2 pb-4 max-w-7xl mx-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="relative border-2 border-gray-200 hover:border-primary/50 transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-2 bg-white overflow-hidden group flex-shrink-0 w-[calc(20%-19.2px)] min-w-[280px] max-w-[320px]">
                {/* Decorative top border */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-pink-500 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <CardHeader className="pb-4">
                  {/* Rating Stars */}
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400 drop-shadow-sm" />
                    ))}
                    <span className="ml-2 text-sm font-semibold text-gray-600">5.0</span>
                  </div>
                  
                  {/* Quote Icon */}
                  <div className="absolute top-6 right-6 opacity-10 group-hover:opacity-20 transition-opacity">
                    <MessageSquare className="h-16 w-16 text-primary" />
                  </div>
                  
                  {/* Testimonial Text */}
                  <CardDescription className="text-base leading-relaxed min-h-[140px] relative z-10 text-gray-700 font-medium">
                    <span className="text-4xl text-primary/30 font-serif leading-none absolute -top-2 -left-1">"</span>
                    <span className="relative z-10 pl-6">{testimonial.text}</span>
                    <span className="text-4xl text-primary/30 font-serif leading-none">"</span>
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="pt-4 border-t border-gray-100 bg-gradient-to-br from-primary/5 via-white to-white">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-pink-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
                          {testimonial.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 text-base">{testimonial.name}</div>
                          <div className="text-xs text-gray-500 mt-0.5">{testimonial.course}</div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Award className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Stats Section */}
          <div className="mt-16 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-2xl p-8 border-2 border-primary/20">
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto text-center">
              <div className="flex flex-col items-center">
                <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">+5.000</div>
                <div className="text-gray-600 font-semibold">Alunos Aprovados</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                  <Trophy className="h-8 w-8 text-primary" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">850+</div>
                <div className="text-gray-600 font-semibold">Notas 1000</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                  <Star className="h-8 w-8 text-primary fill-primary" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">98%</div>
                <div className="text-gray-600 font-semibold">Satisfação</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-24 bg-gradient-to-br from-white via-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 mb-6 shadow-lg">
              <Trophy className="h-10 w-10 text-primary" />
            </div>
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 text-base px-4 py-2">
              Resultados Comprovados
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Alunos Aprovados nos Mais Concorridos Cursos
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6 leading-relaxed">
              Nossos alunos já foram aprovados nos cursos mais disputados do Brasil. 
              Veja resultados reais de quem alcançou a nota máxima no ENEM e conquistou sua vaga nos principais cursos.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
              <div className="flex items-center gap-2 bg-red-50 border-2 border-red-200 px-6 py-3 rounded-full">
                <GraduationCap className="h-5 w-5 text-red-600" />
                <span className="font-bold text-red-700">Medicina</span>
              </div>
              <div className="flex items-center gap-2 bg-blue-50 border-2 border-blue-200 px-6 py-3 rounded-full">
                <GraduationCap className="h-5 w-5 text-blue-600" />
                <span className="font-bold text-blue-700">Direito</span>
              </div>
              <div className="flex items-center gap-2 bg-green-50 border-2 border-green-200 px-6 py-3 rounded-full">
                <GraduationCap className="h-5 w-5 text-green-600" />
                <span className="font-bold text-green-700">Engenharia</span>
              </div>
              <div className="flex items-center gap-2 bg-purple-50 border-2 border-purple-200 px-6 py-3 rounded-full">
                <GraduationCap className="h-5 w-5 text-purple-600" />
                <span className="font-bold text-purple-700">E Outros</span>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-8 text-base font-semibold mb-8">
              <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-full shadow-md">
                <Award className="h-5 w-5 text-primary" />
                <span className="text-gray-900">850+ Notas 1000</span>
              </div>
              <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-full shadow-md">
                <Users className="h-5 w-5 text-primary" />
                <span className="text-gray-900">5.000+ Aprovados</span>
              </div>
              <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-full shadow-md">
                <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                <span className="text-gray-900">98% Satisfação</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6 max-w-7xl mx-auto mb-16">
            {galleryImages.map((image, index) => {
              const courseColors: Record<string, { bg: string; border: string; text: string }> = {
                Medicina: { bg: "bg-red-500", border: "border-red-600", text: "text-white" },
                Direito: { bg: "bg-blue-500", border: "border-blue-600", text: "text-white" },
                Engenharia: { bg: "bg-green-500", border: "border-green-600", text: "text-white" },
              }
              const courseColor = courseColors[image.course] || { bg: "bg-primary", border: "border-primary/80", text: "text-white" }
              
              return (
                <div
                  key={index}
                  className="relative aspect-square overflow-hidden rounded-2xl group cursor-pointer shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border-2 border-gray-100 hover:border-primary/30"
                >
                  <Image
                    src={image.url}
                    alt={`Redação Nota 1000 - ${image.label}`}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-115"
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute top-4 left-4 bg-primary/90 backdrop-blur-sm rounded-full px-3 py-1.5 transform scale-0 group-hover:scale-100 transition-transform duration-300">
                    <div className="flex items-center gap-1.5">
                      <Trophy className="h-4 w-4 text-yellow-300" />
                      <span className="text-white text-xs font-bold">NOTA 1000</span>
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-5 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                    <div className={`${courseColor.bg}/95 backdrop-blur-md rounded-lg p-3 border-2 ${courseColor.border}`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Trophy className="h-4 w-4 text-yellow-300" />
                          <span className={`font-bold text-sm ${courseColor.text}`}>Redação Nota 1000</span>
                        </div>
                        <Star className="h-4 w-4 text-yellow-300 fill-yellow-300" />
                      </div>
                      <p className={`text-xs font-semibold ${courseColor.text}`}>{image.label}</p>
                    </div>
                  </div>
                  <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-full p-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg">
                    <Sparkles className="h-5 w-5 text-primary" />
                  </div>
                </div>
              )
            })}
          </div>
          <div className="text-center bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-2xl p-8 border-2 border-primary/20">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Faça Parte Dessa História de Sucesso
            </h3>
            <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
              Mais de <strong className="text-primary">850 redações nota 1000</strong> e milhares de aprovações em Medicina. 
              Seu resultado pode ser o próximo!
            </p>
            <Link href={session ? "/pre-matricula" : "/auth/register"}>
              <Button size="lg" className="text-lg px-8 py-6 h-auto shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all">
                <Trophy className="mr-2 h-5 w-5" />
                Quero Alcançar Minha Nota 1000
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Plans Section */}
      <section id="planos" className="py-20 bg-gradient-to-br from-primary/5 via-white to-primary/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 text-base px-4 py-2">
              💰 Quanto mais módulos, MAIOR o desconto à vista!
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Escolha o Plano Ideal para Você
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-2">
              Planos presenciais com encontros semanais. Matrícula R$ 100,00
            </p>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              <strong className="text-primary">Desconto de 50% na matrícula</strong> ao escolher 2 ou mais cursos
            </p>
          </div>
          
          {/* Carousel de Planos */}
          <PlansCarousel plans={plans} session={session} />
          
          <div className="bg-white rounded-2xl p-8 border-2 border-primary/20 shadow-xl max-w-4xl mx-auto mt-12">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                📋 Informações Importantes
              </h3>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Matrícula R$ 100,00</h4>
                  <p className="text-sm text-gray-600">
                    Desconto de 50% ao escolher 2 ou mais cursos
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Todos os cursos são presenciais</h4>
                  <p className="text-sm text-gray-600">
                    Encontros semanais em Goiânia
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">4 encontros por módulo</h4>
                  <p className="text-sm text-gray-600">
                    Cada módulo tem 4 encontros presenciais
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Desconto progressivo</h4>
                  <p className="text-sm text-gray-600">
                    Quanto mais módulos, maior o desconto à vista
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-white">
              <CardContent className="p-12">
                <div className="text-center mb-8">
                  <TrendingUp className="h-16 w-16 text-primary mx-auto mb-4" />
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    Resultados Comprovados
                  </h2>
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-primary mb-2">850+</div>
                    <div className="text-lg text-gray-700">Redações Nota 1000</div>
                  </div>
                  <div className="text-center">
                    <div className="text-5xl font-bold text-primary mb-2">98%</div>
                    <div className="text-lg text-gray-700">Taxa de Satisfação</div>
                  </div>
                  <div className="text-center">
                    <div className="text-5xl font-bold text-primary mb-2">5.000+</div>
                    <div className="text-lg text-gray-700">Alunos Aprovados</div>
                  </div>
                  <div className="text-center">
                    <div className="text-5xl font-bold text-primary mb-2">24h</div>
                    <div className="text-lg text-gray-700">Tempo Médio de Correção</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Perguntas Frequentes
            </h2>
            <p className="text-xl text-gray-600">
              Tire suas dúvidas sobre nosso método
            </p>
          </div>
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index} className="border-2">
                <CardHeader>
                  <CardTitle className="text-lg">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="relative py-24 bg-gradient-to-br from-primary via-primary/95 to-primary/90 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm mb-8">
              <Trophy className="h-10 w-10 text-yellow-300" />
            </div>
            <h2 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
              Pronto para alcançar sua <span className="text-yellow-300">Nota 1000</span>?
            </h2>
            <p className="text-xl lg:text-2xl mb-4 text-white/95 max-w-3xl mx-auto leading-relaxed">
              Junte-se a mais de <strong>5.000 alunos</strong> que já transformaram suas redações e conquistaram a aprovação em Medicina.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6 mb-10 text-white/90">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-yellow-300" />
                <span className="font-semibold">850+ Notas 1000</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-yellow-300" />
                <span className="font-semibold">98% de Satisfação</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-yellow-300" />
                <span className="font-semibold">Método Comprovado</span>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 mb-10 border border-white/20">
              <h3 className="text-2xl font-bold mb-4">🎯 Comece Agora e Transforme Sua Redação</h3>
              <p className="text-lg text-white/90 mb-6">
                Faça sua pré-matrícula em menos de 5 minutos e garante sua vaga nas turmas presenciais.
              </p>
              <div className="grid sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                  <div className="text-3xl font-bold mb-1">1</div>
                  <div className="text-sm">Preencha seus dados</div>
                </div>
                <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                  <div className="text-3xl font-bold mb-1">2</div>
                  <div className="text-sm">Escolha seu plano</div>
                </div>
                <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                  <div className="text-3xl font-bold mb-1">3</div>
                  <div className="text-sm">Garante sua vaga!</div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href={session ? "/pre-matricula" : "/auth/register"}>
                <Button size="lg" variant="secondary" className="text-lg px-10 py-7 h-auto shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all">
                  <Sparkles className="mr-2 h-6 w-6" />
                  Fazer Pré-Matrícula Agora
                  <ArrowRight className="ml-2 h-6 w-6" />
                </Button>
              </Link>
              <a href="https://wa.me/5562981899570" target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline" className="text-lg px-8 py-7 h-auto bg-white/10 border-2 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm">
                  <MessageSquare className="mr-2 h-5 w-5" />
                  Falar no WhatsApp
                </Button>
              </a>
            </div>
            
            <p className="mt-8 text-sm text-white/80">
              ⚡ Garanta sua vaga enquanto há disponibilidade • Matrícula R$ 100,00
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="grid lg:grid-cols-5 gap-12 mb-12">
            {/* Brand Column */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center">
                  <GraduationCap className="h-7 w-7 text-white" />
                </div>
                <span className="text-2xl font-bold">Redação Nota Mil</span>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed">
                O método mais eficaz e comprovado para alcançar a nota 1000 na redação do ENEM e garantir sua aprovação em Medicina. 
                Mais de 5.000 alunos aprovados e 850+ redações nota máxima.
              </p>
              <div className="flex gap-4">
                <a 
                  href="https://instagram.com/redacao.nota.1000" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="h-12 w-12 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary transition-all transform hover:scale-110"
                  aria-label="Instagram"
                  title="Instagram"
                >
                  <Instagram className="h-6 w-6" />
                </a>
                <a 
                  href="#" 
                  className="h-12 w-12 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary transition-all transform hover:scale-110"
                  aria-label="Facebook"
                  title="Facebook"
                >
                  <Facebook className="h-6 w-6" />
                </a>
                <a 
                  href="#" 
                  className="h-12 w-12 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary transition-all transform hover:scale-110"
                  aria-label="YouTube"
                  title="YouTube"
                >
                  <Youtube className="h-6 w-6" />
                </a>
              </div>
            </div>

            {/* Links Rápidos */}
            <div>
              <h3 className="font-bold text-lg mb-6 text-white">Links Rápidos</h3>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <Link href="#sobre" className="hover:text-primary transition-colors flex items-center gap-2">
                    <ArrowRight className="h-4 w-4" />
                    Sobre Nós
                  </Link>
                </li>
                <li>
                  <Link href="#planos" className="hover:text-primary transition-colors flex items-center gap-2">
                    <ArrowRight className="h-4 w-4" />
                    Planos e Preços
                  </Link>
                </li>
                <li>
                  <Link href="#depoimentos" className="hover:text-primary transition-colors flex items-center gap-2">
                    <ArrowRight className="h-4 w-4" />
                    Depoimentos
                  </Link>
                </li>
                <li>
                  <Link href="#faq" className="hover:text-primary transition-colors flex items-center gap-2">
                    <ArrowRight className="h-4 w-4" />
                    Perguntas Frequentes
                  </Link>
                </li>
                <li>
                  <Link href={session ? "/aluno" : "/auth/login"} className="hover:text-primary transition-colors flex items-center gap-2">
                    <ArrowRight className="h-4 w-4" />
                    Área do Aluno
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contato */}
            <div>
              <h3 className="font-bold text-lg mb-6 text-white">Contato</h3>
              <ul className="space-y-4 text-gray-400">
                <li>
                  <a href="tel:+5562981899570" className="hover:text-primary transition-colors flex items-start gap-3 group">
                    <Phone className="h-5 w-5 mt-0.5 text-primary group-hover:scale-110 transition-transform" />
                    <div>
                      <div className="font-semibold text-white group-hover:text-primary">Telefone</div>
                      <div>(62) 98189-9570</div>
                    </div>
                  </a>
                </li>
                <li>
                  <a href="mailto:contato@redacaonotamil.com" className="hover:text-primary transition-colors flex items-start gap-3 group">
                    <Mail className="h-5 w-5 mt-0.5 text-primary group-hover:scale-110 transition-transform" />
                    <div>
                      <div className="font-semibold text-white group-hover:text-primary">E-mail</div>
                      <div>contato@redacaonotamil.com</div>
                    </div>
                  </a>
                </li>
                <li>
                  <a 
                    href="https://wa.me/5562981899570" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-colors flex items-start gap-3 group"
                  >
                    <MessageSquare className="h-5 w-5 mt-0.5 text-primary group-hover:scale-110 transition-transform" />
                    <div>
                      <div className="font-semibold text-white group-hover:text-primary">WhatsApp</div>
                      <div>Fale conosco agora</div>
                    </div>
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 mt-0.5 text-primary" />
                  <div>
                    <div className="font-semibold text-white">Endereço</div>
                    <div className="text-sm">Rua F, R. L-01, Qd.159<br />Goiânia - GO, 74475-060</div>
                  </div>
                </li>
              </ul>
            </div>

            {/* Informações */}
            <div>
              <h3 className="font-bold text-lg mb-6 text-white">Informações</h3>
              <ul className="space-y-4 text-gray-400">
                <li className="flex items-start gap-3">
                  <Clock className="h-5 w-5 mt-0.5 text-primary" />
                  <div>
                    <div className="font-semibold text-white mb-1">Horário de Atendimento</div>
                    <div className="text-sm">Segunda a Sexta: 8h às 18h<br />Sábado: 8h às 12h</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Award className="h-5 w-5 mt-0.5 text-primary" />
                  <div>
                    <div className="font-semibold text-white mb-1">Cursos Disponíveis</div>
                    <div className="text-sm">Redação • Gramática<br />Matemática • Exatas</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Users className="h-5 w-5 mt-0.5 text-primary" />
                  <div>
                    <div className="font-semibold text-white mb-1">Modalidade</div>
                    <div className="text-sm">100% Presencial<br />Turmas em Goiânia</div>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="text-center md:text-left">
                <p className="text-gray-400 text-sm mb-2">
                  © {new Date().getFullYear()} Redação Nota Mil. Todos os direitos reservados.
                </p>
                <p className="text-gray-500 text-xs">
                  Desenvolvido com ❤️ para transformar vidas através da educação
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-6 text-xs text-gray-500">
                <Link href="#" className="hover:text-primary transition-colors">Política de Privacidade</Link>
                <Link href="#" className="hover:text-primary transition-colors">Termos de Uso</Link>
                <Link href="#" className="hover:text-primary transition-colors">Política de Cancelamento</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
