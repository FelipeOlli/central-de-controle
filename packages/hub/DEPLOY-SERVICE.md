# Deploy service — Hub

Use este texto em plataformas de deploy (EasyPanel, Coolify, etc.) ou como referência do que está sendo implantado.

---

## Deploy service

**feat(hub): app Hub com visão unificada, layout dark e design system**

- **Hub:** React + Vite + API Express + Prisma/SQLite (ideias, compromissos, projetos)
- **Visão geral:** Dashboard e Tudo em uma aba (rota `/inicio`)
- **Layout:** inspirado em UI Wrapped — tema escuro, acento lime, Space Grotesk + Plus Jakarta Sans
- **Correção 502:** script dev:api compatível com raiz e `packages/hub`, troubleshooting no README
- **Docs:** PRD, architecture, deploy EasyPanel, PR-HUB-VISAO-E-DESIGN, DESIGN-REFERENCE
- **.gitignore** em `packages/hub` para `.env` e `*.db`

**Made with:** Cursor

---

## Build & run (resumo)

| Item        | Valor |
|------------|--------|
| Dockerfile | `packages/hub/Dockerfile` |
| Build context | Raiz do repositório (`.` ou `../../` conforme a plataforma) |
| Porta      | `3001` |
| Health     | `GET /api/health` |
| CMD        | `node packages/hub/dist-server/index.js` |

### Variáveis de ambiente (produção)

- `DATABASE_URL` — SQLite: `file:./dev.db` (no container, relativo ao schema); ou connection string PostgreSQL/MySQL.
- `JWT_SECRET` — Chave forte para tokens.
- `FRONTEND_ORIGIN` — Origen do front (ex.: `https://hub.seudominio.com`).
- `NODE_ENV=production` (já definido no Dockerfile).
- `PORT=3001` (opcional; padrão 3001).

### Repositórios

- **Synkra / aios-core:** `https://github.com/SynkraAI/aios-core.git`
- **Central de controle:** `https://github.com/FelipeOlli/central-de-controle.git`

Documentação completa: [deploy-easypanel.md](../../docs/products/hub/deploy-easypanel.md).
