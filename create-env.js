const fs = require('fs');
const path = require('path');

const envContent = `# Database
DATABASE_URL="postgres://usuario:senha@host:5432/database?sslmode=require&pool=true"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="gere-um-secret-seguro-com-openssl-rand-base64-32"

# Google OAuth
GOOGLE_CLIENT_ID="seu-google-client-id-aqui"
GOOGLE_CLIENT_SECRET="seu-google-client-secret-aqui"

# App Info (opcional)
APP_NAME="Redação Nota Mil"
APP_PHONE="+5562981899570"
APP_INSTAGRAM="@redacao.nota.1000"
`;

try {
  // Criar .env (Prisma precisa deste)
  fs.writeFileSync('.env', envContent);
  console.log('✅ Arquivo .env criado com sucesso!');
  
  // Criar .env.local também (Next.js usa este)
  fs.writeFileSync('.env.local', envContent);
  console.log('✅ Arquivo .env.local criado com sucesso!');
} catch (error) {
  console.error('❌ Erro ao criar arquivo .env:', error.message);
  console.log('\n📝 Copie o conteúdo abaixo e crie manualmente um arquivo .env:\n');
  console.log(envContent);
  process.exit(1);
}

