# Especificação do Projeto

## 1. Visão Geral
O **Dojo Dash Portal** é uma plataforma web para gerenciamento de dojos de karatê, focada em facilitar a administração de alunos, locais e materiais didáticos, além de fornecer uma área exclusiva para estudantes acessarem conteúdo pedagógico.

## 2. Arquitetura

### 2.1. Frontend
- **Framework**: React (com Vite)
- **Linguagem**: TypeScript
- **Estilização**: Tailwind CSS + shadcn/ui
- **Gerenciamento de Estado**: Context API (`AuthContext`)
- **Roteamento**: React Router DOM

### 2.2. Backend
- **Runtime**: Node.js
- **Framework**: Express
- **Linguagem**: TypeScript
- **Banco de Dados**: MongoDB (via Mongoose)
- **Autenticação**: JWT (JSON Web Tokens)

## 3. Modelagem de Dados

### 3.1. User (Usuário)
Entidade base para autenticação.
- `id`: ObjectId
- `name`: String
- `email`: String (Unique)
- `role`: 'admin' | 'student'

### 3.2. Student (Aluno)
Extensão do perfil de usuário com dados específicos de karatê.
- `userId`: Referência para User
- `beltId`: ID da faixa atual (ex: 'white', 'yellow')
- `kyu`: Nível numérico (ex: 9, 8, 7...) - *Legado/Redundante com beltId*
- `location`: Local de treino
- `status`: 'active' | 'pending' | 'inactive'
- `birthDate`: Data de nascimento
- `phone`: Telefone de contato

### 3.3. Material
Conteúdo didático disponível para os alunos.
- `title`: Título
- `type`: 'kihon' | 'kata' | 'theory' | 'bunkai'
- `content`: Texto descritivo
- `videoUrl`: Link para vídeo (YouTube/Vimeo)
- `minBeltId`: Faixa mínima necessária para visualizar

### 3.4. Location (Local)
Locais onde ocorrem os treinos.
- `name`: Nome do local
- `description`: Descrição
- `imageUrl`: Foto de capa
- `images`: Galeria de fotos

## 4. Funcionalidades Principais

### 4.1. Autenticação
- Login (Email/Senha)
- Registro de novos alunos
- Proteção de rotas por Role (Admin/Student)

### 4.2. Painel do Aluno
- Visualização de progresso (Faixa atual)
- Acesso a materiais filtrados por nível
- Abas de conteúdo: Kihon, Kata, Teoria

### 4.3. Painel Administrativo
- **Dashboard**: Visão geral
- **Alunos**: Listagem, Edição, Aprovação de cadastros
- **Materiais**: CRUD de conteúdos pedagógicos
- **Locais**: Gestão de dojos e fotos

## 5. Stack Tecnológico

| Categoria | Tecnologia |
|---|---|
| **Frontend** | React, Vite, TypeScript, TailwindCSS |
| **UI Components** | shadcn/ui, Lucide React (ícones) |
| **Backend** | Node.js, Express, TypeScript |
| **Database** | MongoDB, Mongoose |
| **Auth** | JWT, bcrypt |
| **DevOps** | Docker (opcional), ESLint, Prettier |
