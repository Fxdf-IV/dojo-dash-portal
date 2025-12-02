# 🥋 Dojo Dash Portal

**Uma Solução White-label para Gestão de Dojos, Academias de Artes Marciais, e Negócios no ramo de atividades físicas**

> 🚀 **Portfolio Showcase:** Este projeto demonstra uma aplicação Full Stack completa (Frontend + Backend), focada em **UX/UI Premium**, **Arquitetura Limpa** e **Boas Práticas**.

![Dojo Dash Preview](https://images.unsplash.com/photo-1555597673-b21d5c935865?q=80&w=2072&auto=format&fit=crop)

---

## 🎯 Sobre o Projeto

O **Dojo Dash Portal** é um sistema de gerenciamento projetado para modernizar a administração do seu negócio. Ele oferece portais distintos para administradores e alunos, facilitando o acompanhamento de progresso, gestão de materiais de estudo e comunicação.

### ✨ Destaques Técnicos (Portfolio)

*   **⚡ Modo Mock (Demo):** Sistema de "Mock Mode" integrado que permite testar **todas** as funcionalidades da aplicação instantaneamente, sem necessidade de configurar banco de dados ou backend local. Ideal para recrutadores e demonstrações rápidas.
*   **🎨 UI/UX Premium:** Design moderno utilizando **Tailwind CSS** e **shadcn/ui**, com foco em responsividade, acessibilidade e micro-interações.
*   **🏗️ Arquitetura Sólida:** Separação clara de responsabilidades, tipagem forte com **TypeScript**, e gerenciamento de estado eficiente com **TanStack Query**.
*   **🔒 Controle de Acesso:** Autenticação e autorização baseada em roles (Admin vs Student).

---

## �️ Tech Stack

### Frontend
*   **React 18** + **Vite**
*   **TypeScript**
*   **Tailwind CSS** + **shadcn/ui**
*   **TanStack Query** (React Query)
*   **React Hook Form** + **Zod** (Validação)
*   **Lucide React** (Ícones)

### Backend (API)
*   **Node.js** + **Express**
*   **MongoDB** (Mongoose)
*   **JWT** (Autenticação)
*   **Multer** (Uploads)

---

## 🚀 Quick Start (Modo Portfólio)

A maneira mais rápida de ver o projeto em ação é utilizando o **Modo Mock**.

### 1. Instalação

```bash
# Clone o repositório
git clone https://github.com/maneki-neeko/dojo-dash-portal.git

# Entre na pasta
cd dojo-dash-portal

# Instale as dependências
npm install
```

### 2. Configuração (Mock Mode)

Crie um arquivo `.env` na raiz do projeto e ative o modo mock:

```env
VITE_USE_MOCK=true
```

### 3. Rodar

```bash
npm run dev
```

Acesse **http://localhost:8080**.

### 🔑 Credenciais de Teste

No Modo Mock, você pode usar os botões de "Login Rápido" na tela de login, ou usar as credenciais abaixo:

| Perfil | Email | Senha |
| :--- | :--- | :--- |
| **Admin** | `admin@test.com` | (qualquer senha) |
| **Aluno** | `student@test.com` | (qualquer senha) |

---

## ⚙️ Setup Completo (Backend + Database)

Para desenvolvedores que desejam rodar a infraestrutura completa (API real + MongoDB):

1.  Tenha o **MongoDB** rodando (localmente ou via Docker).
2.  Configure o `.env` com a conexão do banco:

```env
# Desative o Mock
VITE_USE_MOCK=false

# MongoDB
MONGODB_URI=mongodb://localhost:27017/dojo_dash

# JWT Secret (para dev)
JWT_SECRET=dev-secret-123
```

3.  Popule o banco de dados:
    ```bash
    npm run seed
    ```

4.  Inicie o servidor:
    ```bash
    npm run dev
    ```

---

## 📚 Documentação Adicional

*   **[Relatório do Projeto](./PROJECT_REPORT.md):** Uma visão aprofundada sobre as decisões de arquitetura, desafios e soluções.
*   **[Documentação da API](./docs/API_DOCUMENTATION.md):** Referência completa dos endpoints da API.

---

**Desenvolvido por [Seu Nome/Username]**
