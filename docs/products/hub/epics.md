# Épicos — Hub (Central de Ideias, Compromissos e Projetos)

**Versão:** 1.0  
**Data:** 2025-03-14  
**Owner:** PM (Morgan)  
**Status:** Rascunho para delegação  
**Referência:** [PRD](./PRD.md)

---

## Objetivo

Estrutura de épicos derivada do PRD para permitir planejamento e delegação ao **@sm** (criação de user stories) e ao **@architect** (proposta de arquitetura). O PM define os épicos; o SM detalha as stories com acceptance criteria.

---

## Épicos

| Épico | Nome | Base PRD | Prioridade | Dependência |
|-------|------|----------|------------|-------------|
| **E1** | Autenticação e conta | FR-01, NFR-01 | Must | — |
| **E2** | Ideias | FR-02 | Must | E1 |
| **E3** | Compromissos | FR-03 | Must | E1 |
| **E4** | Projetos | FR-04 | Must | E1 |
| **E5** | Navegação e UX | FR-05, NFR-03 | Must | E1 |

**Ordem sugerida de implementação:** E1 → E4 → E2 → E3 → E5 (projetos antes para permitir vínculo de ideias/compromissos; E5 pode evoluir em paralelo com E2–E4).

---

## E1 — Autenticação e conta

- **Objetivo:** Cadastro, login, logout e sessão segura; rotas protegidas.
- **Requisitos:** FR-01.1 a FR-01.5, NFR-01.x.
- **Entregável esperado:** Usuário pode se cadastrar, fazer login/logout e permanecer autenticado entre recarregamentos; rotas protegidas redirecionam para login quando não autenticado.

**Delegação @sm:** Criar user stories para cadastro, login, logout, persistência de sessão e proteção de rotas.

---

## E2 — Ideias

- **Objetivo:** CRUD de ideias com temas, status, prioridade e vínculo opcional a projeto.
- **Requisitos:** FR-02.1 a FR-02.5.
- **Entregável esperado:** Listagem com filtros (tema, status, projeto); criação/edição/exclusão; atribuição de temas e status; opcional prioridade e vínculo a projeto.

**Delegação @sm:** Criar user stories por capacidade (CRUD, temas, status, filtros, vínculo a projeto, prioridade).

---

## E3 — Compromissos

- **Objetivo:** CRUD de compromissos com data de vencimento, status (incl. Atrasado) e vínculo opcional a projeto.
- **Requisitos:** FR-03.1 a FR-03.4.
- **Entregável esperado:** Listagem com filtros por status e data; criação/edição/exclusão; regra “Atrasado” quando vencimento &lt; hoje e status ≠ Cumprido.

**Delegação @sm:** Criar user stories para CRUD, status, cálculo de atrasado, filtros e vínculo a projeto.

---

## E4 — Projetos

- **Objetivo:** CRUD de projetos com status; na tela do projeto exibir ideias e compromissos vinculados.
- **Requisitos:** FR-04.1 a FR-04.4.
- **Entregável esperado:** Listagem com filtro por status; tela de projeto mostrando ideias e compromissos associados.

**Delegação @sm:** Criar user stories para CRUD de projetos, status, listagem e visualização de vínculos (ideias/compromissos).

---

## E5 — Navegação e UX

- **Objetivo:** Navegação clara entre Ideias, Compromissos, Projetos (e opcional dashboard); interface responsiva e acessível.
- **Requisitos:** FR-05.1 a FR-05.3, NFR-03.x, NFR-04.x.
- **Entregável esperado:** Navegação intuitiva; layout responsivo (desktop e mobile); ações principais em poucos cliques; interface em português (BR).

**Delegação @sm:** Criar user stories para navegação, responsividade, acessibilidade de ações e (se escopo) dashboard.

---

## Próximos passos (Gate 1)

| Ação | Responsável | Artefato / resultado |
|------|-------------|----------------------|
| Proposta de arquitetura (stack, dados, segurança) | @architect | Documento em `docs/products/hub/` ou `docs/architecture/` |
| Criação de user stories a partir dos épicos | @sm | Stories em `docs/stories/` (ou convenção do repo) |
| Priorização/refino do backlog | @po | Backlog alinhado ao PRD e épicos |
| Implementação por story | @dev | Conforme Story Development Cycle |

---

## Rastreabilidade

| Documento | Local |
|-----------|--------|
| Product Brief | [product-brief.md](./product-brief.md) |
| PRD | [PRD.md](./PRD.md) |
| Épicos (este) | [epics.md](./epics.md) |
| User stories | A criar pelo @sm |
| Arquitetura | [architecture.md](./architecture.md) |

---

*Épicos Hub v1.0 — Synkra AIOX PM*
