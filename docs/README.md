# 📚 Documentação - Dojo Dash Portal

Bem-vindo à documentação do projeto!

---

## 📖 Documentos Disponíveis



---

### 📋 [Referência Completa - API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
Documentação completa de todos os endpoints da API.

**Contém:**
- Todos os endpoints com exemplos
- Formatos de request/response
- Códigos de status
- Exemplos de uso com curl
- Estrutura de dados

---

### 🔗 [Guia de Integração - INTEGRACAO_FRONTEND.md](./INTEGRACAO_FRONTEND.md)
Como conectar o frontend React com a API.

**Contém:**
- Exemplos de código para cada página
- Hook customizado `useApi`
- Substituição de mocks por API real
- Otimizações com React Query
- Checklist de migração

---

### 🧪 [Script de Testes - TESTES.sh](./TESTES.sh)
Script bash automatizado para testar todos os endpoints.

**Como usar:**
```bash
cd docs
bash TESTES.sh
```

**Testa:**
- Health check
- Autenticação (login admin e aluno)
- CRUD de alunos
- Listagem de materiais, senseis e locais
- Formulário de contato

---

## 🎯 Fluxo de Leitura Recomendado

### Para desenvolvedores iniciando no projeto:


1. **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)** - Explorar endpoints
2. **[TESTES.sh](./TESTES.sh)** - Rodar testes para validar
3. **[INTEGRACAO_FRONTEND.md](./INTEGRACAO_FRONTEND.md)** - Integrar com o frontend

---

### Para quem vai integrar o frontend:

1. **[INTEGRACAO_FRONTEND.md](./INTEGRACAO_FRONTEND.md)** - Guia completo
2. **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)** - Referência de endpoints
3. **[TESTES.sh](./TESTES.sh)** - Validar que a API está funcionando

---

### Para quem vai testar a API:


1. **[TESTES.sh](./TESTES.sh)** - Rodar testes automatizados
2. **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)** - Testar endpoints manualmente

---

## 🛠️ Estrutura de Arquivos

```
docs/
├── README.md                    # Este arquivo (índice)

├── API_DOCUMENTATION.md         # Referência completa
├── INTEGRACAO_FRONTEND.md       # Guia de integração
└── TESTES.sh                    # Script de testes
```

---

## 🔍 Busca Rápida

### Procurando algo específico?

| Preciso de... | Ver documento |
|---------------|---------------|
| Iniciar o servidor | [ENV_SETUP.md](../ENV_SETUP.md) |
| Credenciais de teste | [ENV_SETUP.md](../ENV_SETUP.md#credenciais-de-teste) |
| Lista de endpoints | [API_DOCUMENTATION.md](./API_DOCUMENTATION.md#-endpoints-disponíveis) |
| Exemplo de login | [API_DOCUMENTATION.md](./API_DOCUMENTATION.md#login) |
| Conectar frontend | [INTEGRACAO_FRONTEND.md](./INTEGRACAO_FRONTEND.md) |
| Criar hook useApi | [INTEGRACAO_FRONTEND.md](./INTEGRACAO_FRONTEND.md#2️⃣-criar-hook-para-api) |
| Testar API | [TESTES.sh](./TESTES.sh) |

---

## 🆘 Ajuda Rápida

### Servidor não inicia?
```bash
# Voltar para raiz do projeto
cd ..

# Instalar dependências
npm install

# Iniciar servidor
npm run dev
```

### API retorna erro?
1. Verificar se servidor está rodando: `curl http://localhost:8080/api/health`
2. Verificar logs no console
3. Rodar script de testes: `bash docs/TESTES.sh`

### Precisa de mais ajuda?
- Verifique os logs do servidor no terminal
- Todos os requests são logados: `[API] METHOD /path`
- Use as credenciais de teste documentadas

---

**Última atualização:** 29/10/2025
**Versão:** 1.0.0
