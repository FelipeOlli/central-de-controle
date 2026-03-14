import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { api } from "../lib/api";
import type { Commitment, Idea, Project } from "../lib/types";
import { isCommitmentOverdue, isDateInCurrentWeek } from "../lib/commitments";

type ViewMode = "dashboard" | "tudo";

const LIMIT_TUDO = 8;

export function InicioPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("dashboard");
  const [projects, setProjects] = useState<Project[]>([]);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [commitments, setCommitments] = useState<Commitment[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadData() {
    setLoading(true);
    try {
      const [projectsData, ideasData, commitmentsData] = await Promise.all([
        api.projects.list(),
        api.ideas.list(),
        api.commitments.list(),
      ]);
      setProjects(projectsData);
      setIdeas(ideasData);
      setCommitments(commitmentsData);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar dados.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadData();
  }, []);

  const commitmentsNormalized = useMemo(
    () =>
      commitments.map((c) => ({
        ...c,
        status: isCommitmentOverdue(c.dueDate, c.status) ? "atrasado" as const : c.status,
      })),
    [commitments],
  );

  const overdue = useMemo(
    () => commitmentsNormalized.filter((c) => c.status === "atrasado"),
    [commitmentsNormalized],
  );
  const thisWeek = useMemo(
    () => commitmentsNormalized.filter((c) => c.status !== "cumprido" && isDateInCurrentWeek(c.dueDate)),
    [commitmentsNormalized],
  );
  const activeProjects = useMemo(
    () => projects.filter((p) => p.status === "em_andamento"),
    [projects],
  );
  const recentIdeas = useMemo(
    () => [...ideas].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5),
    [ideas],
  );

  if (loading) {
    return (
      <section className="stack">
        <p className="muted">Carregando...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="stack">
        <p className="error">{error}</p>
      </section>
    );
  }

  return (
    <section className="stack">
      <div className="inicio-header">
        <h2>Visão geral</h2>
        <div className="tabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={viewMode === "dashboard"}
            className={viewMode === "dashboard" ? "tab active" : "tab"}
            onClick={() => setViewMode("dashboard")}
          >
            Dashboard
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={viewMode === "tudo"}
            className={viewMode === "tudo" ? "tab active" : "tab"}
            onClick={() => setViewMode("tudo")}
          >
            Tudo em uma aba
          </button>
        </div>
      </div>

      {viewMode === "dashboard" && (
        <div className="tab-content bento-wrap">
          {/* Grid bento no estilo Year Wrapped */}
          <div className="bento-grid">
            {/* Hero card — ocupa 2 colunas, gradiente */}
            <div className="card bento-hero">
              <span className="card-label">Sua visão</span>
              <div className="bento-hero-title">Hub</div>
              <p className="bento-hero-sub">
                {ideas.length + commitments.length + projects.length === 0
                  ? "Crie projetos, ideias e compromissos para começar."
                  : "Tudo em um lugar: projetos, ideias e compromissos."}
              </p>
            </div>

            {/* Métrica: Total Projetos */}
            <div className="card bento-metric">
              <span className="card-label">Total de projetos</span>
              <div className="bento-metric-value bento-metric-accent">{projects.length}</div>
              <Link to="/projetos">Ver todos</Link>
            </div>

            {/* Card branco de contraste — "Em destaque" */}
            <div className="card bento-white">
              <span className="card-label bento-white-label">Em destaque</span>
              <p className="bento-white-title">
                {activeProjects.length > 0 ? "Projetos em andamento" : "Ideias ativas"}
              </p>
              <p className="bento-white-desc">
                {activeProjects.length > 0
                  ? `${activeProjects.length} projeto(s) ativo(s). Foco e consistência.`
                  : ideas.filter((i) => i.status === "ativa").length > 0
                    ? "Você tem ideias ativas. Vale explorar e priorizar."
                    : "Crie sua primeira ideia ou projeto para começar."}
              </p>
              <Link to={activeProjects.length > 0 ? "/projetos" : "/ideias"} className="bento-white-link">
                Ver
              </Link>
            </div>

            {/* Métrica: Ideias + Compromissos */}
            <div className="card bento-metric">
              <span className="card-label">Ideias</span>
              <div className="bento-metric-value">{ideas.length}</div>
              <Link to="/ideias">Ver todas</Link>
            </div>
            <div className="card bento-metric">
              <span className="card-label">Compromissos</span>
              <div className="bento-metric-value">{commitments.length}</div>
              {thisWeek.length > 0 && (
                <span className="chip">{thisWeek.length} esta semana</span>
              )}
              <Link to="/compromissos">Ver todos</Link>
            </div>

            {/* Card largo: lista (ex.: Top Tech Stack → aqui: Compromissos esta semana) */}
            <div className="card bento-wide">
              <div className="section-header">
                <span className="card-label">Compromissos esta semana</span>
                <Link to="/compromissos">Ver todos</Link>
              </div>
              {thisWeek.length === 0 ? (
                <p className="muted">Nenhum compromisso esta semana.</p>
              ) : (
                <ul className="compact-list">
                  {thisWeek.slice(0, 4).map((c) => (
                    <li key={c.id}>
                      <strong>{c.title}</strong> — {c.dueDate}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Card gradiente: atrasados ou "Top categoria" */}
            <div className="card bento-gradient">
              <span className="card-label">Atenção</span>
              <div className="bento-gradient-title">
                {overdue.length > 0 ? `${overdue.length} atrasado(s)` : "Tudo em dia"}
              </div>
              <p className="muted">
                {overdue.length > 0
                  ? "Compromissos passaram do vencimento."
                  : "Nenhum compromisso atrasado."}
              </p>
              <Link to="/compromissos">Ver compromissos</Link>
            </div>

            {/* Card tipo heatmap: mini grid (atividade) */}
            <div className="card bento-mini">
              <span className="card-label">Resumo</span>
              <div className="bento-mini-grid" aria-hidden>
                {[
                  projects.length,
                  ideas.length,
                  commitments.length,
                  overdue.length,
                  thisWeek.length,
                  activeProjects.length,
                ].map((n, i) => (
                  <div
                    key={i}
                    className="bento-mini-dot"
                    style={{ opacity: n > 0 ? 0.3 + Math.min(n / 10, 0.7) : 0.15 }}
                  />
                ))}
              </div>
              <p className="muted">Projetos · Ideias · Compromissos</p>
            </div>

            {/* Faixa inferior: CTA (como "Share your Wrapped") */}
            <div className="bento-cta">
              <div>
                <h3 className="bento-cta-title">Acesso rápido</h3>
                <p className="muted">Navegue para projetos, ideias e compromissos.</p>
              </div>
              <div className="bento-cta-buttons">
                <Link to="/projetos" className="bento-cta-btn bento-cta-btn-outline">
                  Projetos
                </Link>
                <Link to="/ideias" className="bento-cta-btn bento-cta-btn-primary">
                  Ideias
                </Link>
                <Link to="/compromissos" className="bento-cta-btn bento-cta-btn-outline">
                  Compromissos
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {viewMode === "tudo" && (
        <div className="tab-content tudo-view stack">
          <div className="card stack">
            <div className="section-header">
              <h3>Projetos</h3>
              <Link to="/projetos">Ver todos</Link>
            </div>
            {projects.length === 0 ? (
              <p className="muted">Nenhum projeto.</p>
            ) : (
              <ul className="compact-list">
                {projects.slice(0, LIMIT_TUDO).map((p) => (
                  <li key={p.id}>
                    <strong>{p.name}</strong>
                    <span className="muted"> — {p.status}</span>
                    {p._count && (p._count.ideas > 0 || p._count.commitments > 0) && (
                      <span className="muted"> ({p._count.ideas} ideias, {p._count.commitments} comp.)</span>
                    )}
                  </li>
                ))}
              </ul>
            )}
            {projects.length > LIMIT_TUDO && (
              <Link to="/projetos">+{projects.length - LIMIT_TUDO} mais em Projetos</Link>
            )}
          </div>

          <div className="card stack">
            <div className="section-header">
              <h3>Ideias</h3>
              <Link to="/ideias">Ver todos</Link>
            </div>
            {ideas.length === 0 ? (
              <p className="muted">Nenhuma ideia.</p>
            ) : (
              <ul className="compact-list">
                {ideas.slice(0, LIMIT_TUDO).map((idea) => (
                  <li key={idea.id}>
                    <strong>{idea.title}</strong>
                    <span className="muted"> — {idea.status}</span>
                    {idea.themes && idea.themes.length > 0 && (
                      <span className="muted"> [{idea.themes.map((t) => t.name).join(", ")}]</span>
                    )}
                  </li>
                ))}
              </ul>
            )}
            {ideas.length > LIMIT_TUDO && (
              <Link to="/ideias">+{ideas.length - LIMIT_TUDO} mais em Ideias</Link>
            )}
          </div>

          <div className="card stack">
            <div className="section-header">
              <h3>Compromissos</h3>
              <Link to="/compromissos">Ver todos</Link>
            </div>
            {commitmentsNormalized.length === 0 ? (
              <p className="muted">Nenhum compromisso.</p>
            ) : (
              <ul className="compact-list">
                {commitmentsNormalized.slice(0, LIMIT_TUDO).map((c) => (
                  <li key={c.id}>
                    <strong>{c.title}</strong>
                    <span className="muted"> — venc. {c.dueDate}</span>
                    {c.status === "atrasado" && <span className="error"> (atrasado)</span>}
                  </li>
                ))}
              </ul>
            )}
            {commitmentsNormalized.length > LIMIT_TUDO && (
              <Link to="/compromissos">+{commitmentsNormalized.length - LIMIT_TUDO} mais em Compromissos</Link>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
