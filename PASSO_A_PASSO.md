# 🚀 Passo a Passo - Resolver Erro npm run dev

## ⚠️ IMPORTANTE: Siga na ordem!

### Passo 1: Criar arquivo .env.local

Crie um arquivo chamado `.env.local` na raiz do projeto (mesma pasta do package.json) com este conteúdo:

```env
DATABASE_URL="postgres://3e403e88be1d7b0f5c402d2ec9b4f82a97b7caec918e8e67793b363cff65cab5:sk_JGLG4TwRuMtwjqHsiS_gk@db.prisma.io:5432/postgres?sslmode=require&pool=true"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="desenvolvimento-local-secret-key"
GOOGLE_CLIENT_ID="seu-google-client-id-aqui"
GOOGLE_CLIENT_SECRET="seu-google-client-secret-aqui"
```

### Passo 2: Instalar dependências

```bash
npm install
```

Aguarde terminar completamente.

### Passo 3: Gerar Prisma Client

```bash
npm run db:generate
```

### Passo 4: Verificar configuração

```bash
npm run check
```

Este comando vai verificar se tudo está ok.

### Passo 5: Limpar cache (se necessário)

No PowerShell:

```powershell
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
```

### Passo 6: Rodar o projeto

```bash
npm run dev
```

## 🔧 Se ainda der erro:

### Opção A: Setup completo automático

```bash
npm run setup
```

### Opção B: Reinstalar tudo

```powershell
# Deletar node_modules e cache
Remove-Item -Recurse -Force node_modules
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
Remove-Item package-lock.json -ErrorAction SilentlyContinue

# Reinstalar
npm install

# Gerar Prisma
npm run db:generate

# Rodar
npm run dev
```

## 📋 Checklist

Antes de rodar `npm run dev`, verifique:

- [ ] Arquivo `.env.local` existe na raiz
- [ ] Pasta `node_modules` existe
- [ ] Pasta `node_modules/.prisma` existe (gerado pelo `db:generate`)
- [ ] Node.js versão 18 ou superior (`node --version`)

## ❓ Qual erro você está vendo?

Se puder, copie e cole a mensagem de erro completa aqui para eu ajudar melhor!
