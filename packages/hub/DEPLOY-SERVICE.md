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

Configure no EasyPanel em **Environment** (ou variáveis do serviço):

- **`DATABASE_URL`** — Se não definida, o app usa `file:/tmp/hub.sqlite` (gravável no container). Para persistir: monte um volume e use ex. `file:/data/hub.sqlite`.
- **`JWT_SECRET`** — Chave forte para tokens (recomendado em produção).
- **`FRONTEND_ORIGIN`** — Origem do front (ex.: `https://seudominio.com`); padrão `http://localhost:5173`.
- `NODE_ENV=production` e `PORT=3001` já vêm do Dockerfile.

### Repositórios

- **Synkra / aios-core:** `https://github.com/SynkraAI/aios-core.git`
- **Central de controle:** `https://github.com/FelipeOlli/central-de-controle.git`

Documentação completa: [deploy-easypanel.md](../../docs/products/hub/deploy-easypanel.md).
