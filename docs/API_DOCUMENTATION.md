# 🥋 Dojo Dash Portal - API Documentation

## ✅ Status: IMPLEMENTADO E FUNCIONANDO

Backend API integrado com Vite usando Express em modo middleware.

---

## 🚀 Como Iniciar

```bash
npm run dev
```

O servidor inicia em: **http://localhost:8080**

---

## 🔑 Credenciais de Teste

### Admin
- **Email:** `adm@email.com`
- **Senha:** `1234`

### Aluno
- **Email:** `aluno@email.com`
- **Senha:** `1234`

---

## 📍 Endpoints Disponíveis

### **1. Health Check**
```http
GET /api/health
```

**Resposta:**
```json
{
  "status": "ok",
  "timestamp": "2025-10-29T23:50:35.075Z"
}
```

---

### **2. Autenticação**

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "adm@email.com",
  "password": "1234"
}
```

**Resposta:**
```json
{
  "user": {
    "id": "1",
    "name": "Administrador",
    "email": "adm@email.com",
    "role": "admin"
  },
  "token": "mock-token-1-1761781843393"
}
```

#### Registro
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "Novo Aluno",
  "email": "novo@email.com",
  "password": "senha123",
  "location": "CT Maylson Campos"
}
```

#### Logout
```http
POST /api/auth/logout
```

---

### **3. Alunos (Students)**

#### Listar todos
```http
GET /api/students
GET /api/students?status=active
GET /api/students?location=CT%20Maylson%20Campos
```

#### Buscar por ID
```http
GET /api/students/:id
```

#### Criar aluno
```http
POST /api/students
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao@email.com",
  "kyu": 9,
  "location": "CT Maylson Campos",
  "status": "pending"
}
```

#### Atualizar aluno
```http
PUT /api/students/:id
Content-Type: application/json

{
  "name": "João Silva Jr",
  "kyu": 8,
  "status": "active"
}
```

#### Deletar aluno
```http
DELETE /api/students/:id
```

---

### **4. Materiais (Materials)**

#### Listar todos
```http
GET /api/materials
GET /api/materials?type=kihon
GET /api/materials?min_kyu=6
```

#### Buscar por ID
```http
GET /api/materials/:id
```

#### Criar material
```http
POST /api/materials
Content-Type: application/json

{
  "title": "Gedan Barai",
  "type": "kihon",
  "description": "Bloco baixo",
  "content": "Descrição detalhada...",
  "video_url": "https://youtube.com/...",
  "image_url": "https://...",
  "min_kyu": 9
}
```

#### Atualizar material
```http
PUT /api/materials/:id
```

#### Deletar material
```http
DELETE /api/materials/:id
```

---

### **5. Locais (Locations)**

#### Listar todos
```http
GET /api/locations
```

**Resposta:**
```json
{
  "locations": [
    {
      "id": "1",
      "name": "CT Maylson Campos",
      "description": "Centro de treinamento principal",
      "created_at": "...",
      "updated_at": "...",
      "images": []
    }
  ]
}
```

#### Buscar por ID
```http
GET /api/locations/:id
```

#### Criar local
```http
POST /api/locations
Content-Type: application/json

{
  "name": "Novo Dojo",
  "description": "Descrição do local",
  "image_url": "https://..."
}
```

#### Atualizar local
```http
PUT /api/locations/:id
```

#### Deletar local
```http
DELETE /api/locations/:id
```

#### Adicionar imagem ao local
```http
POST /api/locations/:id/images
Content-Type: application/json

{
  "image_url": "https://...",
  "caption": "Descrição da foto"
}
```

#### Deletar imagem
```http
DELETE /api/locations/images/:imageId
```

---

### **6. Senseis**

#### Listar todos
```http
GET /api/senseis
```

#### Buscar por ID
```http
GET /api/senseis/:id
```

#### Criar sensei
```http
POST /api/senseis
Content-Type: application/json

{
  "name": "Sensei Novo",
  "rank": "3º Dan - Faixa Preta",
  "description": "Especialista em...",
  "image_url": "https://...",
  "order_index": 3
}
```

#### Atualizar sensei
```http
PUT /api/senseis/:id
```

#### Deletar sensei
```http
DELETE /api/senseis/:id
```

---

### **7. Contatos (Contacts)**

```http
POST /api/contacts
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao@email.com",
  "phone": "(18) 99999-9999",
  "message": "Quero começar a treinar!"
}
```

**Resposta:**
```json
{
  "success": true,
  "message": "Mensagem recebida! Entraremos em contato em breve."
}
```

---

## 🧪 Testes Realizados

✅ Health check
✅ Login admin
✅ Login aluno
✅ Listar students
✅ Criar student
✅ Atualizar student
✅ Listar materials
✅ Listar locations (com images)
✅ Listar senseis
✅ Formulário de contato

---

## 📂 Estrutura do Projeto

```
dojo-dash-portal/
├── server/
│   ├── index.ts              # Setup do servidor Express
│   ├── lib/
│   │   └── database.ts       # Banco em memória (mock)
│   └── routes/
│       ├── auth.ts           # Autenticação
│       ├── students.ts       # CRUD de alunos
│       ├── materials.ts      # CRUD de materiais
│       ├── locations.ts      # CRUD de locais + imagens
│       ├── senseis.ts        # CRUD de senseis
│       └── contacts.ts       # Formulário de contato
├── src/                      # Frontend React
└── vite.config.ts            # Configuração Vite + API
```

---

## 🔄 Próximos Passos

### Para usar banco de dados real:

1. **Substituir `server/lib/database.ts` por conexão real**
   - PostgreSQL com `pg` ou `prisma`
   - MySQL com `mysql2`
   - SQLite com `better-sqlite3`

2. **Adicionar autenticação JWT real**
   ```bash
   npm install jsonwebtoken bcrypt
   npm install -D @types/jsonwebtoken @types/bcrypt
   ```

3. **Adicionar middleware de autenticação**
   ```typescript
   // server/middleware/auth.ts
   import jwt from 'jsonwebtoken';

   export function requireAuth(req, res, next) {
     const token = req.headers.authorization?.replace('Bearer ', '');
     if (!token) return res.status(401).json({ error: 'Não autorizado' });

     try {
       const decoded = jwt.verify(token, process.env.JWT_SECRET!);
       req.user = decoded;
       next();
     } catch (error) {
       res.status(401).json({ error: 'Token inválido' });
     }
   }
   ```

4. **Adicionar upload de arquivos**
   ```bash
   npm install multer
   npm install -D @types/multer
   ```

---

## 📝 Notas Importantes

⚠️ **Dados em memória**: Os dados são perdidos quando o servidor reinicia.
⚠️ **Senhas em texto plano**: Em produção, use bcrypt para hash de senhas.
⚠️ **Token mock**: Em produção, use JWT real com expiração.
⚠️ **CORS**: Ajuste para produção conforme necessário.

---

## 🎯 Testando no Frontend

Para usar a API no seu frontend React, substitua os mocks por chamadas reais:

```typescript
// Exemplo: src/contexts/AuthContext.tsx
const login = async (email: string, password: string) => {
  const response = await fetch('http://localhost:8080/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error('Credenciais inválidas');
  }

  const data = await response.json();
  setToken(data.token);
  setUser(data.user);

  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify(data.user));
};
```

---

## 🐛 Logs do Servidor

Todos os requests da API são logados no console:

```
[API] POST /api/auth/login
[API] GET /api/students
[API] PUT /api/students/100
```

---

Desenvolvido com ❤️ para Alessandro Karatê e Kobudo
