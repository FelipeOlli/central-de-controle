import { FormEvent, useEffect, useState } from "react";
import { api } from "../lib/api";
import type { Project, ProjectStatus } from "../lib/types";

const statuses: ProjectStatus[] = ["planejamento", "em_andamento", "pausado", "concluido"];

export function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<ProjectStatus>("planejamento");
  const [statusFilter, setStatusFilter] = useState<string>("todos");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function loadData() {
    try {
      const data = await api.projects.list();
      setProjects(data);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar projetos.");
    }
  }

  useEffect(() => {
    void loadData();
  }, []);

  async function createProject(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    try {
      await api.projects.create({
        name,
        description: description || null,
        status,
      });
      setName("");
      setDescription("");
      setStatus("planejamento");
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar projeto.");
    } finally {
      setLoading(false);
    }
  }

  async function removeProject(id: string) {
    try {
      await api.projects.remove(id);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao excluir projeto.");
    }
  }

  async function updateStatus(id: string, nextStatus: ProjectStatus) {
    try {
      await api.projects.update(id, { status: nextStatus });
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao atualizar status.");
    }
  }

  const filtered = projects.filter((project) =>
    statusFilter === "todos" ? true : project.status === statusFilter,
  );

  return (
    <section className="stack">
      <h2>Projetos</h2>

      <form className="card stack" onSubmit={createProject}>
        <h3>Novo projeto</h3>
        <label>
          Nome
          <input value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
        <label>
          Descrição
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
        </label>
        <label>
          Status
          <select value={status} onChange={(e) => setStatus(e.target.value as ProjectStatus)}>
            {statuses.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
        <button disabled={loading} type="submit">
          {loading ? "Salvando..." : "Criar projeto"}
        </button>
      </form>

      <div className="row">
        <label>
          Filtro por status
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="todos">Todos</option>
            {statuses.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
      </div>

      {error && <p className="error">{error}</p>}

      <div className="grid">
        {filtered.map((project) => (
          <article key={project.id} className="card stack">
            <h3>{project.name}</h3>
            <p>{project.description || "Sem descrição."}</p>
            <p>
              <strong>Status:</strong> {project.status}
            </p>
            <p>
              <strong>Ideias vinculadas:</strong> {project._count?.ideas ?? 0}
            </p>
            <p>
              <strong>Compromissos vinculados:</strong> {project._count?.commitments ?? 0}
            </p>
            <label>
              Alterar status
              <select
                value={project.status}
                onChange={(e) => void updateStatus(project.id, e.target.value as ProjectStatus)}
              >
                {statuses.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
            <button className="danger" onClick={() => void removeProject(project.id)}>
              Excluir
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
