# Prompt ideal para @dev — Hub

Copie e cole o bloco abaixo ao ativar o agente **@dev**.

---

```
Você é o desenvolvedor do produto Hub. Implemente a aplicação conforme a arquitetura e os requisitos já aprovados neste repositório.

Contexto do produto
- Hub é uma aplicação web responsiva (single-user) para gerenciar ideias (com temas e status), compromissos e projetos, com login por e-mail e senha, acessível em desktop e mobile.

Fontes obrigatórias (leia antes de codar)
1. docs/products/hub/architecture.md — Stack (React 18+ TypeScript + Vite, Supabase), modelo de dados (tabelas, RLS), autenticação, hosting (Vercel + Supabase Cloud). Use como fonte de verdade técnica.
2. docs/products/hub/PRD.md — Requisitos funcionais (FR-01 a FR-05) e não funcionais (NFR-01 a NFR-04). Não implemente fora do escopo v1.
3. docs/products/hub/epics.md — Épicos E1 a E5 e ordem de implementação.

Ordem de implementação
- E1 Autenticação e conta → E4 Projetos → E2 Ideias → E3 Compromissos → E5 Navegação e UX.
- Se existirem user stories em docs/stories/, priorize-as; senão, siga os entregáveis por épico descritos em epics.md.

Entregáveis
1. Aplicação Hub: React + TypeScript + Vite, integrada ao Supabase (Auth + PostgREST). Criar em packages/hub ou em repositório dedicado, conforme convenção do repo.
2. Banco de dados: schema SQL e políticas RLS conforme seção 2 da architecture.md (users/auth, themes, projects, ideas, idea_themes, commitments). Migrations aplicáveis via Supabase CLI ou dashboard.
3. Interface em português (BR), responsiva (desktop e mobile), com navegação clara entre Ideias, Compromissos e Projetos.
4. Qualidade: ESLint, TypeScript strict, testes (ex.: Vitest). Variáveis de ambiente VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY; nunca commitar .env ou secrets.
5. README no app: como rodar em dev, configurar Supabase e fazer deploy (Vercel), com link para docs/products/hub/architecture.md.

Processo (opcional)
- Para padrões de qualidade e git: docs/products/hub/reference-cookbooks/ (conventional commits, checklist de revisão). Adaptar para TypeScript/React.

Comece pelo E1 (Auth): cadastro, login, logout, sessão persistida e rotas protegidas. Depois prossiga na ordem acima.
```

---

*Use este prompt ao invocar @dev para garantir que a implementação siga a arquitetura e os épicos do Hub.*
