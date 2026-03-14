# Hub

Aplicação web responsiva para gerenciar ideias, compromissos e projetos.

## Stack

- React + TypeScript + Vite
- API Express + Prisma
- Banco local SQLite (com migração futura para PostgreSQL/MySQL)

Arquitetura de referência: `docs/products/hub/architecture.md`.

## Configuração

1. Copie o arquivo de ambiente:

   ```bash
   cp packages/hub/.env.example packages/hub/.env
   ```

2. Para rodar com SQLite local, mantenha o valor padrão:
   - `DATABASE_URL="file:./dev.db"`

## Banco de dados local (SQLite)

```bash
npm run db:push -w @aiox/hub
```

O arquivo SQLite será criado em `packages/hub/prisma/dev.db` (path relativo ao diretório do schema).

## Rodar localmente

```bash
npm install
npm run dev -w @aiox/hub
```

Esse comando sobe:
- API em `http://localhost:3001`
- Frontend em `http://localhost:5173`

**Se aparecer "502: Falha na requisição" (ex.: ao criar conta):** a API não está respondendo. Confira:
1. No terminal deve aparecer `[hub-api] starting` e depois `[hub-api] running on http://localhost:3001`. Se não aparecer, a API não subiu.
2. Rode o banco: `npm run db:push -w @aiox/hub`.
3. Se a API cair ao iniciar, verifique `packages/hub/.env` (principalmente `DATABASE_URL`) e se existe `packages/hub/prisma/dev.db` (ou o path indicado em `DATABASE_URL`).
4. Opcional: rodar a partir da pasta do pacote garante o cwd correto: `cd packages/hub && npm run dev`.

## Quality gates (pacote Hub)

```bash
npm run lint -w @aiox/hub
npm run typecheck -w @aiox/hub
npm run test -w @aiox/hub
```

## Escalar depois para PostgreSQL ou MySQL

No `.env`, altere `DATABASE_URL` para a connection string do banco e ajuste
`provider` no arquivo `prisma/schema.prisma` para `postgresql` ou `mysql`.

Depois execute novamente:

```bash
npm run db:push -w @aiox/hub
```

Prisma reaproveita o mesmo modelo de dados, minimizando retrabalho.

## Funcionalidades implementadas

- E1: cadastro, login, logout, sessão persistida e rotas protegidas.
- E4: CRUD de projetos, status e contagem de itens vinculados.
- E2: CRUD de ideias com temas, status, prioridade, filtros e vínculo opcional com projeto.
- E3: CRUD de compromissos com data de vencimento, status (incluindo atrasado), filtros e vínculo opcional com projeto.
- E5: navegação clara e layout responsivo.
