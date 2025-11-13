# Setup MongoDB + JWT - Dojo Dash Portal

## ✅ Implementação Concluída

Este documento resume a implementação completa do backend com MongoDB e JWT.

## 🎯 O que foi implementado

### 1. Docker Compose
- ✅ MongoDB 7.0 configurado
- ✅ Porta 27017 exposta
- ✅ Credenciais: admin/admin123
- ✅ Banco de dados: dojo_dash

### 2. Models Mongoose
- ✅ `User` - Usuários com autenticação
  - Hash de senha com bcrypt
  - Roles: admin, student
  - Método comparePassword
- ✅ `Student` - Perfil de alunos
- ✅ `Material` - Materiais didáticos
- ✅ `Location` - Locais de treino
- ✅ `Sensei` - Instrutores
- ✅ `Contact` - Mensagens de contato

### 3. Autenticação JWT
- ✅ Geração de tokens JWT
- ✅ Verificação de tokens
- ✅ Middleware de autenticação
- ✅ Middleware de autorização (admin)
- ✅ Expiração de 7 dias

### 4. Rotas API
- ✅ `POST /api/auth/login` - Login com JWT real
- ✅ `POST /api/auth/register` - Registro de novos alunos
- ✅ `POST /api/auth/logout` - Logout
- ✅ `GET/POST/PUT/DELETE /api/students` - CRUD de alunos
- ✅ `GET/POST/PUT/DELETE /api/materials` - CRUD de materiais
- ✅ `GET/POST/PUT/DELETE /api/locations` - CRUD de locais
- ✅ `GET/POST/PUT/DELETE /api/senseis` - CRUD de senseis
- ✅ `GET/POST/PUT /api/contacts` - Mensagens de contato

### 5. Frontend
- ✅ `AuthContext` atualizado para usar API real
- ✅ Porta alterada de 3000 para 8080
- ✅ Remoção de mocks hardcoded

### 6. Limpeza
- ✅ Removida pasta `supabase/`
- ✅ Removida pasta `src/integrations/supabase/`
- ✅ Removido arquivo `server/lib/database.ts` (mock)
- ✅ Removido arquivo `server/lib/supabase.ts`

### 7. Script de Seed
- ✅ Popula banco com usuários iniciais
- ✅ Admin: `adm@email.com` / `1234`
- ✅ Aluno: `aluno@email.com` / `1234`

## 🚀 Como usar

### 1. Iniciar MongoDB

```bash
docker-compose up -d
```

### 2. Popular banco de dados

```bash
npm run seed
```

### 3. Iniciar servidor de desenvolvimento

```bash
npm run dev
```

Servidor estará em: http://localhost:8080

### 4. Testar autenticação

```bash
# Login Admin
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"adm@email.com","password":"1234"}'

# Login Aluno
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"aluno@email.com","password":"1234"}'
```

## 📋 Variáveis de Ambiente

Arquivo `.env` na raiz:

```env
# MongoDB
MONGODB_URI=mongodb://admin:admin123@localhost:27017/dojo_dash?authSource=admin

# JWT
JWT_SECRET=dojo-dash-jwt-secret-change-in-production-2024
JWT_EXPIRES_IN=7d

# Server
PORT=8080
NODE_ENV=development
```

## 🔐 Segurança Implementada

1. **Hash de Senhas**
   - bcrypt com salt rounds = 10
   - Senhas nunca retornadas em responses

2. **JWT Tokens**
   - HS256 algorithm
   - Expiração configurável
   - Armazenado em localStorage no frontend

3. **Validação**
   - Mongoose schema validation
   - Required fields
   - Email lowercase automático

## 📝 Credenciais de Teste

Após rodar `npm run seed`:

| Usuário          | Email             | Senha | Role    |
|------------------|-------------------|-------|---------|
| Administrador    | adm@email.com     | 1234  | admin   |
| Aluno Teste      | aluno@email.com   | 1234  | student |

## ✅ Testes Realizados

1. ✅ MongoDB conecta corretamente
2. ✅ Seed cria usuários com hash de senha
3. ✅ Login admin funciona
4. ✅ Login aluno funciona
5. ✅ Login com senha errada retorna erro
6. ✅ JWT é gerado e válido
7. ✅ Servidor Vite integra Express middleware
8. ✅ API responde em /api/* routes

## 🎨 Arquitetura

```
dojo-dash-portal/
├── server/
│   ├── models/          # Mongoose models
│   │   ├── User.ts
│   │   ├── Student.ts
│   │   ├── Material.ts
│   │   ├── Location.ts
│   │   ├── Sensei.ts
│   │   └── Contact.ts
│   ├── routes/          # Express routes
│   │   ├── auth.ts
│   │   ├── students.ts
│   │   ├── materials.ts
│   │   ├── locations.ts
│   │   ├── senseis.ts
│   │   └── contacts.ts
│   ├── config/
│   │   └── database.ts  # MongoDB connection
│   ├── utils/
│   │   └── jwt.ts       # JWT helpers
│   ├── middleware/
│   │   └── auth.ts      # Auth middleware
│   ├── scripts/
│   │   └── seed.ts      # Database seeder
│   └── index.ts         # Server setup
├── src/
│   └── contexts/
│       └── AuthContext.tsx  # Frontend auth
└── docker-compose.yml   # MongoDB container
```

## 🔄 Próximos Passos (Fase 2)

1. Conectar componentes frontend às APIs reais
2. Implementar proteção de rotas com JWT no frontend
3. Adicionar validações de formulário
4. Implementar refresh tokens
5. Adicionar rate limiting
6. Configurar CORS adequadamente
7. Adicionar logs estruturados
8. Implementar paginação nas listagens

## 📚 Documentação Adicional

- [API Documentation](./API_DOCUMENTATION.md)
- [Frontend Integration Guide](./INTEGRACAO_FRONTEND.md)
- [Environment Setup](../ENV_SETUP.md)

## 🐛 Troubleshooting

### MongoDB não conecta
```bash
# Verificar se container está rodando
docker ps

# Ver logs do MongoDB
docker logs dojo-mongodb

# Reiniciar container
docker-compose restart
```

### Seed falha
```bash
# Limpar banco e tentar novamente
docker-compose down -v
docker-compose up -d
npm run seed
```

### Servidor não inicia
```bash
# Verificar porta 8080
lsof -i :8080

# Matar processo na porta
kill -9 $(lsof -t -i:8080)
```

---

**Data de Implementação**: 30 de Outubro de 2025
**Status**: ✅ Completo e testado
