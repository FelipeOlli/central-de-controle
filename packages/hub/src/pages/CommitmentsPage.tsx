import { FormEvent, useEffect, useMemo, useState } from "react";
import { api } from "../lib/api";
import type { Commitment, CommitmentStatus, Project } from "../lib/types";
import { isCommitmentOverdue, isDateInCurrentWeek } from "../lib/commitments";

const statuses: CommitmentStatus[] = ["pendente", "em_andamento", "cumprido", "atrasado"];

function normalizeStatus(item: Commitment): CommitmentStatus {
  if (isCommitmentOverdue(item.dueDate, item.status)) {
    return "atrasado";
  }
  return item.status;
}

export function CommitmentsPage() {
  const [commitments, setCommitments] = useState<Commitment[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState<CommitmentStatus>("pendente");
  const [projectId, setProjectId] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [dateFilter, setDateFilter] = useState("todos");
  const [error, setError] = useState("");

  async function loadData() {
    try {
      const [commitmentsData, projectsData] = await Promise.all([
        api.commitments.list(),
        api.projects.list(),
      ]);

      const normalized = commitmentsData.map((item) => ({
        ...item,
        status: normalizeStatus(item),
      }));

      setCommitments(normalized);
      setProjects(projectsData);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar.");
    }
  }

  useEffect(() => {
    void loadData();
  }, []);

  async function createCommitment(event: FormEvent) {
    event.preventDefault();
    try {
      await api.commitments.create({
        title,
        description: description || null,
        dueDate,
        status,
        projectId: projectId || null,
      });
      setTitle("");
      setDescription("");
      setDueDate("");
      setStatus("pendente");
      setProjectId("");
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar compromisso.");
    }
  }

  async function updateStatus(id: string, nextStatus: CommitmentStatus) {
    try {
      await api.commitments.update(id, { status: nextStatus });
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao atualizar status.");
    }
  }

  async function removeCommitment(id: string) {
    try {
      await api.commitments.remove(id);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao excluir compromisso.");
    }
  }

  const filtered = useMemo(
    () =>
      commitments.filter((item) => {
        if (statusFilter !== "todos" && item.status !== statusFilter) return false;
        if (dateFilter === "vencidos") return item.status === "atrasado";
        if (dateFilter === "semana") return isDateInCurrentWeek(item.dueDate);
        return true;
      }),
    [commitments, statusFilter, dateFilter],
  );

  return (
    <section className="stack">
      <h2>Compromissos</h2>

      <form className="card stack" onSubmit={createCommitment}>
        <h3>Novo compromisso</h3>
        <label>
          Título
          <input value={title} onChange={(e) => setTitle(e.target.value)} required />
        </label>
        <label>
          Descrição
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
        </label>
        <div className="row">
          <label>
            Data de vencimento
            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required />
          </label>
          <label>
            Status
            <select value={status} onChange={(e) => setStatus(e.target.value as CommitmentStatus)}>
              {statuses.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
        </div>
        <label>
          Projeto vinculado (opcional)
          <select value={projectId} onChange={(e) => setProjectId(e.target.value)}>
            <option value="">Sem projeto</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </label>
        <button type="submit">Criar compromisso</button>
      </form>

      <div className="row">
        <label>
          Status
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="todos">Todos</option>
            {statuses.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
        <label>
          Período
          <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}>
            <option value="todos">Todos</option>
            <option value="vencidos">Vencidos</option>
            <option value="semana">Esta semana</option>
          </select>
        </label>
      </div>

      {error && <p className="error">{error}</p>}

      <div className="grid">
        {filtered.map((item) => (
          <article key={item.id} className="card stack">
            <h3>{item.title}</h3>
            <p>{item.description || "Sem descrição."}</p>
            <p>
              <strong>Vencimento:</strong> {item.dueDate}
            </p>
            <p>
              <strong>Status:</strong> {item.status}
            </p>
            <label>
              Alterar status
              <select
                value={item.status}
                onChange={(e) => void updateStatus(item.id, e.target.value as CommitmentStatus)}
              >
                {statuses.map((statusItem) => (
                  <option key={statusItem} value={statusItem}>
                    {statusItem}
                  </option>
                ))}
              </select>
            </label>
            <button className="danger" onClick={() => void removeCommitment(item.id)}>
              Excluir
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
