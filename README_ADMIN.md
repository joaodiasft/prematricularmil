# Login Administrativo

## Como criar o primeiro usuário admin

### Opção 1: Usando o script automatizado (Recomendado)

Execute o comando:

```bash
npm run create-admin
```

O script irá solicitar:
- Email do admin
- Nome do admin
- Senha

### Opção 2: Usando Prisma Studio

1. Execute:
```bash
npm run db:studio
```

2. Abra a tabela `User`
3. Clique em "Add record"
4. Preencha:
   - `email`: email do admin
   - `name`: nome do admin
   - `password`: senha criptografada (use bcrypt ou o script)
   - `role`: `ADMIN` ou `SECRETARY`
   - `emailVerified`: data atual

### Opção 3: Usando SQL direto no banco

```sql
-- Substitua os valores abaixo
INSERT INTO users (id, email, name, password, role, "emailVerified", "createdAt", "updatedAt")
VALUES (
  gen_random_uuid()::text,
  'admin@exemplo.com',
  'Administrador',
  '$2a$10$...', -- Hash bcrypt da senha (use o script para gerar)
  'ADMIN',
  NOW(),
  NOW(),
  NOW()
);
```

## Acessar o login admin

1. Acesse: `http://localhost:3000/auth/admin/login`
2. Digite o email e senha do usuário admin criado
3. Você será redirecionado para `/admin` (dashboard administrativo)

## Segurança

- Apenas usuários com role `ADMIN` ou `SECRETARY` podem acessar `/admin`
- O middleware protege todas as rotas administrativas
- Tentativas de login não-admin são bloqueadas automaticamente

## Script de criação de admin

O script `scripts/create-admin.js` permite criar ou atualizar usuários admin de forma segura:

```bash
npm run create-admin
```

O script:
- Verifica se o email já existe
- Permite atualizar usuários existentes para admin
- Criptografa a senha automaticamente
- Valida os dados antes de criar

