# 🔧 Solução de Erros - npm run dev

## Passos para resolver:

### 1. Verificar se tem node_modules
```bash
# Se a pasta node_modules não existir:
npm install
```

### 2. Criar arquivo .env.local
Crie um arquivo `.env.local` na raiz do projeto com:
```env
DATABASE_URL="postgres://3e403e88be1d7b0f5c402d2ec9b4f82a97b7caec918e8e67793b363cff65cab5:sk_JGLG4TwRuMtwjqHsiS_gk@db.prisma.io:5432/postgres?sslmode=require&pool=true"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="desenvolvimento-local-secret-key"
GOOGLE_CLIENT_ID="seu-google-client-id-aqui"
GOOGLE_CLIENT_SECRET="seu-google-client-secret-aqui"
```

### 3. Gerar Prisma Client
```bash
npm run db:generate
```

### 4. Limpar cache e tentar novamente
```bash
# Deletar pasta .next (se existir)
# No Windows PowerShell:
Remove-Item -Recurse -Force .next

# Depois rodar:
npm run dev
```

### 5. Se ainda der erro, reinstalar tudo
```bash
# Deletar node_modules e package-lock.json
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json

# Reinstalar
npm install

# Gerar Prisma
npm run db:generate

# Rodar
npm run dev
```

## Erros comuns e soluções:

### ❌ "Cannot find module '@/lib/auth'"
**Solução:** Verifique se o arquivo `lib/auth.ts` existe. Se não existir, crie-o.

### ❌ "Prisma Client not generated"
**Solução:** 
```bash
npm run db:generate
```

### ❌ "NEXTAUTH_SECRET is not set"
**Solução:** Adicione `NEXTAUTH_SECRET` no arquivo `.env.local`

### ❌ "Module not found: Can't resolve '@/components/ui/...'"
**Solução:** Verifique se todos os componentes em `components/ui/` existem

### ❌ Erro de TypeScript
**Solução:**
```bash
# Limpar cache do TypeScript
Remove-Item -Recurse -Force .next
npm run dev
```

## ⚡ Comando rápido (copie e cole):

```powershell
# No PowerShell:
npm install
npm run db:generate
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
npm run dev
```

## 📝 Se nada funcionar:

1. Verifique a versão do Node.js (deve ser 18+):
   ```bash
   node --version
   ```

2. Verifique se todas as dependências estão instaladas:
   ```bash
   npm list --depth=0
   ```

3. Tente com yarn:
   ```bash
   yarn install
   yarn dev
   ```

