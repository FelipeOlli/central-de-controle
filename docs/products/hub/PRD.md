# PRD — Hub (Central de Ideias, Compromissos e Projetos)

**Versão:** 1.0  
**Data:** 2025-03-14  
**Owner:** PM (Morgan)  
**Status:** Rascunho  
**Referência:** [Product Brief](./product-brief.md)

---

## 1. Escopo e premissas

- **Produto:** aplicação web responsiva, single-user, para gerenciar ideias (com temas e status), compromissos e projetos.
- **Acesso:** login e senha; uso em desktop e mobile via navegador.
- **Abordagem:** produto rico desde o v1 (não MVP mínimo).

---

## 2. Requisitos funcionais

### 2.1 Autenticação e conta (FR-01)

| ID | Requisito | Prioridade |
|----|-----------|------------|
| FR-01.1 | Usuário pode se cadastrar com e-mail e senha. | Must |
| FR-01.2 | Usuário pode fazer login com e-mail e senha. | Must |
| FR-01.3 | Usuário pode fazer logout. | Must |
| FR-01.4 | Rotas protegidas exigem autenticação; redirecionamento para login quando não autenticado. | Must |
| FR-01.5 | Sessão persistida de forma segura (ex.: token/session); usuário permanece logado entre recarregamentos no mesmo dispositivo. | Must |

### 2.2 Ideias (FR-02)

| ID | Requisito | Prioridade |
|----|-----------|------------|
| FR-02.1 | Usuário pode criar, editar e excluir ideias (título, descrição opcional, datas). | Must |
| FR-02.2 | Usuário pode agrupar ideias por **temas** (tags/categorias): criar temas, atribuir múltiplos temas a uma ideia, filtrar por tema. | Must |
| FR-02.3 | Cada ideia tem **status**: e.g. Rascunho, Ativa, Em projeto, Concluída, Arquivada. Usuário pode alterar status e filtrar por status. | Must |
| FR-02.4 | Usuário pode definir **prioridade** (ex.: baixa, média, alta) e **vincular ideia a um projeto** (opcional). | Should |
| FR-02.5 | Listagem de ideias com ordenação e filtros (tema, status, projeto vinculado). | Must |

### 2.3 Compromissos (FR-03)

| ID | Requisito | Prioridade |
|----|-----------|------------|
| FR-03.1 | Usuário pode criar, editar e excluir compromissos (título, descrição opcional, data de vencimento). | Must |
| FR-03.2 | Cada compromisso tem **status**: e.g. Pendente, Em andamento, Cumprido, Atrasado. Cálculo de “Atrasado” quando data de vencimento < hoje e status não é Cumprido. | Must |
| FR-03.3 | Listagem de compromissos com filtros por status e por data (vencidos, esta semana, etc.). | Must |
| FR-03.4 | Opção de vincular compromisso a um projeto. | Should |

### 2.4 Projetos (FR-04)

| ID | Requisito | Prioridade |
|----|-----------|------------|
| FR-04.1 | Usuário pode criar, editar e excluir projetos (nome, descrição opcional). | Must |
| FR-04.2 | Cada projeto tem **status**: e.g. Planejamento, Em andamento, Pausado, Concluído. Usuário pode alterar status e filtrar por status. | Must |
| FR-04.3 | Na tela do projeto, usuário vê ideias e compromissos vinculados a esse projeto. | Must |
| FR-04.4 | Listagem de projetos com ordenação e filtro por status. | Must |

### 2.5 Navegação e UX (FR-05)

| ID | Requisito | Prioridade |
|----|-----------|------------|
| FR-05.1 | Navegação clara entre: Ideias, Compromissos, Projetos e (opcional) visão geral/dashboard. | Must |
| FR-05.2 | Interface responsiva: uso confortável em desktop e em celular (breakpoints adequados). | Must |
| FR-05.3 | Ações principais (criar ideia, compromisso, projeto) acessíveis em poucos cliques. | Must |

---

## 3. Requisitos não funcionais

### 3.1 Segurança (NFR-01)

| ID | Requisito |
|----|-----------|
| NFR-01.1 | Senhas armazenadas com hash seguro (nunca em texto puro). |
| NFR-01.2 | Comunicação cliente–servidor via HTTPS em produção. |
| NFR-01.3 | Dados de um usuário isolados (single-user; sem acesso entre contas; sem multi-tenant compartilhado no v1). |

### 3.2 Disponibilidade e persistência (NFR-02)

| ID | Requisito |
|----|-----------|
| NFR-02.1 | Dados persistidos em base de dados; não apenas em localStorage. |
| NFR-02.2 | Aplicação acessível online 24/7 (considerar SLA conforme hosting escolhido). |

### 3.3 Usabilidade (NFR-03)

| ID | Requisito |
|----|-----------|
| NFR-03.1 | Interface em português (BR). |
| NFR-03.2 | Fluxos principais realizáveis em poucos cliques; sem dependência de tutoriais para uso básico. |

### 3.4 Tecnologia (NFR-04)

| ID | Requisito |
|----|-----------|
| NFR-04.1 | Entrega como **site responsivo** (não exige app nativo no v1). |
| NFR-04.2 | Compatível com navegadores modernos (Chrome, Firefox, Safari, Edge) em desktop e mobile. |

---

## 4. Critérios de sucesso (release v1)

- [ ] Login e cadastro funcionando; sessão segura.
- [ ] CRUD completo de ideias com temas e status; filtros e vínculo opcional a projeto.
- [ ] CRUD completo de compromissos com data de vencimento e status (incl. “Atrasado”).
- [ ] CRUD completo de projetos com status; listagem de ideias e compromissos vinculados no projeto.
- [ ] Uso confortável em desktop e em celular (teste em pelo menos um dispositivo móvel).
- [ ] Dados persistidos em servidor; acesso de qualquer dispositivo com a mesma conta.

---

## 5. Fora do escopo v1

- Múltiplos usuários / compartilhamento / colaboração.
- Notificações (push, e-mail).
- App nativo ou PWA instalável (pode ser considerado em versão futura).
- Integrações externas (calendário, e-mail, etc.).
- Recuperação de senha (pode ser Must se for requisito do dono do produto; hoje deixado como melhoria pós-v1).

---

## 6. Rastreabilidade

| Documento | Local |
|-----------|--------|
| Product Brief | [product-brief.md](./product-brief.md) |
| PRD (este) | [PRD.md](./PRD.md) |
| Épicos | [epics.md](./epics.md) — estrutura criada; delegação ao @sm |
| User stories | A criar pelo @sm a partir dos épicos |
| Arquitetura | [architecture.md](./architecture.md) |

---

## 7. Próximos passos (após PRD + épicos)

1. **@architect** — Proposta de arquitetura (stack, modelo de dados, autenticação, hosting).
2. **@sm** — Criar user stories a partir de [epics.md](./epics.md) (E1 a E5), com acceptance criteria.
3. **@po** — Priorizar e refinar backlog.
4. **@dev** — Implementar conforme Story Development Cycle.

---

*PRD Hub v1.0 — Synkra AIOX PM*
