# 🔧 Correções de Erros Comuns

## Erro ao rodar `npm run dev`

### 1. Verificar se node_modules existe
```bash
# Se não existir, instalar dependências
npm install
```

### 2. Verificar se arquivo .env existe
Crie um arquivo `.env` na raiz com:
```env
DATABASE_URL="postgres://3e403e88be1d7b0f5c402d2ec9b4f82a97b7caec918e8e67793b363cff65cab5:sk_JGLG4TwRuMtwjqHsiS_gk@db.prisma.io:5432/postgres?sslmode=require&pool=true"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="qualquer-string-secreta-aqui"
GOOGLE_CLIENT_ID="seu-google-client-id-aqui"
GOOGLE_CLIENT_SECRET="seu-google-client-secret-aqui"
```

### 3. Gerar Prisma Client
```bash
npm run db:generate
```

### 4. Limpar cache do Next.js
```bash
# Deletar pasta .next
rm -rf .next
# ou no Windows:
rmdir /s .next

# Depois rodar novamente
npm run dev
```

### 5. Verificar versão do Node.js
```bash
node --version
# Deve ser 18 ou superior
```

### 6. Reinstalar dependências
```bash
# Deletar node_modules e package-lock.json
rm -rf node_modules package-lock.json
# ou no Windows:
rmdir /s node_modules
del package-lock.json

# Reinstalar
npm install
```

## Erros específicos

### "Cannot find module '@/lib/auth'"
- Verifique se o arquivo `lib/auth.ts` existe
- Verifique se o `tsconfig.json` tem `"@/*": ["./*"]` em paths

### "Prisma Client not generated"
```bash
npm run db:generate
```

### "NEXTAUTH_SECRET is not set"
- Adicione `NEXTAUTH_SECRET` no arquivo `.env`

### Erro de importação do date-fns
- Verifique se `date-fns` está instalado: `npm list date-fns`
- Se não estiver: `npm install date-fns`

