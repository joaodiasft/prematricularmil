"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  GraduationCap,
  Clock,
  Calendar,
  CheckCircle2,
  Hourglass,
  XCircle,
  List,
  MessageCircle,
  Edit,
  ArrowLeft,
  Copy,
  User,
  Mail,
  Phone,
  MessageSquare,
  Instagram,
  School,
  BookOpen,
  Target,
  CreditCard,
  MapPin,
  FileText,
  Award,
  Users,
  UserCircle,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";

export default function AlunoPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [enrollment, setEnrollment] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    } else if (status === "authenticated") {
      fetchEnrollment();
    }
  }, [status, router]);

  const fetchEnrollment = async () => {
    try {
      const response = await fetch("/api/pre-enrollment/latest");
      if (response.ok) {
        const data = await response.json();
        setEnrollment(data);
      }
    } catch (error) {
      console.error("Error fetching enrollment:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<
      string,
      { label: string; variant: string; icon: any }
    > = {
      PENDING: {
        label: "Pendente",
        variant: "bg-yellow-100 text-yellow-800",
        icon: Hourglass,
      },
      IN_ANALYSIS: {
        label: "Em Análise",
        variant: "bg-blue-100 text-blue-800",
        icon: Clock,
      },
      CONFIRMED: {
        label: "Confirmada",
        variant: "bg-green-100 text-green-800",
        icon: CheckCircle2,
      },
      WAITLIST: {
        label: "Lista de Espera",
        variant: "bg-orange-100 text-orange-800",
        icon: List,
      },
      REJECTED: {
        label: "Recusada",
        variant: "bg-red-100 text-red-800",
        icon: XCircle,
      },
    };

    const config = statusConfig[status] || statusConfig.PENDING;
    const Icon = config.icon;

    return (
      <div
        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${config.variant}`}
      >
        <Icon className="h-4 w-4" />
        {config.label}
      </div>
    );
  };

  const copyToken = () => {
    if (enrollment?.token) {
      navigator.clipboard.writeText(enrollment.token);
      toast({
        title: "Token copiado!",
        description: "O token foi copiado para a área de transferência",
      });
    }
  };

  const whatsappMessage = `Olá, sou ${enrollment?.fullName} e gostaria de falar sobre minha pré-matrícula com token ${enrollment?.token}.`;
  const whatsappUrl = `https://wa.me/5562981899570?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!enrollment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-white">
        <div className="container mx-auto px-4 py-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-gray-600 mb-6 hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para página inicial
          </Link>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <GraduationCap className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Nenhuma pré-matrícula encontrada
                </h2>
                <p className="text-gray-600 mb-6">
                  Você ainda não realizou uma pré-matrícula. Comece agora!
                </p>
                <Link href="/pre-matricula">
                  <Button size="lg">Iniciar Pré-matrícula</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-gray-600 mb-6 hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para página inicial
        </Link>

        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Olá, {enrollment.fullName.split(" ")[0]}
            </h1>
            <p className="text-gray-600">
              Acompanhe o progresso da sua pré-matrícula abaixo.
            </p>
          </div>

          {/* Status Card */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  <CardTitle>Status Atual</CardTitle>
                </div>
                {getStatusBadge(enrollment.status)}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-6">
                {enrollment.status === "PENDING" &&
                  "Sua pré-matrícula foi enviada e está aguardando análise."}
                {enrollment.status === "IN_ANALYSIS" &&
                  "Estamos validando a documentação enviada. Fique atento, o resultado sairá em breve."}
                {enrollment.status === "CONFIRMED" &&
                  "Parabéns! Sua matrícula foi confirmada."}
                {enrollment.status === "WAITLIST" &&
                  "Você está na lista de espera. Entraremos em contato quando houver vaga disponível."}
                {enrollment.status === "REJECTED" &&
                  "Sua pré-matrícula foi recusada. Entre em contato para mais informações."}
              </p>

              {/* Timeline */}
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold">Cadastro Enviado</div>
                    <div className="text-sm text-gray-600">
                      {format(new Date(enrollment.createdAt), "d MMM, HH:mm", {
                        locale: ptBR,
                      })}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div
                    className={`h-8 w-8 rounded-full flex items-center justify-center ${
                      enrollment.status === "IN_ANALYSIS" ||
                      enrollment.status === "CONFIRMED" ||
                      enrollment.status === "WAITLIST"
                        ? "bg-primary"
                        : "bg-gray-200"
                    }`}
                  >
                    {enrollment.status === "IN_ANALYSIS" ||
                    enrollment.status === "CONFIRMED" ||
                    enrollment.status === "WAITLIST" ? (
                      <CheckCircle2 className="h-5 w-5 text-white" />
                    ) : (
                      <Clock className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold">Análise de Documentos</div>
                    <div className="text-sm text-gray-600">
                      {enrollment.status === "IN_ANALYSIS"
                        ? "Em andamento"
                        : enrollment.status === "PENDING"
                        ? "Aguardando aprovação"
                        : "Concluído"}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div
                    className={`h-8 w-8 rounded-full flex items-center justify-center ${
                      enrollment.status === "CONFIRMED"
                        ? "bg-primary"
                        : "bg-gray-200"
                    }`}
                  >
                    {enrollment.status === "CONFIRMED" ? (
                      <CheckCircle2 className="h-5 w-5 text-white" />
                    ) : (
                      <Calendar className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold">Confirmação Presencial</div>
                    <div className="text-sm text-gray-600">
                      {enrollment.status === "CONFIRMED"
                        ? "Confirmado"
                        : "Aguardando aprovação"}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Token de Inscrição */}
          <Card className="mb-6 border-2 border-primary/20">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-pink-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <CardTitle>Token de Inscrição</CardTitle>
                </div>
              </div>
              <CardDescription>
                Use este token para identificação em todas as comunicações
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="px-6 py-3 bg-gradient-to-r from-primary/10 to-pink-50 rounded-lg border-2 border-primary font-mono text-xl font-bold text-primary flex-1 text-center">
                  {enrollment.token}
                </div>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={copyToken}
                  className="h-12 px-4"
                >
                  <Copy className="h-5 w-5 mr-2" />
                  Copiar
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Dados Pessoais */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                <CardTitle>Dados Pessoais</CardTitle>
              </div>
              <CardDescription>Informações cadastrais do aluno</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="text-sm text-gray-600 flex items-center gap-2">
                    <UserCircle className="h-4 w-4" />
                    Nome Completo
                  </div>
                  <div className="font-semibold text-gray-900">
                    {enrollment.fullName}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-sm text-gray-600 flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    E-mail
                  </div>
                  <div className="font-semibold text-gray-900">
                    {enrollment.email}
                  </div>
                </div>

                {enrollment.age && (
                  <div className="space-y-1">
                    <div className="text-sm text-gray-600 flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Idade
                    </div>
                    <div className="font-semibold text-gray-900">
                      {enrollment.age} anos
                    </div>
                  </div>
                )}

                {enrollment.phone && (
                  <div className="space-y-1">
                    <div className="text-sm text-gray-600 flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Telefone
                    </div>
                    <div className="font-semibold text-gray-900">
                      {enrollment.phone}
                    </div>
                  </div>
                )}

                {enrollment.whatsapp && (
                  <div className="space-y-1">
                    <div className="text-sm text-gray-600 flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      WhatsApp
                    </div>
                    <div className="font-semibold text-gray-900">
                      {enrollment.whatsapp}
                    </div>
                  </div>
                )}

                {enrollment.instagram && (
                  <div className="space-y-1">
                    <div className="text-sm text-gray-600 flex items-center gap-2">
                      <Instagram className="h-4 w-4" />
                      Instagram
                    </div>
                    <div className="font-semibold text-gray-900">
                      @{enrollment.instagram.replace("@", "")}
                    </div>
                  </div>
                )}

                {enrollment.currentSchool && (
                  <div className="space-y-1 md:col-span-2">
                    <div className="text-sm text-gray-600 flex items-center gap-2">
                      <School className="h-4 w-4" />
                      Escola Atual
                    </div>
                    <div className="font-semibold text-gray-900">
                      {enrollment.currentSchool}
                    </div>
                  </div>
                )}

                {enrollment.currentGrade && (
                  <div className="space-y-1">
                    <div className="text-sm text-gray-600 flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      Série/Ano
                    </div>
                    <div className="font-semibold text-gray-900">
                      {enrollment.currentGrade}
                    </div>
                  </div>
                )}

                {enrollment.writingLevel && (
                  <div className="space-y-1">
                    <div className="text-sm text-gray-600 flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Nível de Redação
                    </div>
                    <div className="font-semibold text-gray-900">
                      {enrollment.writingLevel === "BEGINNER" && "Iniciante"}
                      {enrollment.writingLevel === "INTERMEDIATE" &&
                        "Intermediário"}
                      {enrollment.writingLevel === "ADVANCED" && "Avançado"}
                    </div>
                  </div>
                )}

                {enrollment.hasTakenENEM && (
                  <div className="space-y-1">
                    <div className="text-sm text-gray-600 flex items-center gap-2">
                      <Award className="h-4 w-4" />
                      Já fez ENEM
                    </div>
                    <div className="font-semibold text-gray-900">Sim</div>
                    {enrollment.enemScore && (
                      <div className="text-sm text-primary font-medium">
                        Nota: {enrollment.enemScore.toFixed(1)} pontos
                      </div>
                    )}
                  </div>
                )}
              </div>

              {enrollment.studyObjectives &&
                enrollment.studyObjectives.length > 0 && (
                  <div className="mt-6 pt-6 border-t">
                    <div className="text-sm text-gray-600 flex items-center gap-2 mb-3">
                      <Target className="h-4 w-4" />
                      Objetivos de Estudo
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {enrollment.studyObjectives.map(
                        (objective: string, index: number) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-sm"
                          >
                            {objective === "MEDICINE" && "Medicina"}
                            {objective === "LAW" && "Direito"}
                            {objective === "ENGINEERING" && "Engenharia"}
                            {objective === "PUBLIC_SERVICE" &&
                              "Concurso Público"}
                            {objective === "UNIVERSITY_ENTRANCE" &&
                              "Vestibular"}
                            {objective === "ENEM" && "ENEM"}
                            {objective === "OTHER" && "Outro"}
                          </Badge>
                        )
                      )}
                    </div>
                  </div>
                )}
            </CardContent>
          </Card>

          {/* Dados dos Responsáveis */}
          {(enrollment.fatherName || enrollment.motherName) && (
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  <CardTitle>Dados dos Responsáveis</CardTitle>
                </div>
                <CardDescription>
                  Informações dos responsáveis pelo aluno
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {enrollment.fatherName &&
                    enrollment.fatherName !== "Não informado" && (
                      <div className="space-y-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="text-sm font-semibold text-blue-900 flex items-center gap-2">
                          <UserCircle className="h-4 w-4" />
                          Pai
                        </div>
                        <div className="space-y-2">
                          <div>
                            <div className="text-xs text-gray-600">Nome</div>
                            <div className="font-semibold text-gray-900">
                              {enrollment.fatherName}
                            </div>
                          </div>
                          {enrollment.fatherPhone &&
                            enrollment.fatherPhone !== "Não informado" && (
                              <div>
                                <div className="text-xs text-gray-600">
                                  Telefone
                                </div>
                                <div className="font-semibold text-gray-900">
                                  {enrollment.fatherPhone}
                                </div>
                              </div>
                            )}
                        </div>
                      </div>
                    )}

                  {enrollment.motherName &&
                    enrollment.motherName !== "Não informado" && (
                      <div className="space-y-3 p-4 bg-pink-50 rounded-lg border border-pink-200">
                        <div className="text-sm font-semibold text-pink-900 flex items-center gap-2">
                          <UserCircle className="h-4 w-4" />
                          Mãe
                        </div>
                        <div className="space-y-2">
                          <div>
                            <div className="text-xs text-gray-600">Nome</div>
                            <div className="font-semibold text-gray-900">
                              {enrollment.motherName}
                            </div>
                          </div>
                          {enrollment.motherPhone &&
                            enrollment.motherPhone !== "Não informado" && (
                              <div>
                                <div className="text-xs text-gray-600">
                                  Telefone
                                </div>
                                <div className="font-semibold text-gray-900">
                                  {enrollment.motherPhone}
                                </div>
                              </div>
                            )}
                        </div>
                      </div>
                    )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Turmas Selecionadas */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-primary" />
                <CardTitle>Turmas Selecionadas</CardTitle>
              </div>
              <CardDescription>
                {enrollment.classes && enrollment.classes.length > 1
                  ? `${enrollment.classes.length} turmas selecionadas`
                  : "Informações sobre as turmas selecionadas"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(enrollment.classes && enrollment.classes.length > 0
                  ? enrollment.classes
                  : enrollment.class
                  ? [enrollment.class]
                  : []
                ).map((classItem: any, index: number) => (
                  <div
                    key={index}
                    className="p-5 bg-gradient-to-r from-primary/10 via-pink-50 to-primary/5 rounded-xl border-2 border-primary/20 hover:border-primary/40 transition-all shadow-sm hover:shadow-md"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="text-xs text-gray-500 mb-1 font-medium uppercase tracking-wide">
                          Turma {index + 1}
                        </div>
                        <div className="text-2xl font-bold text-primary mb-2">
                          {classItem?.code} - {classItem?.name}
                        </div>
                      </div>
                      {classItem?.subject && (
                        <Badge
                          variant="secondary"
                          className="ml-3 bg-primary/10 text-primary border-primary/20"
                        >
                          {classItem.subject.name}
                        </Badge>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                      {classItem?.dayOfWeek && (
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-600">
                            <span className="font-semibold">Dia:</span>{" "}
                            {classItem.dayOfWeek === "MONDAY" && "Segunda-feira"}
                            {classItem.dayOfWeek === "TUESDAY" && "Terça-feira"}
                            {classItem.dayOfWeek === "WEDNESDAY" &&
                              "Quarta-feira"}
                            {classItem.dayOfWeek === "THURSDAY" &&
                              "Quinta-feira"}
                            {classItem.dayOfWeek === "FRIDAY" && "Sexta-feira"}
                            {classItem.dayOfWeek === "SATURDAY" && "Sábado"}
                            {classItem.dayOfWeek === "SUNDAY" && "Domingo"}
                          </span>
                        </div>
                      )}

                      {classItem?.startTime && classItem?.endTime && (
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-600">
                            <span className="font-semibold">Horário:</span>{" "}
                            {classItem.startTime} às {classItem.endTime}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Plano e Pagamento */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                <CardTitle>Plano e Forma de Pagamento</CardTitle>
              </div>
              <CardDescription>
                Detalhes do plano escolhido e forma de pagamento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-pink-50 to-primary/10 rounded-lg border border-pink-200">
                  <div className="text-sm text-gray-600 mb-2">
                    Plano Escolhido
                  </div>
                  <div className="text-xl font-bold text-gray-900 mb-3">
                    {enrollment.plan?.name}
                  </div>
                  <div className="mt-3 pt-3 border-t border-pink-200">
                    <div className="text-sm text-gray-600 mb-1">
                      Forma de Pagamento
                    </div>
                    <div className="font-semibold text-gray-900 mb-2">
                      {enrollment.paymentMethod ? (
                        <>
                          {enrollment.paymentMethod === "CASH" && "À Vista"}
                          {enrollment.paymentMethod === "INSTALLMENT" &&
                            "Parcelado"}
                          {enrollment.paymentMethod === "BOLETO" && "Boleto"}
                          {enrollment.paymentMethod === "PIX" && "PIX"}
                          {enrollment.paymentMethod === "CREDIT_CARD" &&
                            "Cartão de Crédito"}
                        </>
                      ) : (
                        "A definir"
                      )}
                    </div>
                    <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-start gap-2">
                        <CreditCard className="h-5 w-5 text-yellow-700 mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="text-sm font-semibold text-yellow-900 mb-1">
                            Pagamento Presencial
                          </div>
                          <div className="text-sm text-yellow-800">
                            O pagamento deve ser realizado presencialmente na
                            nossa unidade durante a confirmação da matrícula.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Endereço da Unidade */}
          <Card className="mb-6 border-2 border-primary/20">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-pink-50">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                <CardTitle>Endereço da Unidade</CardTitle>
              </div>
              <CardDescription>
                Localização para confirmação presencial e pagamento
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="p-4 bg-white rounded-lg border border-primary/20">
                <div className="space-y-2">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 mb-1">
                        Rua F QD 159 LT 1. Sala 1
                      </div>
                      <div className="text-sm text-gray-700">
                        Parque Tremendão
                      </div>
                      <div className="text-sm text-gray-700">
                        Goiânia - Goiás
                      </div>
                      <div className="text-sm font-semibold text-primary mt-2">
                        CEP: 74.475-060
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Agendamento Presencial */}
          {enrollment.confirmationDate && (
            <Card className="mb-6 border-2 border-green-200 bg-green-50/50">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-green-700" />
                  <CardTitle>Agendamento Presencial</CardTitle>
                </div>
                <CardDescription>
                  Data e horário confirmados para confirmação presencial
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-white rounded-lg border border-green-200">
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                        <Calendar className="h-6 w-6 text-green-700" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm text-gray-600 mb-1">
                          Data e Horário
                        </div>
                        <div className="text-lg font-bold text-gray-900 mb-2">
                          {format(
                            new Date(enrollment.confirmationDate),
                            "EEEE, d 'de' MMMM 'de' yyyy, 'às' HH:mm",
                            {
                              locale: ptBR,
                            }
                          )}
                        </div>
                        {enrollment.confirmationShift && (
                          <div className="text-sm text-gray-700 mb-2">
                            <span className="font-semibold">Turno:</span>{" "}
                            {enrollment.confirmationShift === "MORNING" &&
                              "Manhã"}
                            {enrollment.confirmationShift === "AFTERNOON" &&
                              "Tarde"}
                            {enrollment.confirmationShift === "EVENING" &&
                              "Noite"}
                          </div>
                        )}
                        <div className="flex items-start gap-2 text-sm text-gray-600 mt-3">
                          <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <div>
                            <div className="font-semibold">Rua F QD 159 LT 1. Sala 1</div>
                            <div>Parque Tremendão, Goiânia - Goiás</div>
                            <div className="text-xs text-gray-500">CEP: 74.475-060</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {enrollment.confirmationNotes && (
                    <div className="p-4 bg-white rounded-lg border border-green-200">
                      <div className="text-sm text-gray-600 mb-2">
                        Observações
                      </div>
                      <div className="text-sm text-gray-900">
                        {enrollment.confirmationNotes}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Ações */}
          <div className="flex gap-4">
            <Button variant="outline" className="flex-1" asChild>
              <Link href="/aluno/editar">
                <Edit className="mr-2 h-4 w-4" />
                Atualizar dados básicos
              </Link>
            </Button>
            <Button className="flex-1" asChild>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="mr-2 h-4 w-4" />
                Falar no WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
