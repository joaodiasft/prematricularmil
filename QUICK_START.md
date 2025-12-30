# ⚡ Início Rápido

## Passos para rodar AGORA:

### 1️⃣ Instalar
```bash
npm install
```

### 2️⃣ Criar arquivo `.env`
```bash
DATABASE_URL="postgres://3e403e88be1d7b0f5c402d2ec9b4f82a97b7caec918e8e67793b363cff65cab5:sk_JGLG4TwRuMtwjqHsiS_gk@db.prisma.io:5432/postgres?sslmode=require&pool=true"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="qualquer-string-secreta-aqui-mude-em-producao"
GOOGLE_CLIENT_ID="seu-google-client-id-aqui"
GOOGLE_CLIENT_SECRET="seu-google-client-secret-aqui"
```

### 3️⃣ Configurar banco
```bash
npm run db:generate
npm run db:push
npm run db:seed
```

### 4️⃣ Rodar
```bash
npm run dev
```

## ✅ Pronto! Acesse http://localhost:3000

### Primeiros passos:
1. Vá em `/auth/register` e crie uma conta
2. Faça login em `/auth/login`
3. Comece a pré-matrícula em `/pre-matricula`

### Para criar admin:
1. Registre um usuário
2. Execute: `npm run db:studio`
3. Edite o usuário e mude `role` para `ADMIN`
4. Acesse `/admin`

