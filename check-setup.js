// Script para verificar se tudo está configurado corretamente
const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando configuração do projeto...\n');

// Verificar node_modules
if (!fs.existsSync('node_modules')) {
  console.log('❌ node_modules não encontrado!');
  console.log('   Execute: npm install\n');
  process.exit(1);
} else {
  console.log('✅ node_modules encontrado');
}

// Verificar .env.local ou .env
if (!fs.existsSync('.env.local') && !fs.existsSync('.env')) {
  console.log('❌ Arquivo .env.local não encontrado!');
  console.log('   Crie um arquivo .env.local com as variáveis de ambiente\n');
  process.exit(1);
} else {
  console.log('✅ Arquivo .env encontrado');
}

// Verificar Prisma Client
if (!fs.existsSync('node_modules/.prisma')) {
  console.log('❌ Prisma Client não gerado!');
  console.log('   Execute: npm run db:generate\n');
  process.exit(1);
} else {
  console.log('✅ Prisma Client gerado');
}

// Verificar arquivos principais
const requiredFiles = [
  'app/layout.tsx',
  'lib/auth.ts',
  'lib/prisma.ts',
  'prisma/schema.prisma',
];

let allFilesExist = true;
requiredFiles.forEach(file => {
  if (!fs.existsSync(file)) {
    console.log(`❌ Arquivo ${file} não encontrado!`);
    allFilesExist = false;
  }
});

if (!allFilesExist) {
  process.exit(1);
}

console.log('✅ Todos os arquivos principais existem');
console.log('\n✅ Tudo parece estar configurado corretamente!');
console.log('   Execute: npm run dev\n');

