# 🚀 Guia de Deploy no Vercel - Redação Nota Mil

## Pré-requisitos

1. Conta no [Vercel](https://vercel.com)
2. Repositório no GitHub (já configurado)
3. Banco de dados PostgreSQL acessível (Prisma Data Platform ou outro)

## Passo 1: Conectar Repositório

1. Acesse [vercel.com](https://vercel.com)
2. Clique em **"Add New Project"**
3. Importe o repositório: `joaodiasft/prematricularmil`
4. Configure o projeto:
   - **Framework Preset**: Next.js (detectado automaticamente)
   - **Root Directory**: `./` (raiz)
   - **Build Command**: `npm run build` (padrão)
   - **Output Directory**: `.next` (padrão)
   - **Install Command**: `npm install` (padrão)

## Passo 2: Configurar Variáveis de Ambiente

No painel do Vercel, vá em **Settings > Environment Variables** e adicione:

### Variáveis Obrigatórias

```env
DATABASE_URL=postgres://usuario:senha@host:5432/database?sslmode=require&pool=true
NEXTAUTH_URL=https://seu-projeto.vercel.app
NEXTAUTH_SECRET=seu-secret-gerado-com-openssl-rand-base64-32
GOOGLE_CLIENT_ID=seu-google-client-id
GOOGLE_CLIENT_SECRET=seu-google-client-secret
```

### Variáveis Opcionais

```env
APP_NAME=Redação Nota Mil
APP_PHONE=+5562981899570
APP_INSTAGRAM=@redacao.nota.1000
```

**Importante:**
- Marque todas as variáveis para **Production**, **Preview** e **Development**
- Para `NEXTAUTH_URL`, use a URL do seu projeto Vercel (será algo como `https://prematricularmil.vercel.app`)
- Gere um `NEXTAUTH_SECRET` único e seguro

## Passo 3: Configurar Google OAuth

1. Acesse [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Edite suas credenciais OAuth 2.0
3. Adicione nas **Authorized redirect URIs**:
   ```
   https://seu-projeto.vercel.app/api/auth/callback/google
   ```
4. Salve as alterações

## Passo 4: Configurar Build Settings

No Vercel, em **Settings > General**, verifique:

- **Node.js Version**: 18.x ou superior
- **Build Command**: `npm run build`
- **Install Command**: `npm install`

## Passo 5: Deploy

1. Após configurar tudo, clique em **Deploy**
2. O Vercel irá:
   - Instalar dependências
   - Executar `npm run build`
   - Fazer deploy da aplicação

## Passo 6: Executar Seed do Banco

Após o primeiro deploy, você precisa popular o banco de dados:

### Opção 1: Via Vercel CLI (Recomendado)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Fazer login
vercel login

# Executar seed
vercel env pull .env.local
npm run db:seed
```

### Opção 2: Via Script no Vercel

1. No Vercel, vá em **Settings > Functions**
2. Adicione um script de build que execute o seed:
   ```json
   {
     "scripts": {
       "postbuild": "npm run db:seed"
     }
   }
   ```

### Opção 3: Manualmente via Prisma Studio

```bash
# Conectar ao banco e executar seed manualmente
npm run db:studio
# Depois executar o seed via interface ou SQL
```

## Passo 7: Criar Usuário Admin

Após o deploy, crie um usuário admin:

1. Acesse a aplicação: `https://seu-projeto.vercel.app`
2. Registre um usuário normalmente
3. Conecte ao banco de dados e altere o `role` para `ADMIN`:
   ```sql
   UPDATE users SET role = 'ADMIN' WHERE email = 'seu-email@exemplo.com';
   ```
4. Ou use o script: `npm run create-admin`

## Configurações Adicionais

### Domínio Customizado

1. No Vercel, vá em **Settings > Domains**
2. Adicione seu domínio
3. Configure os DNS conforme instruções
4. Atualize `NEXTAUTH_URL` com o novo domínio

### Variáveis de Ambiente por Ambiente

No Vercel, você pode ter valores diferentes para:
- **Production**: Ambiente de produção
- **Preview**: Branches e PRs
- **Development**: Ambiente local

Configure cada uma separadamente se necessário.

## Troubleshooting

### Erro: "Prisma Client not generated"
- Adicione no `package.json`:
  ```json
  {
    "scripts": {
      "postinstall": "prisma generate"
    }
  }
  ```

### Erro: "Database connection failed"
- Verifique se `DATABASE_URL` está correta
- Verifique se o banco permite conexões externas
- Verifique firewall e IPs permitidos

### Erro: "NextAuth secret not set"
- Certifique-se de que `NEXTAUTH_SECRET` está configurado
- Use o mesmo secret em todos os ambientes

### Erro: "OAuth redirect_uri_mismatch"
- Adicione a URL do Vercel nas **Authorized redirect URIs** do Google
- Formato: `https://seu-projeto.vercel.app/api/auth/callback/google`

## Comandos Úteis

```bash
# Ver logs do deploy
vercel logs

# Fazer deploy manual
vercel --prod

# Ver variáveis de ambiente
vercel env ls

# Pull variáveis de ambiente localmente
vercel env pull .env.local
```

## Checklist Final

- [ ] Repositório conectado ao Vercel
- [ ] Todas as variáveis de ambiente configuradas
- [ ] Google OAuth configurado com URL do Vercel
- [ ] Build executado com sucesso
- [ ] Banco de dados populado (seed executado)
- [ ] Usuário admin criado
- [ ] Aplicação acessível e funcionando

## Suporte

Se encontrar problemas:
1. Verifique os logs no Vercel: **Deployments > [seu deploy] > Logs**
2. Verifique as variáveis de ambiente
3. Teste localmente com as mesmas variáveis
4. Consulte a documentação do [Vercel](https://vercel.com/docs) e [Next.js](https://nextjs.org/docs)




