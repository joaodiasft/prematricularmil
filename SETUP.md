# 🚀 Guia Rápido de Setup

## 1. Instalar Dependências

```bash
npm install
```

## 2. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
DATABASE_URL="postgres://3e403e88be1d7b0f5c402d2ec9b4f82a97b7caec918e8e67793b363cff65cab5:sk_JGLG4TwRuMtwjqHsiS_gk@db.prisma.io:5432/postgres?sslmode=require&pool=true"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="gere-um-secret-aqui-com-openssl-rand-base64-32"
GOOGLE_CLIENT_ID="seu-google-client-id-aqui"
GOOGLE_CLIENT_SECRET="seu-google-client-secret-aqui"
```

**Para gerar NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

## 3. Configurar Banco de Dados

```bash
# Gerar cliente Prisma
npm run db:generate

# Criar tabelas
npm run db:push

# Popular com dados iniciais
npm run db:seed
```

## 4. Rodar o Projeto

```bash
npm run dev
```

Acesse: **http://localhost:3000**

## ✅ Pronto!

O sistema está funcionando. Você pode:

1. **Criar uma conta** em `/auth/register`
2. **Fazer login** em `/auth/login`
3. **Iniciar pré-matrícula** em `/pre-matricula`
4. **Acessar área do aluno** em `/aluno` (após fazer pré-matrícula)
5. **Acessar admin** em `/admin` (precisa de role ADMIN no banco)

## 🔧 Criar Usuário Admin

Para criar um usuário admin, você pode:

1. Registrar normalmente
2. Abrir Prisma Studio: `npm run db:studio`
3. Editar o usuário e mudar `role` para `ADMIN`

Ou criar diretamente no banco:

```sql
UPDATE users SET role = 'ADMIN' WHERE email = 'seu-email@exemplo.com';
```

## 📝 Estrutura Criada

- ✅ 4 Matérias (Redação, Exatas, Gramática, Matemática)
- ✅ 8 Turmas (5 Ensino Médio + 3 Ensino Fundamental)
- ✅ 6 Planos (Foco, Intensivo, Evolução, Aprovação 1, Aprovação 2, Nota 1000)
- ✅ Configurações do sistema

## 🐛 Problemas?

- **Erro de conexão com banco**: Verifique a `DATABASE_URL`
- **Erro NextAuth**: Verifique se `NEXTAUTH_SECRET` está configurado
- **Erro Prisma**: Execute `npm run db:generate` novamente

