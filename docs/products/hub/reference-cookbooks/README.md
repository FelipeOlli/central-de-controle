# Referência — Claude Cookbooks

Artefatos extraídos de **claude-cookbooks-main.zip** para uso como base de processo e qualidade no desenvolvimento do Hub.

## Conteúdo

- **claude-cookbooks-main/README.md** — Visão geral do repositório original.
- **claude-cookbooks-main/CLAUDE.md** — Comandos de desenvolvimento, estilo de código, git workflow (conventional commits, branch naming), regras (API keys, dependencies, quality checks).
- **claude-cookbooks-main/.claude/agents/code-reviewer.md** — Agente de code review: checklist (code quality, security, notebooks). **Adaptar** para TypeScript/React (ESLint, typecheck, Vitest).
- **claude-cookbooks-main/CONTRIBUTING.md** — Guia de contribuição do projeto original.
- **claude-cookbooks-main/.github/pull_request_template.md** — Template de PR; reutilizar/adaptar no repo do app Hub.

## Uso no Hub

O Hub usa **React + TypeScript + Vite + Supabase** (ver [architecture.md](../architecture.md)). As práticas dos cookbooks (Python/Jupyter) devem ser **traduzidas**:

| Cookbook | Adaptação Hub |
|----------|----------------|
| `make format` / `make lint` | `npm run format`, `npm run lint` (Prettier, ESLint) |
| `uv run ruff` | ESLint + TypeScript strict |
| Conventional commits | Manter: `feat(hub):`, `fix(hub):`, etc. |
| Secrets em `.env` | `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`; nunca commitar `.env` |
| Code reviewer checklist | Focar em TS, React, Supabase RLS e segurança |

Handoff completo para @dev: [handoff-dev.md](../handoff-dev.md).
