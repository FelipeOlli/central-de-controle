import { FormEvent, useEffect, useMemo, useState } from "react";
import { api } from "../lib/api";
import type { Idea, IdeaPriority, IdeaStatus, Project, Theme } from "../lib/types";

const statuses: IdeaStatus[] = ["rascunho", "ativa", "em_projeto", "concluida", "arquivada"];
const priorities: IdeaPriority[] = ["baixa", "media", "alta"];

export function IdeasPage() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [themes, setThemes] = useState<Theme[]>([]);
  const [ideaThemesMap, setIdeaThemesMap] = useState<Record<string, string[]>>({});
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<IdeaStatus>("rascunho");
  const [priority, setPriority] = useState<IdeaPriority>("media");
  const [projectId, setProjectId] = useState<string>("");
  const [selectedThemeIds, setSelectedThemeIds] = useState<string[]>([]);
  const [newThemeName, setNewThemeName] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("todos");
  const [projectFilter, setProjectFilter] = useState<string>("todos");
  const [themeFilter, setThemeFilter] = useState<string>("todos");
  const [error, setError] = useState("");

  async function loadData() {
    try {
      const [ideasData, projectsData, themesData] = await Promise.all([
        api.ideas.list(),
        api.projects.list(),
        api.themes.list(),
      ]);

      const map: Record<string, string[]> = {};
      ideasData.forEach((idea) => {
        map[idea.id] = (idea.themes ?? []).map((theme) => theme.name);
      });

      setIdeas(ideasData);
      setProjects(projectsData);
      setThemes(themesData);
      setIdeaThemesMap(map);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar dados.");
    }
  }

  useEffect(() => {
    void loadData();
  }, []);

  async function createTheme(event: FormEvent) {
    event.preventDefault();
    const normalized = newThemeName.trim();
    if (!normalized) return;
    try {
      await api.themes.create(normalized);
      setNewThemeName("");
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar tema.");
    }
  }

  async function createIdea(event: FormEvent) {
    event.preventDefault();
    try {
      const inserted = await api.ideas.create({
        title,
        description: description || null,
        status,
        priority,
        projectId: projectId || null,
      });

      if (selectedThemeIds.length > 0) {
        await api.ideas.setThemes(inserted.id, selectedThemeIds);
      }

      setTitle("");
      setDescription("");
      setStatus("rascunho");
      setPriority("media");
      setProjectId("");
      setSelectedThemeIds([]);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao criar ideia.");
    }
  }

  async function updateIdeaStatus(id: string, nextStatus: IdeaStatus) {
    try {
      await api.ideas.update(id, { status: nextStatus });
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao atualizar status.");
    }
  }

  async function removeIdea(id: string) {
    try {
      await api.ideas.remove(id);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao excluir ideia.");
    }
  }

  const filteredIdeas = useMemo(
    () =>
      ideas.filter((idea) => {
        if (statusFilter !== "todos" && idea.status !== statusFilter) return false;
        if (projectFilter !== "todos" && (idea.projectId ?? "sem") !== projectFilter) return false;
        if (themeFilter !== "todos") {
          const tags = ideaThemesMap[idea.id] ?? [];
          return tags.includes(themeFilter);
        }
        return true;
      }),
    [ideas, statusFilter, projectFilter, themeFilter, ideaThemesMap],
  );

  return (
    <section className="stack">
      <h2>Ideias</h2>

      <form className="card stack" onSubmit={createIdea}>
        <h3>Nova ideia</h3>
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
            Status
            <select value={status} onChange={(e) => setStatus(e.target.value as IdeaStatus)}>
              {statuses.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
          <label>
            Prioridade
            <select value={priority} onChange={(e) => setPriority(e.target.value as IdeaPriority)}>
              {priorities.map((item) => (
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
        <fieldset>
          <legend>Temas</legend>
          <div className="chips">
            {themes.map((theme) => (
              <label key={theme.id} className="chip">
                <input
                  type="checkbox"
                  checked={selectedThemeIds.includes(theme.id)}
                  onChange={(event) => {
                    setSelectedThemeIds((current) =>
                      event.target.checked
                        ? [...current, theme.id]
                        : current.filter((item) => item !== theme.id),
                    );
                  }}
                />
                {theme.name}
              </label>
            ))}
          </div>
        </fieldset>
        <button type="submit">Criar ideia</button>
      </form>

      <form className="card row" onSubmit={createTheme}>
        <label>
          Novo tema
          <input value={newThemeName} onChange={(e) => setNewThemeName(e.target.value)} />
        </label>
        <button type="submit">Adicionar tema</button>
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
          Projeto
          <select value={projectFilter} onChange={(e) => setProjectFilter(e.target.value)}>
            <option value="todos">Todos</option>
            <option value="sem">Sem projeto</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Tema
          <select value={themeFilter} onChange={(e) => setThemeFilter(e.target.value)}>
            <option value="todos">Todos</option>
            {themes.map((theme) => (
              <option key={theme.id} value={theme.name}>
                {theme.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      {error && <p className="error">{error}</p>}

      <div className="grid">
        {filteredIdeas.map((idea) => (
          <article key={idea.id} className="card stack">
            <h3>{idea.title}</h3>
            <p>{idea.description || "Sem descrição."}</p>
            <p>
              <strong>Status:</strong> {idea.status}
            </p>
            <p>
              <strong>Prioridade:</strong> {idea.priority ?? "não definida"}
            </p>
            <p>
              <strong>Temas:</strong> {(ideaThemesMap[idea.id] ?? []).join(", ") || "Sem temas"}
            </p>
            <label>
              Alterar status
              <select
                value={idea.status}
                onChange={(e) => void updateIdeaStatus(idea.id, e.target.value as IdeaStatus)}
              >
                {statuses.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
            <button className="danger" onClick={() => void removeIdea(idea.id)}>
              Excluir
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
