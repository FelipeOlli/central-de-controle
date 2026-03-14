# Product Brief — Hub (Central de Ideias, Compromissos e Projetos)

**Versão:** 1.0  
**Data:** 2025-03-14  
**Owner:** PM (Morgan)  
**Status:** Rascunho para validação

---

## Visão em uma frase

Um sistema **online**, **rico desde o início**, para **um único usuário** centralizar **ideias** (com temas e status), **compromissos** e **projetos** (com status), acessível por **computador e celular** via site responsivo, com **login e senha**.

---

## Problema

- Ideias ficam espalhadas (bloco de notas, e-mail, cabeça).  
- Compromissos e prazos não têm um único lugar.  
- Projetos e “afins” misturam-se com o dia a dia sem visão clara de status.  
- Falta um lugar único, confiável e acessível de qualquer dispositivo.

---

## Proposta de valor

- **Um só lugar:** ideias, compromissos e projetos em uma única aplicação web.  
- **Ideias evoluem:** agrupamento por temas, status e features que façam sentido (ex.: vincular a projeto, prioridade).  
- **Compromissos visíveis:** o que foi prometido, com prazos e acompanhamento.  
- **Projetos com status:** fluxo claro de status (ex.: backlog → em andamento → feito).  
- **Acesso seguro:** login/senha; uso apenas pelo dono dos dados.  
- **Rico desde o início:** não é MVP mínimo; produto já útil e completo no v1.

---

## Usuário-alvo

- **Quem:** uma única pessoa (você).  
- **Uso:** uso pessoal para organizar vida e trabalho.  
- **Onde:** navegador no computador e no celular (site responsivo).

---

## Escopo v1 (o que entra)

| Área | O que entra no v1 |
|------|-------------------|
| **Conta e acesso** | Cadastro único, login e senha, sessão segura, logout. |
| **Ideias** | CRUD de ideias; temas (tags/categorias) para agrupar; status (ex.: rascunho, ativa, em projeto, concluída, arquivada); campos úteis (título, descrição, data, prioridade, link para projeto). |
| **Compromissos** | CRUD de compromissos; título, descrição, data de vencimento, status (pendente, em andamento, cumprido, atrasado); listagem e filtros. |
| **Projetos** | CRUD de projetos; nome, descrição, status (ex.: planejamento, em andamento, pausado, concluído); opção de vincular ideias e compromissos ao projeto. |
| **Experiência** | Site 100% responsivo (desktop e mobile); navegação intuitiva; dados persistidos online (apenas para o usuário logado). |

---

## Fora do v1 (explicitamente não entra agora)

- Múltiplos usuários / compartilhamento / colaboração.  
- Notificações push ou e-mail.  
- App nativo (apenas web responsivo).  
- Integrações (calendário, e-mail, etc.).

---

## Critérios de sucesso (como saber que deu certo)

- Conseguir acessar de um computador e de um celular com a mesma conta.  
- Cadastrar e organizar ideias por temas e status sem frustração.  
- Registrar compromissos com data e acompanhar status.  
- Criar projetos e ver status; vincular ideias/compromissos quando fizer sentido.  
- Sentir que “tudo está num lugar só” e que o produto já vale o uso diário desde o primeiro release.

---

## Próximos passos

1. Validar este brief (ajustes de escopo ou nomenclatura).  
2. PRD detalhado em `PRD.md` (requisitos funcionais e não funcionais).  
3. Delegar ao @sm para criação de épico e user stories; @architect para proposta de arquitetura; @dev para implementação.
