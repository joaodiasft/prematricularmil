import { PrismaClient, SubjectType, EducationLevel, ClassShift, PlanType } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Iniciando seed do banco de dados...")

  // Criar Matérias
  console.log("📚 Criando matérias...")
  const redacao = await prisma.subject.upsert({
    where: { id: "redacao" },
    update: {},
    create: {
      id: "redacao",
      name: "Redação",
      type: SubjectType.REDACAO,
      price: 300.0,
      description: "Curso de redação para ENEM e vestibulares",
    },
  })

  const exatas = await prisma.subject.upsert({
    where: { id: "exatas" },
    update: {},
    create: {
      id: "exatas",
      name: "Exatas",
      type: SubjectType.EXATAS,
      price: 350.0,
      description: "Matemática, Física e Química integradas",
    },
  })

  const gramatica = await prisma.subject.upsert({
    where: { id: "gramatica" },
    update: {},
    create: {
      id: "gramatica",
      name: "Gramática",
      type: SubjectType.GRAMATICA,
      price: 200.0,
      description: "Gramática aplicada",
    },
  })

  const matematica = await prisma.subject.upsert({
    where: { id: "matematica" },
    update: {},
    create: {
      id: "matematica",
      name: "Matemática",
      type: SubjectType.MATEMATICA,
      price: 200.0,
      description: "Matemática personalizada",
    },
  })

  // Criar Turmas - Ensino Médio
  console.log("👥 Criando turmas do Ensino Médio...")
  const ex1 = await prisma.class.upsert({
    where: { code: "EX1" },
    update: {},
    create: {
      code: "EX1",
      name: "Exatas Integrado",
      subjectId: exatas.id,
      educationLevel: EducationLevel.HIGH_SCHOOL,
      dayOfWeek: "Segunda-feira",
      startTime: "19:00",
      endTime: "22:00",
      maxCapacity: 30,
      currentCapacity: 0,
      shift: ClassShift.NIGHT,
    },
  })

  const g1 = await prisma.class.upsert({
    where: { code: "G1" },
    update: {},
    create: {
      code: "G1",
      name: "Gramática Aplicada",
      subjectId: gramatica.id,
      educationLevel: EducationLevel.HIGH_SCHOOL,
      dayOfWeek: "Sexta-feira",
      startTime: "19:30",
      endTime: "21:00",
      maxCapacity: 30,
      currentCapacity: 0,
      shift: ClassShift.NIGHT,
    },
  })

  const m1 = await prisma.class.upsert({
    where: { code: "M1" },
    update: {},
    create: {
      code: "M1",
      name: "Matemática Personalizada",
      subjectId: matematica.id,
      educationLevel: EducationLevel.HIGH_SCHOOL,
      dayOfWeek: "Quarta-feira",
      startTime: "19:20",
      endTime: "20:40",
      maxCapacity: 30,
      currentCapacity: 0,
      shift: ClassShift.NIGHT,
    },
  })

  const r1 = await prisma.class.upsert({
    where: { code: "R1" },
    update: {},
    create: {
      code: "R1",
      name: "Redação",
      subjectId: redacao.id,
      educationLevel: EducationLevel.HIGH_SCHOOL,
      dayOfWeek: "Terça-feira",
      startTime: "18:00",
      endTime: "19:30",
      maxCapacity: 30,
      currentCapacity: 0,
      shift: ClassShift.NIGHT,
    },
  })

  const r2 = await prisma.class.upsert({
    where: { code: "R2" },
    update: {},
    create: {
      code: "R2",
      name: "Redação",
      subjectId: redacao.id,
      educationLevel: EducationLevel.HIGH_SCHOOL,
      dayOfWeek: "Quinta-feira",
      startTime: "18:00",
      endTime: "19:30",
      maxCapacity: 30,
      currentCapacity: 0,
      shift: ClassShift.NIGHT,
    },
  })

  // Criar Turmas - Ensino Fundamental
  console.log("👥 Criando turmas do Ensino Fundamental...")
  const r5 = await prisma.class.upsert({
    where: { code: "R5" },
    update: {},
    create: {
      code: "R5",
      name: "Redação",
      subjectId: redacao.id,
      educationLevel: EducationLevel.MIDDLE_SCHOOL,
      dayOfWeek: "Sábado",
      startTime: "09:00",
      endTime: "10:30",
      maxCapacity: 30,
      currentCapacity: 0,
      shift: ClassShift.MORNING,
    },
  })

  const r6 = await prisma.class.upsert({
    where: { code: "R6" },
    update: {},
    create: {
      code: "R6",
      name: "Redação",
      subjectId: redacao.id,
      educationLevel: EducationLevel.MIDDLE_SCHOOL,
      dayOfWeek: "Sábado",
      startTime: "11:00",
      endTime: "12:30",
      maxCapacity: 30,
      currentCapacity: 0,
      shift: ClassShift.MORNING,
    },
  })

  const m2 = await prisma.class.upsert({
    where: { code: "M2" },
    update: {},
    create: {
      code: "M2",
      name: "Matemática Personalizada",
      subjectId: matematica.id,
      educationLevel: EducationLevel.MIDDLE_SCHOOL,
      dayOfWeek: "Quarta-feira",
      startTime: "19:20",
      endTime: "20:40",
      maxCapacity: 30,
      currentCapacity: 0,
      shift: ClassShift.NIGHT,
    },
  })

  // Criar Planos
  console.log("💳 Criando planos...")
  const planoFoco = await prisma.plan.upsert({
    where: { id: "foco" },
    update: {},
    create: {
      id: "foco",
      name: "Foco",
      type: PlanType.FOCO,
      modules: 1,
      description: "Essencial para começar",
    },
  })

  const planoIntensivo = await prisma.plan.upsert({
    where: { id: "intensivo" },
    update: {},
    create: {
      id: "intensivo",
      name: "Intensivo",
      type: PlanType.INTENSIVO,
      modules: 2,
      description: "Mais prática escrita",
    },
  })

  const planoEvolucao = await prisma.plan.upsert({
    where: { id: "evolucao" },
    update: {},
    create: {
      id: "evolucao",
      name: "Evolução",
      type: PlanType.EVOLUCAO,
      modules: 3,
      description: "Equilíbrio ideal",
    },
  })

  const planoAprovacao1 = await prisma.plan.upsert({
    where: { id: "aprovacao1" },
    update: {},
    create: {
      id: "aprovacao1",
      name: "Aprovação 1",
      type: PlanType.APROVACAO_1,
      modules: 4,
      description: "O favorito dos alunos",
    },
  })

  const planoAprovacao2 = await prisma.plan.upsert({
    where: { id: "aprovacao2" },
    update: {},
    create: {
      id: "aprovacao2",
      name: "Aprovação 2",
      type: PlanType.APROVACAO_2,
      modules: 5,
      description: "O favorito dos alunos",
    },
  })

  const planoNota1000 = await prisma.plan.upsert({
    where: { id: "nota1000" },
    update: {},
    create: {
      id: "nota1000",
      name: "Nota 1000",
      type: PlanType.NOTA_1000,
      modules: 9,
      description: "Acompanhamento VIP",
    },
  })

  // Criar configurações do sistema
  console.log("⚙️ Criando configurações do sistema...")
  await prisma.systemConfig.upsert({
    where: { key: "success_message" },
    update: {},
    create: {
      key: "success_message",
      value: "Parabéns! Sua pré-matrícula foi realizada com sucesso.\nPara confirmar sua vaga, é necessário comparecer presencialmente na unidade do curso levando:\n- Documento de Identidade (RG)\n- CPF\n- Comprovante de Residência",
      description: "Mensagem exibida na tela de sucesso",
    },
  })

  await prisma.systemConfig.upsert({
    where: { key: "whatsapp_message" },
    update: {},
    create: {
      key: "whatsapp_message",
      value: "Olá {nome_aluno}, tudo bem? Aqui é da secretaria do Redação Nota Mil. Recebemos sua pré-matrícula e gostaríamos de confirmar alguns dados. Podemos falar agora?",
      description: "Mensagem padrão do WhatsApp",
    },
  })

  await prisma.systemConfig.upsert({
    where: { key: "scheduling_start_date" },
    update: {},
    create: {
      key: "scheduling_start_date",
      value: "2026-01-05",
      description: "Data inicial para agendamento",
    },
  })

  await prisma.systemConfig.upsert({
    where: { key: "max_vacancies_per_slot" },
    update: {},
    create: {
      key: "max_vacancies_per_slot",
      value: "15",
      description: "Limite de vagas por horário",
    },
  })

  console.log("✅ Seed concluído com sucesso!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

