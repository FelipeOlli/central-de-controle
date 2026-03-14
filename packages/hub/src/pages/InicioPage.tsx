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
        <div className="tab-content stack">
          <div className="dashboard-cards grid">
            <div className="card stack summary-card">
              <span className="card-label">Projetos</span>
              <strong className="summary-number">{projects.length}</strong>
              <Link to="/projetos">Ver todos</Link>
            </div>
            <div className="card stack summary-card">
              <span className="card-label">Ideias</span>
              <strong className="summary-number">{ideas.length}</strong>
              <Link to="/ideias">Ver todos</Link>
            </div>
            <div className="card stack summary-card">
              <span className="card-label">Compromissos</span>
              <strong className="summary-number">{commitments.length}</strong>
              <Link to="/compromissos">Ver todos</Link>
            </div>
          </div>

          <div className="dashboard-grid grid">
            <div className="card stack">
              <span className="card-label">Compromissos atrasados</span>
              <h3 className="sr-only">Compromissos atrasados</h3>
              {overdue.length === 0 ? (
                <p className="muted">Nenhum atrasado.</p>
              ) : (
                <ul className="compact-list">
                  {overdue.slice(0, 5).map((c) => (
                    <li key={c.id}>
                      <strong>{c.title}</strong> — venc. {c.dueDate}
                    </li>
                  ))}
                  {overdue.length > 5 && (
                    <li>
                      <Link to="/compromissos">+{overdue.length - 5} mais</Link>
                    </li>
                  )}
                </ul>
              )}
              <Link to="/compromissos">Ver todos</Link>
            </div>

            <div className="card stack">
              <span className="card-label">Esta semana</span>
              <h3 className="sr-only">Esta semana</h3>
              {thisWeek.length === 0 ? (
                <p className="muted">Nenhum compromisso esta semana.</p>
              ) : (
                <ul className="compact-list">
                  {thisWeek.slice(0, 5).map((c) => (
                    <li key={c.id}>
                      <strong>{c.title}</strong> — {c.dueDate}
                    </li>
                  ))}
                  {thisWeek.length > 5 && (
                    <li>
                      <Link to="/compromissos">+{thisWeek.length - 5} mais</Link>
                    </li>
                  )}
                </ul>
              )}
              <Link to="/compromissos">Ver todos</Link>
            </div>

            <div className="card stack">
              <span className="card-label">Projetos em andamento</span>
              <h3 className="sr-only">Projetos em andamento</h3>
              {activeProjects.length === 0 ? (
                <p className="muted">Nenhum projeto em andamento.</p>
              ) : (
                <ul className="compact-list">
                  {activeProjects.slice(0, 5).map((p) => (
                    <li key={p.id}>
                      <Link to="/projetos">{p.name}</Link>
                      {p._count && (p._count.ideas > 0 || p._count.commitments > 0) && (
                        <span className="muted"> — {p._count.ideas} ideias, {p._count.commitments} comp.</span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
              <Link to="/projetos">Ver todos</Link>
            </div>

            <div className="card stack">
              <span className="card-label">Ideias recentes</span>
              <h3 className="sr-only">Ideias recentes</h3>
              {recentIdeas.length === 0 ? (
                <p className="muted">Nenhuma ideia ainda.</p>
              ) : (
                <ul className="compact-list">
                  {recentIdeas.map((idea) => (
                    <li key={idea.id}>
                      <strong>{idea.title}</strong>
                      <span className="muted"> — {idea.status}</span>
                    </li>
                  ))}
                </ul>
              )}
              <Link to="/ideias">Ver todos</Link>
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
