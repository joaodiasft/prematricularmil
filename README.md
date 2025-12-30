# Redação Nota Mil - Sistema de Pré-Matrícula

Sistema completo de pré-matrícula desenvolvido com Next.js 14, Prisma, e shadcn/ui.

## 🚀 Tecnologias

- **Next.js 14** - Framework React
- **Prisma** - ORM para banco de dados
- **PostgreSQL** - Banco de dados
- **NextAuth.js** - Autenticação
- **shadcn/ui** - Componentes UI
- **Tailwind CSS** - Estilização
- **TypeScript** - Tipagem estática

## 📋 Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- Conta no Prisma Data Platform (ou PostgreSQL local)

## 🔧 Instalação

1. Clone o repositório:
```bash
git clone <seu-repositorio>
cd prematricularedas
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas credenciais:
```env
DATABASE_URL="sua-url-do-banco"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="seu-secret-key"
GOOGLE_CLIENT_ID="seu-google-client-id"
GOOGLE_CLIENT_SECRET="seu-google-client-secret"
```

4. Configure o banco de dados:
```bash
# Gerar o cliente Prisma
npm run db:generate

# Criar as tabelas no banco
npm run db:push

# Popular o banco com dados iniciais
npm run db:seed
```

5. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

## 📁 Estrutura do Projeto

```
├── app/
│   ├── api/              # Rotas da API
│   ├── auth/             # Páginas de autenticação
│   ├── pre-matricula/    # Wizard de pré-matrícula
│   ├── aluno/            # Área do aluno
│   ├── admin/            # Painel administrativo
│   └── page.tsx          # Página inicial
├── components/
│   └── ui/               # Componentes shadcn/ui
├── lib/                  # Utilitários
├── prisma/
│   ├── schema.prisma     # Schema do banco
│   └── seed.ts           # Script de seed
└── types/                # Tipos TypeScript
```

## 🎯 Funcionalidades

### Fase 1 - Autenticação
- ✅ Login com email/senha
- ✅ Login com Google OAuth
- ✅ Registro de novos usuários
- ✅ Recuperação de senha (estrutura criada)

### Fase 2-8 - Wizard de Pré-Matrícula
- ✅ Etapa 2: Dados básicos do aluno
- ✅ Etapa 3: Dados dos responsáveis (opcional)
- ✅ Etapa 4: Escolha de curso e turma
- ✅ Etapa 5: Plano e forma de pagamento
- ✅ Etapa 6: Agendamento presencial
- ✅ Etapa 7: Revisão e confirmação
- ✅ Etapa 8: Tela de sucesso com token

### Área do Aluno
- ✅ Visualização do status da pré-matrícula
- ✅ Timeline de progresso
- ✅ Detalhes da inscrição
- ✅ Token de acesso
- ✅ Link para WhatsApp

### Área Admin (Estrutura criada)
- 📋 Dashboard com métricas
- 📋 Listagem de pré-matrículas
- 📋 Gestão de turmas
- 📋 Configurações do sistema

## 🗄️ Banco de Dados

O banco de dados está configurado com as seguintes entidades principais:

- **User** - Usuários do sistema
- **PreEnrollment** - Pré-matrículas
- **Class** - Turmas disponíveis
- **Subject** - Matérias oferecidas
- **Plan** - Planos de pagamento
- **SystemConfig** - Configurações do sistema

## 📝 Dados Iniciais

O script de seed cria:
- 4 matérias (Redação, Exatas, Gramática, Matemática)
- 8 turmas (5 Ensino Médio + 3 Ensino Fundamental)
- 6 planos (Foco, Intensivo, Evolução, Aprovação 1, Aprovação 2, Nota 1000)
- Configurações padrão do sistema

## 🔐 Autenticação

O sistema suporta:
- Autenticação por email/senha
- Autenticação via Google OAuth
- Sessões JWT
- Proteção de rotas

## 🎨 Componentes UI

Todos os componentes seguem o padrão shadcn/ui e estão localizados em `components/ui/`.

## 📱 Responsividade

O sistema é totalmente responsivo e funciona em:
- Desktop
- Tablet
- Mobile

## 🚀 Deploy

### Vercel

1. Conecte seu repositório à Vercel
2. Configure as variáveis de ambiente
3. O deploy será automático

### Variáveis de Ambiente Necessárias:
- `DATABASE_URL`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`

## 📞 Contato

- **Telefone:** +55 62 98189-9570
- **Instagram:** @redacao.nota.1000

## 📄 Licença

Este projeto é privado e de uso exclusivo da Redação Nota Mil.

