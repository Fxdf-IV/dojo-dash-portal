# 🥋 Dojo Dash Portal

Portal completo para gerenciamento de dojo de karatê com backend API integrado.

## 🚀 Quick Start

```bash
npm install
npm run seed
npm run dev
```

Servidor roda em: **http://localhost:8080**

## 🔑 Login de Teste

| Tipo  | Email              | Senha |
|-------|--------------------|-------|
| Admin | `adm@email.com`    | `1234`|
| Aluno | `aluno@email.com`  | `1234`|

## 📚 Documentação

- **[API Documentation](./docs/API_DOCUMENTATION.md)** - Referência completa da API
- **[Integração Frontend](./docs/INTEGRACAO_FRONTEND.md)** - Guia de integração
- **[Quick Start API](./docs/README_API.md)** - Visão geral rápida
- **[Testes](./docs/TESTES.sh)** - Script automatizado de testes

## Como editar este código?

### Requisitos

- Node.js & npm instalados - [instalar com nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

### Passos para desenvolvimento local

```sh
# Step 1: Clone o repositório
git clone <YOUR_GIT_URL>

# Step 2: Navegue até o diretório do projeto
cd <YOUR_PROJECT_NAME>

# Step 3: Instale as dependências
npm i

# Step 4: Inicie o servidor de desenvolvimento
npm run dev
```

## What technologies are used for this project?

### Frontend
- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

### Backend
- Express
- TypeScript
- Database em memória (desenvolvimento)
- CORS habilitado

## 🏗️ Arquitetura

```
Vite Dev Server (porta 8080)
    ├── Frontend React (SPA)
    └── Express API (/api/*)
            ├── Rotas de autenticação
            ├── CRUD completo
            └── Database mock
```

## 📁 Estrutura do Projeto

```
dojo-dash-portal/
├── docs/                      # 📚 Documentação
│   ├── API_DOCUMENTATION.md
│   ├── INTEGRACAO_FRONTEND.md
│   ├── README_API.md
│   └── TESTES.sh
├── server/                    # 🔧 Backend
│   ├── index.ts
│   ├── lib/
│   │   └── database.ts
│   └── routes/
│       ├── auth.ts
│       ├── students.ts
│       ├── materials.ts
│       ├── locations.ts
│       ├── senseis.ts
│       └── contacts.ts
├── src/                       # ⚛️ Frontend React
└── vite.config.ts            # ⚙️ Config Vite + API
```

## 🚀 Deploy

Para fazer deploy deste projeto, você pode usar qualquer plataforma de hospedagem que suporte aplicações Node.js, como:

- Vercel
- Netlify
- Railway
- Render
- AWS
- Google Cloud Platform

Execute `npm run build` para gerar a build de produção e faça o deploy da pasta `dist` gerada.
