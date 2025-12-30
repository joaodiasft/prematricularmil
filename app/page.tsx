"use client"

import Link from "next/link"
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
  Play
} from "lucide-react"
import { useSession } from "next-auth/react"

export default function HomePage() {
  const { data: session } = useSession()

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
      name: "Maria Silva",
      course: "Medicina - UFG",
      text: "Consegui 980 na redação do ENEM e entrei em Medicina na UFG. O método realmente funciona!",
      rating: 5,
    },
    {
      name: "João Santos",
      course: "Medicina - USP",
      text: "De 600 para 960 em 3 meses. As correções detalhadas fizeram toda a diferença na minha aprovação.",
      rating: 5,
    },
    {
      name: "Ana Costa",
      course: "Medicina - UnB",
      text: "A plataforma gamificada me manteve motivada. Ver meu progresso foi essencial para não desistir.",
      rating: 5,
    },
  ]

  const plans = [
    {
      name: "Foco",
      modules: 1,
      price: "A partir de R$ 297",
      popular: false,
      features: ["1 módulo", "Correções em 24h", "Material exclusivo", "Suporte via WhatsApp"],
    },
    {
      name: "Intensivo",
      modules: 2,
      price: "A partir de R$ 497",
      popular: true,
      features: ["2 módulos", "Correções em 24h", "Mentorias ao vivo", "Material exclusivo", "Suporte prioritário"],
    },
    {
      name: "Evolução",
      modules: 3,
      price: "A partir de R$ 697",
      popular: false,
      features: ["3 módulos", "Correções em 24h", "Mentorias ao vivo", "Material exclusivo", "Suporte prioritário", "Grupo VIP"],
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
              <Link href="/" className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center relative group">
                  <GraduationCap className="h-6 w-6 text-white" />
                  {/* Login Admin Escondido */}
                  <Link 
                    href="/auth/admin/login" 
                    className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900/80 flex items-center justify-center"
                    title="Acesso Admin"
                  >
                    <span className="text-white text-xs font-bold">ADMIN</span>
                  </Link>
                </div>
                <span className="text-2xl font-bold text-gray-900">Redação Nota Mil</span>
              </Link>
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
      <section id="depoimentos" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              O que nossos alunos dizem
            </h2>
            <p className="text-xl text-gray-600">
              Histórias reais de quem alcançou a aprovação
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-2">
                <CardHeader>
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <CardDescription className="text-base italic">
                    "{testimonial.text}"
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-gray-600">{testimonial.course}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Plans Section */}
      <section id="planos" className="py-20 bg-gradient-to-br from-primary/5 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Escolha o Plano Ideal para Você
            </h2>
            <p className="text-xl text-gray-600">
              Planos flexíveis que se adaptam ao seu ritmo de estudos
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, index) => (
              <Card 
                key={index} 
                className={`relative border-2 ${plan.popular ? "border-primary shadow-xl scale-105" : ""}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-white px-4 py-1">
                      Mais Escolhido
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                  <div className="text-3xl font-bold text-primary mb-2">{plan.price}</div>
                  <CardDescription>{plan.modules} módulo{plan.modules > 1 ? "s" : ""}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href={session ? "/pre-matricula" : "/auth/register"} className="block">
                    <Button 
                      className={`w-full ${plan.popular ? "" : "variant-outline"}`}
                      variant={plan.popular ? "default" : "outline"}
                    >
                      Escolher {plan.name}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">
              💰 <strong>Desconto especial</strong> na taxa de matrícula para novos alunos!
            </p>
            <Link href={session ? "/pre-matricula" : "/auth/register"}>
              <Button size="lg" variant="outline">
                Ver todos os planos e benefícios
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
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
      <section className="py-20 bg-gradient-to-r from-primary to-primary/80 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Pronto para alcançar sua Nota 1000?
          </h2>
          <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            Junte-se a mais de 5.000 alunos que já transformaram suas redações e conquistaram a aprovação em Medicina.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={session ? "/pre-matricula" : "/auth/register"}>
              <Button size="lg" variant="secondary" className="text-lg px-8 py-6 h-auto">
                Começar Agora
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <a href="https://wa.me/5562981899570" target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 h-auto bg-white/10 border-white/20 text-white hover:bg-white/20">
                <MessageSquare className="mr-2 h-5 w-5" />
                Falar no WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <GraduationCap className="h-8 w-8 text-primary" />
                <span className="text-xl font-bold">Redação Nota Mil</span>
              </div>
              <p className="text-gray-400 text-sm">
                O método mais eficaz para alcançar a nota 1000 na redação do ENEM e garantir sua aprovação em Medicina.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Links Rápidos</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="#sobre" className="hover:text-white transition-colors">
                    Sobre Nós
                  </Link>
                </li>
                <li>
                  <Link href="#planos" className="hover:text-white transition-colors">
                    Planos
                  </Link>
                </li>
                <li>
                  <Link href="#depoimentos" className="hover:text-white transition-colors">
                    Depoimentos
                  </Link>
                </li>
                <li>
                  <Link href="#faq" className="hover:text-white transition-colors">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Contato</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <a href="tel:+5562981899570" className="hover:text-white transition-colors">
                    (62) 98189-9570
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <a href="mailto:contato@redacaonotamil.com" className="hover:text-white transition-colors">
                    contato@redacaonotamil.com
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  <a 
                    href="https://wa.me/5562981899570" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    WhatsApp
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Redes Sociais</h3>
              <div className="flex gap-4">
                <a 
                  href="https://instagram.com/redacao.nota.1000" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary transition-colors"
                >
                  <Instagram className="h-5 w-5" />
                </a>
                <a 
                  href="#" 
                  className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary transition-colors"
                >
                  <Facebook className="h-5 w-5" />
                </a>
                <a 
                  href="#" 
                  className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary transition-colors"
                >
                  <Youtube className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
            <p>© 2024 Redação Nota Mil. Todos os direitos reservados.</p>
            <p className="mt-2">
              Desenvolvido com ❤️ para transformar vidas através da educação
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
