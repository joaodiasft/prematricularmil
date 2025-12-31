# 🔧 Como Corrigir o Erro "redirect_uri_mismatch" no Login Google

## ⚠️ Erro: `redirect_uri_mismatch`

Este erro acontece quando a URL de callback não está configurada corretamente no Google Cloud Console.

## 📋 Passo a Passo para Corrigir

### 1️⃣ Verificar sua URL atual

Primeiro, descubra qual URL você está usando:

**Desenvolvimento Local:**

- URL: `http://localhost:3000`
- Callback: `http://localhost:3000/api/auth/callback/google`

**Produção (Vercel):**

- URL: `https://seu-projeto.vercel.app` (substitua pelo seu domínio)
- Callback: `https://seu-projeto.vercel.app/api/auth/callback/google`

### 2️⃣ Acessar Google Cloud Console

1. Acesse: https://console.cloud.google.com/
2. Selecione seu projeto (ou crie um novo)
3. Vá em **"APIs & Services"** > **"Credentials"** (ou "Credenciais")

### 3️⃣ Encontrar suas Credenciais OAuth

1. Na lista de credenciais, encontre seu **"OAuth 2.0 Client ID"**
2. Clique no nome da credencial para editar

### 4️⃣ Adicionar URLs de Redirecionamento

Na seção **"Authorized redirect URIs"**, adicione TODAS as URLs abaixo:

#### Para Desenvolvimento Local:

```
http://localhost:3000/api/auth/callback/google
```

#### Para Produção (Vercel):

```
https://seu-projeto.vercel.app/api/auth/callback/google
```

**⚠️ IMPORTANTE:**

- Adicione **AMBAS** as URLs (desenvolvimento E produção)
- Use **exatamente** essas URLs (com `/api/auth/callback/google` no final)
- Não adicione barra `/` no final
- Use `http://` para localhost e `https://` para produção

### 5️⃣ Salvar Alterações

1. Clique em **"SAVE"** (Salvar) no final da página
2. Aguarde alguns segundos para as alterações serem aplicadas

### 6️⃣ Verificar Variáveis de Ambiente

Certifique-se de que seu arquivo `.env.local` (ou `.env`) tem:

```env
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=seu-client-id-aqui
GOOGLE_CLIENT_SECRET=seu-client-secret-aqui
```

**Para produção no Vercel:**

- Configure `NEXTAUTH_URL` com a URL do seu projeto Vercel
- Exemplo: `NEXTAUTH_URL=https://prematricularmil.vercel.app`

### 7️⃣ Reiniciar o Servidor

Após fazer as alterações:

```bash
# Parar o servidor (Ctrl+C)
# Iniciar novamente
npm run dev
```

### 8️⃣ Testar Novamente

1. Acesse: http://localhost:3000/auth/login
2. Clique em "Continuar com Google"
3. O login deve funcionar agora!

## 🔍 Verificações Adicionais

### Verificar se as URLs estão corretas:

**No Google Console, você deve ver:**

```
✅ http://localhost:3000/api/auth/callback/google
✅ https://seu-projeto.vercel.app/api/auth/callback/google
```

**No seu `.env.local`:**

```env
✅ NEXTAUTH_URL=http://localhost:3000
✅ GOOGLE_CLIENT_ID=632224807582-...
✅ GOOGLE_CLIENT_SECRET=GOCSPX-...
```

### Erros Comuns:

❌ **URL com barra no final:**

```
http://localhost:3000/api/auth/callback/google/  ← ERRADO
```

✅ **URL correta:**

```
http://localhost:3000/api/auth/callback/google  ← CORRETO
```

❌ **URL sem o caminho completo:**

```
http://localhost:3000  ← ERRADO
```

✅ **URL correta:**

```
http://localhost:3000/api/auth/callback/google  ← CORRETO
```

## 🚀 Para Produção (Vercel)

Se você está fazendo deploy no Vercel:

1. **Configure no Google Console:**

   - Adicione: `https://seu-projeto.vercel.app/api/auth/callback/google`
   - Substitua `seu-projeto` pelo nome real do seu projeto

2. **Configure no Vercel:**

   - Vá em **Settings > Environment Variables**
   - Adicione: `NEXTAUTH_URL=https://seu-projeto.vercel.app`
   - Adicione: `GOOGLE_CLIENT_ID` e `GOOGLE_CLIENT_SECRET`

3. **Faça um novo deploy:**
   - O Vercel irá usar as novas variáveis de ambiente

## 📞 Ainda com Problemas?

Se ainda não funcionar:

1. **Verifique o console do navegador (F12):**

   - Veja se há erros adicionais

2. **Verifique os logs do servidor:**

   - Veja se há erros no terminal onde o `npm run dev` está rodando

3. **Aguarde alguns minutos:**

   - As alterações no Google Console podem levar alguns minutos para serem aplicadas

4. **Limpe o cache do navegador:**
   - Tente em uma janela anônima/privada

## ✅ Checklist Final

- [ ] URLs adicionadas no Google Console
- [ ] URLs salvas no Google Console
- [ ] `.env.local` configurado corretamente
- [ ] Servidor reiniciado
- [ ] Testado em navegador anônimo
