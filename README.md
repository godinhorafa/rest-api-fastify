# API de Transações

Uma API RESTful para gerenciamento de transações financeiras construída com Node.js, Fastify e Knex.

## 🚀 Tecnologias Utilizadas

- Node.js (>=18)
- TypeScript
- Fastify
- Knex
- PostgreSQL/SQLite
- Zod
- Vitest
- ESLint

## 📋 Funcionalidades

- Criar transações (crédito/débito)
- Listar todas as transações
- Obter detalhes de uma transação
- Obter resumo das transações
- Autenticação baseada em sessão usando cookies
- Migrações de banco de dados
- Validação de variáveis de ambiente
- Testes automatizados

## 🛠️ Instalação

1. Clone o repositório
2. Instale as dependências:

```bash
npm install
```

3. Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

env
NODE_ENV=development
DATABASE_CLIENT=sqlite
DATABASE_URL=./db/app.db
PORT=3333

4. Execute as migrações do banco de dados:

```bash
npm run knex migrate:latest
```

## 🚀 Executando a Aplicação

Modo desenvolvimento:

```bash
npm run dev
```

Build do projeto:

```bash
npm run build
```

Executar testes:

```bash
npm run test
```

json
{
"title": "Título da transação",
"amount": 1000,
"type": "credit" | "debit"
}

### GET /transactions

Lista todas as transações da sessão atual

### GET /transactions/:id

Obtém detalhes de uma transação específica

### GET /transactions/summary

Obtém o resumo do saldo atual

## 🧪 Testes

O projeto inclui testes de integração usando Vitest e Supertest.

## 📦 Estrutura do Projeto

```
src/
├── @types/ # Definições de tipos TypeScript
├── env/ # Configuração de variáveis de ambiente
├── routes/ # Rotas da API
├── middlewares/ # Middlewares do Fastify
├── database/ # Configurações do banco de dados e migrações
└── test/ # Arquivos de teste
```
