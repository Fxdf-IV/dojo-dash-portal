#!/bin/bash

# 🥋 Script de Testes da API do Dojo Dash Portal
# Execute: bash TESTES.sh

echo "╔═══════════════════════════════════════════════╗"
echo "║  🧪 Testando API do Dojo Dash Portal         ║"
echo "╚═══════════════════════════════════════════════╝"
echo ""

BASE_URL="http://localhost:8080/api"

# Cores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Função para testar endpoint
test_endpoint() {
    local name=$1
    local method=$2
    local endpoint=$3
    local data=$4

    echo -e "${YELLOW}🔍 Testando: $name${NC}"

    if [ -z "$data" ]; then
        response=$(curl -s -X $method "$BASE_URL$endpoint")
    else
        response=$(curl -s -X $method "$BASE_URL$endpoint" \
            -H "Content-Type: application/json" \
            -d "$data")
    fi

    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Sucesso${NC}"
        echo "$response" | python3 -m json.tool 2>/dev/null || echo "$response"
    else
        echo -e "${RED}✗ Falhou${NC}"
    fi
    echo ""
}

# 1. Health Check
test_endpoint "Health Check" "GET" "/health"

# 2. Login Admin
test_endpoint "Login Admin" "POST" "/auth/login" \
    '{"email":"adm@email.com","password":"1234"}'

# 3. Login Aluno
test_endpoint "Login Aluno" "POST" "/auth/login" \
    '{"email":"aluno@email.com","password":"1234"}'

# 4. Listar Alunos
test_endpoint "Listar Alunos" "GET" "/students"

# 5. Listar Materiais
test_endpoint "Listar Materiais" "GET" "/materials"

# 6. Listar Senseis
test_endpoint "Listar Senseis" "GET" "/senseis"

# 7. Listar Locais
test_endpoint "Listar Locais" "GET" "/locations"

# 8. Criar Novo Aluno
test_endpoint "Criar Novo Aluno" "POST" "/students" \
    '{"name":"Teste API","email":"teste@api.com","kyu":9,"location":"CT Maylson Campos","status":"pending"}'

# 9. Enviar Contato
test_endpoint "Enviar Contato" "POST" "/contacts" \
    '{"name":"João Teste","email":"joao@test.com","phone":"(18)99999-9999","message":"Mensagem de teste"}'

echo "╔═══════════════════════════════════════════════╗"
echo "║  ✅ Testes Concluídos!                       ║"
echo "╚═══════════════════════════════════════════════╝"
