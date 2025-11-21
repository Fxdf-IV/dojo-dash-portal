# Regras de Negócio

## 1. Perfis de Usuário

O sistema possui dois tipos de perfis de usuário, definidos pelo campo `role`:

### 1.1. Admin (`admin`)
- **Acesso Total**: Pode visualizar e editar todos os dados do sistema.
- **Gestão de Alunos**:
    - Visualizar lista completa de alunos.
    - Cadastrar novos alunos.
    - Editar dados de alunos.
    - Aprovar alunos com status `pending`.
    - Remover alunos.
- **Gestão de Conteúdo**:
    - Criar, editar e remover materiais (Kihon, Kata, Teoria, Bunkai).
    - Definir nível de faixa (`minBeltId`) para acesso aos materiais.
- **Gestão de Locais**:
    - Gerenciar dojos e locais de treino.
    - Adicionar fotos aos locais.

### 1.2. Aluno (`student`)
- **Acesso Restrito**: Visualiza apenas seu próprio perfil e conteúdos permitidos.
- **Dashboard**: Acesso à "Área do Aluno" com materiais de estudo.
- **Conteúdo**: Visualiza materiais baseados em sua graduação atual (ver regra 2.2).
- **Dados Pessoais**: Pode visualizar seus dados, mas alterações críticas (como graduação) são feitas apenas por admins.

---

## 2. Sistema de Graduação (Faixas)

O sistema utiliza uma estrutura de graduação baseada em Kyu (iniciantes) e Dan (faixas pretas).

### 2.1. Ordem das Faixas
A progressão segue a ordem definida em `BELT_GRADES`:

| ID | Nome | Rank | Nível |
|---|---|---|---|
| `white` | Faixa Branca - 9º Kyu | Kyu | 9 |
| `red-kyu` | Faixa Vermelha - 8º Kyu | Kyu | 8 |
| `yellow` | Faixa Amarela - 7º Kyu | Kyu | 7 |
| `orange` | Faixa Laranja - 6º Kyu | Kyu | 6 |
| `blue` | Faixa Azul - 5º Kyu | Kyu | 5 |
| `gray` | Faixa Cinza - 4º Kyu | Kyu | 4 |
| `green` | Faixa Verde - 3º Kyu | Kyu | 3 |
| `purple` | Faixa Roxa - 2º Kyu | Kyu | 2 |
| `brown` | Faixa Marrom - 1º Kyu | Kyu | 1 |
| `black-1` | Faixa Preta - 1º Dan | Dan | 1 |
| ... | ... | ... | ... |
| `red-10` | Faixa Vermelha - 10º Dan | Dan | 10 |

### 2.2. Regra de Acesso a Conteúdo
- Cada material (Kihon, Kata, Teoria) possui um requisito de faixa mínima (`minBeltId`).
- Um aluno tem acesso a um material se sua graduação for **igual ou superior** à graduação mínima exigida pelo material.
- **Lógica de Comparação**: A comparação não é apenas pelo ID, mas pela hierarquia de faixas (Kyu decrescente, Dan crescente).
    - *Nota*: Atualmente o sistema pode estar validando apenas correspondência direta ou lógica simplificada. A regra de negócio ideal é acesso cumulativo (faixa amarela vê conteúdo de branca e amarela).

---

## 3. Gestão de Alunos

### 3.1. Cadastro e Aprovação
- **Auto-cadastro**: Alunos podem se cadastrar publicamente.
- **Status Inicial**: Todo novo cadastro entra com status `pending`.
- **Aprovação**: Um administrador deve aprovar o cadastro (mudar para `active`) para que o aluno tenha acesso completo ao sistema.
- **Campos Obrigatórios**: Nome, Email, Senha, Local de Treino.

### 3.2. Status do Aluno
- `active`: Aluno regular, com acesso ao portal.
- `pending`: Aguardando aprovação. Acesso restrito ou bloqueado.
- `inactive`: Aluno desligado ou pausado. Acesso bloqueado.

---

## 4. Gestão de Conteúdo (Materiais)

### 4.1. Tipos de Material
- **Kihon**: Fundamentos técnicos.
- **Kata**: Formas sequenciais.
- **Theory**: Conteúdo teórico e histórico.
- **Bunkai**: Aplicação prática dos katas.

### 4.2. Visibilidade
- Materiais são visíveis apenas para alunos logados.
- Filtros de graduação se aplicam automaticamente.

---

## 5. Locais e Dojos
- O sistema permite múltiplos locais de treino.
- Cada aluno é vinculado a um local principal (`location`), mas o conteúdo pedagógico é unificado.
