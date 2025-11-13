# Configuração das Variáveis de Ambiente

## Como configurar o arquivo .env

1. Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:

```env
# MongoDB
MONGODB_URI=mongodb://admin:admin123@localhost:27017/dojo_dash?authSource=admin

# JWT
JWT_SECRET=dojo-dash-jwt-secret-change-in-production-2024
JWT_EXPIRES_IN=7d

# Server
PORT=8080
NODE_ENV=development
```

2. **IMPORTANTE**: Nunca commit o arquivo `.env` no git! Ele já está no `.gitignore`.

3. Para produção, altere o `JWT_SECRET` para um valor mais seguro e único.

## Como iniciar o projeto

### 1. Iniciar MongoDB com Docker

```bash
docker-compose up -d
```

### 2. Popular o banco com dados iniciais

```bash
npm run seed
```

### 3. Iniciar o servidor de desenvolvimento

```bash
npm run dev
```

## Credenciais de teste

Após rodar o seed, você pode fazer login com:

- **Admin**: `adm@email.com` / `1234`
- **Aluno**: `aluno@email.com` / `1234`

## Verificar se MongoDB está rodando

```bash
docker ps
```

Deve mostrar um container chamado `dojo-mongodb` rodando.

## Parar MongoDB

```bash
docker-compose down
```

## Limpar dados do MongoDB

```bash
docker-compose down -v
```

Isso remove os volumes e todos os dados armazenados.
