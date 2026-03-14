# Deploy no EasyPanel — Hub

Este guia adapta a operação do Hub para servidor com EasyPanel.

## Pré-requisitos

- Projeto Hub no repositório com `packages/hub`.
- Banco configurado (SQLite para início, PostgreSQL/MySQL para escala).
- Domínio apontando para o servidor do EasyPanel.

## 1) Criar aplicação no EasyPanel

1. Em **Applications** > **Create App** > **Dockerfile/Git**.
2. Conecte o repositório (ex.: `SynkraAI/aios-core` ou `FelipeOlli/central-de-controle`).
3. Configure:
   - **Dockerfile Path:** `packages/hub/Dockerfile`
   - **Build Context:** raiz do repositório (`.`)
   - **Port:** `3001`

## 2) Definir Environment Variables

### Modo inicial (rápido): SQLite (no container)

- `DATABASE_URL=file:./dev.db` (relativo ao diretório do schema no container; use volume para persistir)
- `JWT_SECRET=<chave-forte>`
- `FRONTEND_ORIGIN=https://<seu-dominio>`

### Escala (recomendado em produção): PostgreSQL ou MySQL

- `DATABASE_URL=<connection-string-do-banco>`
- `JWT_SECRET=<chave-forte>`
- `FRONTEND_ORIGIN=https://<seu-dominio>`
- ajuste `provider` em `packages/hub/prisma/schema.prisma` para `postgresql` ou `mysql`

## 4) Banco de dados e auth

Antes do primeiro go-live:

1. Rode em shell da app:
   - `npm run db:push -w @aiox/hub`
2. Valide login/cadastro e CRUDs no domínio final.

## 5) Configurar domínio e SSL

1. Em **Domains**, adicione seu domínio.
2. Ative SSL/TLS no EasyPanel.
3. Confirme resposta HTTPS.

## 6) Health check e rollback

- **Health endpoint sugerido:** `/api/health`
- **Rollback:** use o deploy anterior no histórico do EasyPanel.

## 7) Checklist de validação pós-deploy

- [ ] Cadastro e login funcionando.
- [ ] Logout e rota protegida (`/projetos`) exigem sessão.
- [ ] CRUD de projetos, ideias e compromissos operando.
- [ ] Filtros e vínculos por projeto funcionando.
- [ ] HTTPS ativo no domínio final.
