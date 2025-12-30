# 🔧 Correção do Login com Google

## Problemas comuns e soluções:

### 1. Verificar variáveis de ambiente

Certifique-se de que o arquivo `.env.local` tem:
```env
GOOGLE_CLIENT_ID="seu-google-client-id-aqui"
GOOGLE_CLIENT_SECRET="seu-google-client-secret-aqui"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="sua-chave-secreta"
```

### 2. Configurar URLs de redirecionamento no Google Console

No Google Cloud Console, adicione estas URLs autorizadas:
- `http://localhost:3000/api/auth/callback/google` (desenvolvimento)
- `https://seu-dominio.com/api/auth/callback/google` (produção)

### 3. Verificar se o Prisma está conectado

O erro pode ocorrer se o banco não estiver acessível:
```bash
npm run db:generate
npm run db:push
```

### 4. Reiniciar o servidor

Após alterar variáveis de ambiente:
```bash
# Parar o servidor (Ctrl+C)
# Iniciar novamente
npm run dev
```

## Erros específicos:

### "OAuth2Error: redirect_uri_mismatch"
- Adicione a URL de callback no Google Console
- Verifique se `NEXTAUTH_URL` está correto

### "Error creating user"
- Verifique se o banco está acessível
- Execute `npm run db:push` para criar as tabelas

### "Invalid client secret"
- Verifique se `GOOGLE_CLIENT_SECRET` está correto no `.env.local`
- Não deve ter espaços ou aspas extras

