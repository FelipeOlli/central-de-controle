# Arquitetura — Hub (Central de Ideias, Compromissos e Projetos)

**Versão:** 1.0  
**Data:** 2025-03-14  
**Owner:** Architect (Aria)  
**Status:** Proposta para implementação  
**Referências:** [PRD](./PRD.md) | [Épicos](./epics.md)

> Nota de implementação atual: para acelerar execução local e permitir migração gradual, o Hub foi implementado com API própria (`Express + Prisma`) usando `SQLite` inicialmente, com caminho de migração para `PostgreSQL/MySQL` via `DATABASE_PROVIDER` e `DATABASE_URL`.

---

## 1. Stack técnica

### 1.1 Visão geral

| Camada | Tecnologia | Justificativa |
|--------|------------|---------------|
| **Frontend** | React 18+ com TypeScript + Vite | SPA responsiva (NFR-04.1), tipagem, build rápido; compatível com navegadores modernos (NFR-04.2). |
| **UI / responsividade** | CSS Modules ou Tailwind CSS + breakpoints | Layout responsivo desktop/mobile (FR-05.2); pouco acoplamento. |
| **Backend / API** | Supabase (PostgREST + Edge Functions se necessário) | API REST gerada a partir do schema; auth e DB no mesmo serviço; reduz código custom. |
| **Banco de dados** | PostgreSQL (Supabase) | Persistência em servidor (NFR-02.1); RLS para isolamento single-user (NFR-01.3). |
| **Autenticação** | Supabase Auth (email/senha) | Hash seguro (NFR-01.1), sessão JWT (FR-01.5), HTTPS em produção (NFR-01.2). |

### 1.2 Alinhamento ao PRD

- **Site responsivo, dados em servidor:** Frontend SPA consumindo API Supabase; dados em Postgres, não em localStorage (NFR-02.1).
- **HTTPS e senhas com hash:** Supabase Auth usa bcrypt (ou equivalente) e TLS; produção sempre HTTPS (NFR-01.1, NFR-01.2).
- **Single-user:** Row Level Security (RLS) em todas as tabelas com `auth.uid()`; dados estritamente por usuário (NFR-01.3).
- **Compatibilidade:** React + Vite gera bundle para browsers modernos (Chrome, Firefox, Safari, Edge) em desktop e mobile (NFR-04.2).

### 1.3 Alternativas consideradas

- **Next.js em vez de Vite:** Next oferece SSR e API routes; para Hub (SPA single-user, dados no Supabase) Vite simplifica o stack e o deploy estático.
- **Backend custom (Node/Express):** Aumentaria superfície de manutenção; Supabase já cobre CRUD, auth e RLS.
- **Firebase:** Boa opção; Supabase (Postgres + SQL) facilita modelagem relacional (ideia ↔ tema, vínculos a projeto) e RLS explícito.

---

## 2. Modelo de dados

### 2.1 Entidades e relacionamentos

```
┌─────────────┐       ┌─────────────┐       ┌──────────────┐
│   users     │       │   themes    │       │   projects   │
│ (Supabase   │       │             │       │              │
│  Auth)      │       │ id, name,   │       │ id, name,    │
└──────┬──────┘       │ user_id     │       │ description, │
       │              └──────┬──────┘       │ status,      │
       │                     │              │ user_id      │
       │              ┌──────┴──────┐       └──────┬───────┘
       │              │ idea_themes │              │
       │              │ (N:N)       │              │
       ▼              └──────┬──────┘              │
┌─────────────┐       ┌──────┴──────┐             │
│   ideas     │◄─────┤   ideas     │             │
│             │       │ id, title,   │             │
│ id, title,  │       │ description,│            │
│ description,│       │ status,      │◄───────────┤
│ status,     │       │ priority,    │ project_id  │
│ priority,   │       │ project_id,  │ (FK)       │
│ project_id, │       │ user_id,     │             │
│ user_id,    │       │ created_at   │             │
│ created_at  │       └─────────────┘             │
└─────────────┘                                    │
       │                                           │
       │              ┌─────────────┐               │
       └─────────────►│ commitments │◄─────────────┘
                      │ id, title,  │
                      │ description,│
                      │ due_date,   │
                      │ status,     │
                      │ project_id, │
                      │ user_id     │
                      └─────────────┘
```

### 2.2 Tabelas (schema lógico)

- **users**  
  Gerenciado pelo Supabase Auth (`auth.users`). Para perfil extra (se necessário no v1), pode existir `public.profiles(id uuid references auth.users, ...)` com RLS.

- **themes**  
  `id` (uuid, PK), `user_id` (uuid, FK auth.users), `name` (text, único por usuário). RLS: `user_id = auth.uid()`.

- **projects**  
  `id` (uuid, PK), `user_id` (uuid), `name` (text), `description` (text, opcional), `status` (enum: planejamento, em_andamento, pausado, concluido), `created_at`, `updated_at`. RLS: `user_id = auth.uid()`.

- **ideas**  
  `id` (uuid, PK), `user_id` (uuid), `title` (text), `description` (text, opcional), `status` (enum: rascunho, ativa, em_projeto, concluida, arquivada), `priority` (enum: baixa, media, alta — opcional), `project_id` (uuid, FK projects, nullable), `created_at`, `updated_at`. RLS: `user_id = auth.uid()`.

- **idea_themes**  
  `idea_id` (uuid, FK ideas), `theme_id` (uuid, FK themes). PK (idea_id, theme_id). RLS: garantir que idea e theme pertençam ao mesmo user (via joins ou policies).

- **commitments**  
  `id` (uuid, PK), `user_id` (uuid), `title` (text), `description` (text, opcional), `due_date` (date), `status` (enum: pendente, em_andamento, cumprido, atrasado), `project_id` (uuid, FK projects, nullable), `created_at`, `updated_at`. RLS: `user_id = auth.uid()`.  
  **Regra “Atrasado”:** pode ser enum persistido ou derivado: se `due_date < current_date` e `status != 'cumprido'`, considerar/atualizar como atrasado (lógica em query ou trigger).

### 2.3 Isolamento single-user (NFR-01.3)

- Todas as tabelas de domínio incluem `user_id` (ou são ligadas a entidades com `user_id`).
- RLS em cada tabela: `USING (user_id = auth.uid())` e `WITH CHECK (user_id = auth.uid())`.
- Nenhum dado é compartilhado entre contas; sem multi-tenant no v1.

---

## 3. Autenticação e segurança

### 3.1 Fluxo (FR-01, NFR-01)

- **Cadastro (FR-01.1):** Supabase Auth `signUp({ email, password })`; confirmação por e-mail opcional no v1 (pode ser desabilitada para simplificar).
- **Login (FR-01.2):** `signInWithPassword({ email, password })`; Supabase retorna sessão (JWT + refresh).
- **Logout (FR-01.3):** `signOut()`; cliente descarta token.
- **Rotas protegidas (FR-01.4):** No frontend, roteador verifica se existe sessão (ex.: `supabase.auth.getSession()`); se não houver, redireciona para `/login`. APIs são as do Supabase: todas as requisições já vão com JWT; RLS garante que só dados do `auth.uid()` são acessíveis.
- **Persistência de sessão (FR-01.5):** Supabase persiste refresh token (ex.: em localStorage ou cookie, conforme config); usuário permanece logado entre recarregamentos no mesmo dispositivo.

### 3.2 Conformidade NFR-01

| ID | Requisito | Atendimento |
|----|-----------|-------------|
| NFR-01.1 | Senhas com hash seguro | Supabase Auth usa hashing seguro (bcrypt/argon2); nunca texto puro. |
| NFR-01.2 | HTTPS em produção | Hosting (ex.: Vercel) e Supabase expõem apenas HTTPS em produção. |
| NFR-01.3 | Dados isolados por usuário | RLS em todas as tabelas com `auth.uid()`; sem acesso entre contas. |

### 3.3 Boas práticas

- Variáveis de ambiente para `SUPABASE_URL` e `SUPABASE_ANON_KEY`; nunca expor `service_role` no frontend.
- Anon key é suficiente para o cliente: RLS restringe acesso aos dados do usuário autenticado.

---

## 4. Hosting e deploy

### 4.1 Opções recomendadas

| Componente | Serviço | Justificativa |
|------------|---------|---------------|
| **Frontend (SPA)** | EasyPanel (Docker + Nginx) **ou** Vercel | EasyPanel: controle total em servidor próprio; Vercel: simplicidade e CDN nativa. |
| **Backend / DB / Auth** | Supabase Cloud | Postgres gerenciado, Auth, PostgREST; dados persistidos (NFR-02.1); acessível 24/7 (NFR-02.2). |

### 4.2 Fluxo de deploy

1. Repositório Git conectado ao provedor de deploy:
   - **EasyPanel:** usar `packages/hub/Dockerfile`, build context `.` e build args `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`.
   - **Vercel:** conectar projeto e configurar as mesmas variáveis de ambiente.
2. Supabase: projeto criado no dashboard; migrations aplicadas via Supabase CLI ou SQL no dashboard.

### 4.3 Disponibilidade e SLA (NFR-02.2)

- **EasyPanel (self-hosted):** disponibilidade depende da infra do seu servidor e monitoramento local.
- **Vercel:** SLA em planos pagos; free tier com boa disponibilidade para uso pessoal/single-user.
- **Supabase:** Free tier com limites de uso; planos pagos com SLA definido. Para v1 single-user, free tier costuma ser suficiente; evoluir para plano pago se precisar de garantias formais de uptime.

### 4.4 Considerações

- Domínio customizado: configurável no EasyPanel ou Vercel (e opcionalmente no Supabase para auth).
- Ambiente de staging: outro projeto Supabase + outra aplicação (EasyPanel/Vercel) permite testar antes de produção.

---

## 5. Resumo para @sm e @dev

- **Stack:** React (TypeScript) + Vite no frontend; Supabase (Postgres + Auth + PostgREST) no backend.
- **Modelo:** usuário (Auth), temas, projetos, ideias (N:N com temas, FK opcional para projeto), compromissos (FK opcional para projeto); todos com `user_id` e RLS.
- **Auth:** Supabase Auth (email/senha, JWT, sessão persistida); rotas protegidas no cliente; RLS no servidor.
- **Deploy:** Frontend no EasyPanel (ou Vercel); DB e API no Supabase Cloud.

Documento de arquitetura pode ser detalhado pelo @data-engineer com schema SQL e políticas RLS concretas quando for iniciar a implementação do E1 e do modelo de dados.

---

## 6. Rastreabilidade

| Documento | Local |
|-----------|--------|
| PRD | [PRD.md](./PRD.md) |
| Épicos | [epics.md](./epics.md) |
| Arquitetura (este) | [architecture.md](./architecture.md) |
| User stories | A criar pelo @sm |
| Schema/migrations | A criar pelo @data-engineer / @dev |

---

*Arquitetura Hub v1.0 — Synkra AIOX Architect*
