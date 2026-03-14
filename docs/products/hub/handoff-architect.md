# Handoff PM → Architect — Hub

**De:** PM (Morgan)  
**Para:** @architect  
**Data:** 2025-03-14  
**Contexto:** Produto Hub (Central de Ideias, Compromissos e Projetos) — greenfield

---

## Prompt para o @architect

Use o texto abaixo ao ativar o agente **@architect** (ou colar na conversa):

---

**Projeto Hub — Proposta de arquitetura**

Preciso da proposta de arquitetura para o produto **Hub** (aplicação web responsiva, single-user) com base nos documentos de produto já aprovados.

**Fontes obrigatórias:**
- **PRD:** `docs/products/hub/PRD.md` — requisitos funcionais (FR-01 a FR-05), não funcionais (NFR-01 a NFR-04), critérios de sucesso e fora de escopo.
- **Épicos:** `docs/products/hub/epics.md` — estrutura E1 (Autenticação), E2 (Ideias), E3 (Compromissos), E4 (Projetos), E5 (Navegação/UX) e ordem sugerida de implementação.

**Entregáveis esperados:**
1. **Stack técnica** — frontend, backend, banco de dados e justificativa alinhada ao PRD (site responsivo, dados persistidos em servidor, HTTPS, senhas com hash).
2. **Modelo de dados** — entidades (usuário, ideia, tema, compromisso, projeto), relacionamentos e isolamento single-user.
3. **Autenticação e segurança** — abordagem para cadastro/login, sessão (token/session), rotas protegidas e conformidade com NFR-01.
4. **Hosting e deploy** — opção de hospedagem que atenda NFR-02 (dados persistidos, acessível 24/7), com considerações de SLA se aplicável.

Documentar a proposta em `docs/products/hub/architecture.md` (ou em `docs/architecture/` conforme convenção do repositório), de forma que @sm e @dev possam usar para stories e implementação.

---

*Handoff Hub — Synkra AIOX PM*
