# 🥋 Dojo Dash Portal

Portal completo para gerenciamento de dojo de karatê com backend API integrado.

> 📘 **Relatório Detalhado:** Para uma visão aprofundada sobre as tecnologias, arquitetura e funcionalidades, consulte o [Relatório do Projeto](./PROJECT_REPORT.md).

## 🚀 Quick Start

```bash
npm install
npm run seed
npm run dev
```

Servidor roda em: **http://localhost:8080**

## 📚 Documentação

- **[API Documentation](./docs/API_DOCUMENTATION.md)** - Referência completa da API
- **[Integração Frontend](./docs/INTEGRACAO_FRONTEND.md)** - Guia de integração

- **[Testes](./docs/TESTES.sh)** - Script automatizado de testes

## Como editar este código?

### Requisitos

- Node.js & npm instalados - [instalar com nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- MongoDB (Local ou Atlas)

### Passos para desenvolvimento local

```sh
# Step 1: Clone o repositório
git clone <YOUR_GIT_URL>

# Step 2: Navegue até o diretório do projeto
cd <YOUR_PROJECT_NAME>

# Step 3: Instale as dependências
npm i

# Step 4: Configure as variáveis de ambiente (.env)
cp .env.template .env

# Step 5: Inicie o servidor de desenvolvimento
npm run dev
```

## What technologies are used for this project?

### Frontend
- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- TanStack Query
- React Hook Form + Zod

### Backend
- Express
- TypeScript
- MongoDB (Mongoose)
- CORS habilitado
- Multer (Uploads)

## 🏗️ Arquitetura

```
Vite Dev Server (porta 8080)
    ├── Frontend React (SPA)
    └── Express API (/api/*)
            ├── Rotas de autenticação
            ├── CRUD completo
            └── MongoDB Connection
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
│   ├── config/
│   │   └── database.ts
│   └── routes/
│       ├── auth.ts
│       ├── students.ts
│       ├── materials.ts
│       ├── locations.ts
│       ├── senseis.ts
│       ├── contacts.ts
│       └── ...
├── src/                       # ⚛️ Frontend React
├── PROJECT_REPORT.md          # 📄 Relatório Detalhado
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
