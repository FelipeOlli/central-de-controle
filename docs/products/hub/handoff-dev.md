# Handoff para @dev — Hub

**De:** PM / Architect  
**Para:** @dev  
**Data:** 2025-03-14  
**Base:** [architecture.md](./architecture.md) + PRD e épicos  
**Referência de processo:** [reference-cookbooks](./reference-cookbooks/) (claude-cookbooks-main.zip)

**Prompt ideal (recomendado):** use o conteúdo de **[prompt-dev.md](./prompt-dev.md)** — um único bloco pronto para colar no @dev.

---

## Prompt para o @dev (versão expandida)

---

**Projeto Hub — Implementação**

Implementar o produto **Hub** (central de ideias, compromissos e projetos) conforme a arquitetura e os requisitos aprovados.

**Fontes obrigatórias:**
- **Arquitetura:** `docs/products/hub/architecture.md` — stack (React 18+ TS + Vite, Supabase), modelo de dados, auth, hosting.
- **PRD:** `docs/products/hub/PRD.md` — requisitos funcionais e não funcionais.
- **Épicos:** `docs/products/hub/epics.md` — ordem E1 → E4 → E2 → E3 → E5.

**Base de processo e qualidade (opcional):**
- Pasta `docs/products/hub/reference-cookbooks/` contém artefatos extraídos do **claude-cookbooks-main.zip**: CLAUDE.md (comandos, estilo, git workflow), code-reviewer agent (checklist de revisão), CONTRIBUTING, PR template. Adaptar as práticas para o stack Hub (TypeScript/React/Vite): quality gates (lint, typecheck, test), conventional commits, revisão de código antes de PR.

**Entregáveis esperados:**
1. **App Hub em repositório dedicado ou em `packages/hub` (conforme convenção do repo):** React + TypeScript + Vite, integração Supabase (Auth + PostgREST), conforme architecture.md.
2. **Modelo de dados:** Schema SQL e RLS (Supabase) conforme seção 2 da arquitetura; migrations aplicáveis via Supabase CLI ou dashboard.
3. **Épicos na ordem definida:** E1 (Auth) → E4 (Projetos) → E2 (Ideias) → E3 (Compromissos) → E5 (Navegação/UX). Implementar por user stories quando o @sm tiver criado; até lá, seguir os entregáveis por épico descritos em epics.md.
4. **Qualidade:** lint (ex.: ESLint), typecheck (TypeScript), testes (ex.: Vitest); variáveis de ambiente para `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`; nunca commitar secrets.

Documentar no próprio app (README) como rodar em dev, configurar Supabase e fazer deploy (Vercel), com referência a `docs/products/hub/architecture.md`.

---

## Referência rápida — Cookbooks (base no zip)

Os arquivos em `reference-cookbooks/claude-cookbooks-main/` foram extraídos do **claude-cookbooks-main.zip** para servir de base de processo:

| Arquivo | Uso no Hub |
|---------|------------|
| **CLAUDE.md** | Inspiração para comandos de dev (format, lint, check, test), estilo (line length, quotes), git workflow (branch naming, conventional commits). |
| **.claude/agents/code-reviewer.md** | Checklist de revisão: qualidade, segurança (secrets), testes. Adaptar para TS/React (ESLint, typecheck, Vitest). |
| **CONTRIBUTING.md** | Fluxo de contribuição e padrões; adaptar para o repositório Hub. |
| **.github/pull_request_template.md** | Template de PR; copiar/adaptar para o repo do app Hub. |

O cookbook original é focado em Python/Jupyter; para Hub usar apenas as **ideias** (quality gates, conventional commits, revisão focada em mudanças, não commitar .env).

---

*Handoff Hub — Synkra AIOX*
