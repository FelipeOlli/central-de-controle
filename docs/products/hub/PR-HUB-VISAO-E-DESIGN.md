# PR — Hub: visão unificada, correção 502 e design system

## Resumo

- Nova **visão geral** em uma única aba (Dashboard + Tudo) com rota `/inicio`.
- Ajustes para **evitar 502** ao subir API (script e troubleshooting).
- **Design** alinhado ao [ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) (paleta Productivity Tool + diretrizes UX).

---

## Alterações

### 1. Visão unificada (Início)

- **Nova página** `InicioPage`: abas **Dashboard** e **Tudo em uma aba**.
- **Dashboard:** cards de totais (Projetos, Ideias, Compromissos), compromissos atrasados, desta semana, projetos em andamento, ideias recentes.
- **Tudo em uma aba:** listas compactas de Projetos, Ideias e Compromissos na mesma tela, com “Ver todos” para as páginas completas.
- Rota **`/inicio`**; redirecionamento de **`/`** para `/inicio`.
- **Nav:** link “Início” como primeira opção.

**Arquivos:** `src/pages/InicioPage.tsx` (novo), `App.tsx`, `DashboardLayout.tsx`, `styles.css` (estilos das abas e seções).

### 2. Correção 502 e robustez da API

- **Script `dev:api`** funciona tanto na raiz do monorepo (`npm run dev -w @aiox/hub`) quanto em `packages/hub` (`cd packages/hub && npm run dev`).
- **Logs** no servidor: `[hub-api] starting (cwd=...)` e `[hub-api] running on http://localhost:3001`.
- **README:** seção “Se aparecer 502: Falha na requisição” com passos de diagnóstico e dica de rodar `cd packages/hub && npm run dev`.
- **`.env.example`** e README: `DATABASE_URL="file:./dev.db"` (SQLite em `prisma/dev.db`).

**Arquivos:** `package.json`, `src/server/index.ts`, `README.md`, `.env.example`.

### 3. Design (UI UX Pro Max)

- **Paleta** Productivity Tool em variáveis CSS: primary teal, fundo claro, cards com borda e sombra leve.
- **Transições** 200 ms em hovers/focus; **`:focus-visible`** em links, botões e inputs; **`prefers-reduced-motion`** respeitado.
- **Nav:** estado ativo com borda inferior; **scroll-behavior: smooth** no `html`.
- **Doc:** `packages/hub/docs/DESIGN-REFERENCE.md` com tokens e referência ao repositório.

**Arquivos:** `src/styles.css`, `docs/DESIGN-REFERENCE.md` (novo).

---

## Checklist

- [ ] Rodar `npm run lint -w @aiox/hub`
- [ ] Rodar `npm run typecheck -w @aiox/hub`
- [ ] Rodar `npm run test -w @aiox/hub`
- [ ] Testar localmente: `npm run dev -w @aiox/hub` → abrir `/inicio`, alternar Dashboard / Tudo em uma aba, navegar para Projetos/Ideias/Compromissos
- [ ] Confirmar que a API sobe (logs `[hub-api]` no terminal) e que cadastro/login não retornam 502

---

## Referências

- [ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) — base de consulta para layout e design.
- `docs/products/hub/PRD.md`, `architecture.md` — escopo e arquitetura do Hub.
