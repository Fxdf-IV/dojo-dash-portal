# 🥋 Dojo Dash Portal - Backend API

## ✨ Implementação Completa

Este projeto agora possui um **backend API completo** integrado com Vite!

---

## 🚀 Quick Start

```bash
# Instalar dependências (se ainda não fez)
npm install

# Iniciar servidor (frontend + backend)
npm run dev
```

Servidor roda em: **http://localhost:8080**

---

## 📚 Documentação

- **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)** - Referência completa de todas as rotas
- **[INTEGRACAO_FRONTEND.md](./INTEGRACAO_FRONTEND.md)** - Guia para conectar o frontend
- **[TESTES.sh](./TESTES.sh)** - Script automatizado de testes

---

## 🔑 Login de Teste

| Tipo  | Email              | Senha |
|-------|--------------------|-------|
| Admin | `adm@email.com`    | `1234`|
| Aluno | `aluno@email.com`  | `1234`|

---

## 🎯 Endpoints Principais

```http
GET    /api/health           # Health check
POST   /api/auth/login       # Login
POST   /api/auth/register    # Registro
GET    /api/students         # Listar alunos
GET    /api/materials        # Listar materiais
GET    /api/locations        # Listar locais
GET    /api/senseis          # Listar senseis
POST   /api/contacts         # Enviar contato
```

Ver documentação completa em [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

---

## 🏗️ Arquitetura

```
Vite Dev Server (porta 8080)
    ├── Frontend React (SPA)
    └── Express API (/api/*)
            ├── Rotas
            ├── Controllers
            └── Database (in-memory)
```

---

## 📁 Estrutura

```
dojo-dash-portal/
├── server/                    # 🆕 Backend
│   ├── index.ts              # Setup Express
│   ├── lib/
│   │   └── database.ts       # Database mock
│   └── routes/
│       ├── auth.ts
│       ├── students.ts
│       ├── materials.ts
│       ├── locations.ts
│       ├── senseis.ts
│       └── contacts.ts
├── src/                      # Frontend
├── vite.config.ts           # Config Vite + API
└── API_DOCUMENTATION.md     # Docs da API
```

---

## 🧪 Testar API

### Via curl:

```bash
# Health check
curl http://localhost:8080/api/health

# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"adm@email.com","password":"1234"}'

# Listar alunos
curl http://localhost:8080/api/students
```

### Via navegador:

1. Abra: http://localhost:8080
2. Faça login
3. Acesse o painel admin
4. Teste CRUD de alunos, materiais, etc.

---

## ⚠️ Notas Importantes

- **Dados em memória**: Dados são perdidos ao reiniciar
- **Sem Supabase**: API funciona standalone sem dependências externas
- **Mock tokens**: Autenticação simplificada para desenvolvimento
- **CORS habilitado**: Pronto para desenvolvimento local

---

## 🔄 Próximos Passos

Para colocar em produção:

1. **Substituir database mock por PostgreSQL/MySQL**
2. **Implementar JWT real** (jsonwebtoken)
3. **Hash de senhas** (bcrypt)
4. **Upload de arquivos** (multer)
5. **Rate limiting**
6. **Logging** (winston/pino)
7. **Validação** (zod/joi)

---

## 📦 Dependências Adicionadas

```json
{
  "dependencies": {
    "express": "^4.x",
    "cors": "^2.x",
    "dotenv": "^16.x"
  },
  "devDependencies": {
    "@types/express": "^4.x",
    "@types/cors": "^2.x"
  }
}
```

---

## 🎓 Aprendizado

Este setup demonstra:
- ✅ Integração Vite + Express
- ✅ API RESTful completa
- ✅ Autenticação básica
- ✅ CRUD operations
- ✅ Middleware customizado
- ✅ TypeScript full-stack

---

**Desenvolvido por:** Dojo Dash Portal
**Stack:** React + TypeScript + Vite + Express
