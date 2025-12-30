# Guia de Instalação - Redação Nota Mil

## Passo a Passo para Configuração

### 1. Instalar Dependências

```bash
npm install
```

### 2. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:

```env
# Database
DATABASE_URL="postgres://3e403e88be1d7b0f5c402d2ec9b4f82a97b7caec918e8e67793b363cff65cab5:sk_JGLG4TwRuMtwjqHsiS_gk@db.prisma.io:5432/postgres?sslmode=require&pool=true"

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=seu-secret-key-aqui-gerar-com-openssl-rand-base64-32

# Google OAuth
GOOGLE_CLIENT_ID=seu-google-client-id-aqui
GOOGLE_CLIENT_SECRET=seu-google-client-secret-aqui
```

**Importante:** Gere um `NEXTAUTH_SECRET` seguro usando:
```bash
openssl rand -base64 32
```

### 3. Configurar o Banco de Dados

```bash
# Gerar o cliente Prisma
npm run db:generate

# Criar as tabelas no banco
npm run db:push

# Popular o banco com dados iniciais (turmas, planos, matérias)
npm run db:seed
```

### 4. Iniciar o Servidor

```bash
npm run dev
```

Acesse: http://localhost:3000

## Estrutura de Dados Criada pelo Seed

### Matérias
- Redação (R$ 300,00)
- Exatas (R$ 350,00)
- Gramática (R$ 200,00)
- Matemática (R$ 200,00)

### Turmas - Ensino Médio
- EX1 - Exatas Integrado - Segunda-feira - 19:00 às 22:00
- G1 - Gramática Aplicada - Sexta-feira - 19:30 às 21:00
- M1 - Matemática Personalizada - Quarta-feira - 19:20 às 20:40
- R1 - Redação - Terça-feira - 18:00 às 19:30
- R2 - Redação - Quinta-feira - 18:00 às 19:30

### Turmas - Ensino Fundamental
- R5 - Redação - Sábado - 09:00 às 10:30
- R6 - Redação - Sábado - 11:00 às 12:30
- M2 - Matemática Personalizada - Quarta-feira - 19:20 às 20:40

### Planos
- Foco (1 módulo)
- Intensivo (2 módulos)
- Evolução (3 módulos)
- Aprovação 1 (4 módulos)
- Aprovação 2 (5 módulos)
- Nota 1000 (9 módulos)

## Criar Primeiro Usuário Admin

Para criar um usuário admin, você pode:

1. **Via código (temporário):**
   - Criar um script em `scripts/create-admin.ts`
   - Executar: `tsx scripts/create-admin.ts`

2. **Via Prisma Studio:**
   ```bash
   npm run db:studio
   ```
   - Acesse http://localhost:5555
   - Crie um usuário manualmente com `role: ADMIN`

3. **Via registro normal:**
   - Registre-se normalmente
   - Depois altere o `role` no banco para `ADMIN` ou `SECRETARY`

## Deploy na Vercel

1. Conecte seu repositório GitHub à Vercel
2. Configure as variáveis de ambiente na Vercel
3. Execute o build:
   ```bash
   npm run build
   ```
4. Configure o comando de seed no `package.json` para rodar após o deploy (opcional)

## Problemas Comuns

### Erro: "Prisma Client not generated"
```bash
npm run db:generate
```

### Erro: "Database connection failed"
- Verifique se a `DATABASE_URL` está correta
- Verifique se o banco está acessível
- Teste a conexão com `npm run db:studio`

### Erro: "NextAuth secret not set"
- Gere um secret: `openssl rand -base64 32`
- Adicione no `.env` como `NEXTAUTH_SECRET`

## Próximos Passos

1. ✅ Sistema está funcionando
2. ⏳ Criar primeiro usuário admin
3. ⏳ Testar fluxo completo de pré-matrícula
4. ⏳ Configurar domínio na Vercel
5. ⏳ Fazer deploy

