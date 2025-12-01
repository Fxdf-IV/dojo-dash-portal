# Relatório Detalhado do Projeto: Dojo Dash Portal

## 1. Visão Geral
O **Dojo Dash Portal** é uma aplicação web completa para gerenciamento de um dojo de karatê. Ele oferece uma interface pública para visitantes (história, galeria, eventos, contato) e um sistema administrativo robusto para gerenciamento de alunos, materiais, locais de treino, senseis e eventos.

## 2. Stack Tecnológico

### Frontend
- **Framework:** React 18 (via Vite)
- **Linguagem:** TypeScript
- **Estilização:** Tailwind CSS, shadcn/ui (componentes baseados em Radix UI)
- **Ícones:** Lucide React
- **Gráficos:** Recharts
- **Roteamento:** React Router DOM
- **Gerenciamento de Estado/Data Fetching:** TanStack Query (React Query)
- **Formulários:** React Hook Form + Zod (validação)
- **Utilitários:** date-fns, clsx, tailwind-merge

### Backend
- **Servidor:** Node.js com Express
- **Linguagem:** TypeScript
- **Banco de Dados:** MongoDB (via Mongoose)
- **Autenticação:** JWT (JSON Web Tokens) com suporte a múltiplos papéis (Admin, Aluno)
- **Segurança:** Helmet, CORS, Bcryptjs (hashing de senha)
- **Upload de Arquivos:** Multer

### Infraestrutura & Ferramentas
- **Build Tool:** Vite
- **Linting:** ESLint
- **Containerização:** Docker Compose (configurado para MongoDB)

## 3. Arquitetura do Sistema

O projeto segue uma arquitetura Monorepo simplificada, onde frontend e backend residem no mesmo repositório, mas com responsabilidades claras.

- **Frontend (`src/`)**: SPA (Single Page Application) que consome a API.
- **Backend (`server/`)**: API RESTful que serve os dados e gerencia a lógica de negócios.
- **Integração**: O Vite é configurado para servir o frontend e fazer proxy das requisições `/api` para o servidor Express durante o desenvolvimento. Em produção, o Express serve os arquivos estáticos do frontend buildado.

## 4. Funcionalidades Detalhadas

### Área Pública
- **Home:** Apresentação do dojo, carrossel de Senseis, destaques.
- **História:** Linha do tempo ou texto sobre a história do dojo.
- **Galeria:** Exibição de fotos e vídeos.
- **Eventos:** Calendário ou lista de próximos eventos.
- **Contato:** Formulário de contato e informações de localização.
- **Login:** Acesso para alunos e administradores.

### Área do Aluno (`/student`)
- **Dashboard:** Visão geral do progresso, próximas aulas.
- **Materiais:** Acesso a vídeos, apostilas e conteúdos exclusivos.

### Área Administrativa (`/admin`)
- **Dashboard:** Métricas gerais (total de alunos, ativos, etc.).
- **Gerenciamento de Alunos:** Cadastro, edição, inativação de alunos. Acompanhamento de graduação.
- **Gerenciamento de Senseis:** Cadastro de instrutores.
- **Gerenciamento de Locais (Dojos):** Endereços e horários de treino.
- **Gerenciamento de Materiais:** Upload e organização de conteúdo didático.
- **Gerenciamento de Eventos:** Criação e divulgação de eventos.
- **Gerenciamento de Contatos:** Visualização de mensagens recebidas pelo site.
- **Configurações de Usuário:** Gerenciamento de usuários do sistema (Admins).

## 5. Estrutura da API (Backend)

A API está organizada em rotas RESTful:

- `/api/auth`: Login, registro, verificação de token.
- `/api/students`: CRUD de alunos.
- `/api/senseis`: CRUD de senseis.
- `/api/locations`: CRUD de locais de treino.
- `/api/materials`: CRUD de materiais didáticos.
- `/api/events`: CRUD de eventos.
- `/api/contacts`: Recebimento e listagem de mensagens de contato.
- `/api/users`: Gerenciamento de usuários administrativos.
- `/api/upload`: Upload de imagens e arquivos.

## 6. Banco de Dados (MongoDB)

O sistema utiliza MongoDB. As principais coleções (Models) identificadas são:
- `User`: Usuários do sistema (autenticação).
- `Student`: Dados dos alunos.
- `Sensei`: Dados dos instrutores.
- `Location`: Locais de treino.
- `Material`: Conteúdos didáticos.
- `Event`: Eventos do dojo.
- `Contact`: Mensagens de contato.

## 7. Status Atual

O projeto está funcional com integração completa entre frontend e backend. A autenticação foi recentemente refatorada para suportar usernames, e a interface utiliza componentes modernos e responsivos. O banco de dados não é mais em memória, exigindo uma conexão MongoDB ativa (local ou nuvem).
