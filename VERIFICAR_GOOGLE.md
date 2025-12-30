# ✅ Checklist - Login com Google

## Passos para verificar:

### 1. Verificar arquivo .env.local
```bash
# Certifique-se de que existe e tem:
cat .env.local
# ou no Windows:
type .env.local
```

Deve conter:
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`

### 2. Verificar Google Cloud Console

1. Acesse: https://console.cloud.google.com/
2. Vá em "APIs & Services" > "Credentials"
3. Encontre seu OAuth 2.0 Client ID
4. Em "Authorized redirect URIs", adicione:
   ```
   http://localhost:3000/api/auth/callback/google
   ```

### 3. Reiniciar servidor
```bash
# Parar (Ctrl+C) e iniciar novamente
npm run dev
```

### 4. Testar login
- Acesse: http://localhost:3000/auth/login
- Clique em "Continuar com Google"
- Verifique o console do navegador (F12) para erros

## Erros comuns:

### "redirect_uri_mismatch"
**Solução:** Adicione a URL de callback no Google Console

### "Invalid client"
**Solução:** Verifique se GOOGLE_CLIENT_ID e GOOGLE_CLIENT_SECRET estão corretos

### "Database error"
**Solução:** 
```bash
npm run db:push
npm run db:generate
```

