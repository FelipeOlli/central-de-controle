import type {
  Commitment,
  CommitmentStatus,
  Idea,
  IdeaPriority,
  IdeaStatus,
  Project,
  ProjectStatus,
  Theme,
  UserSession,
} from "./types";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(path, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers ?? {}),
      },
      ...init,
    });
  } catch (_err) {
    throw new Error(
      "Não foi possível conectar ao servidor. Verifique se a API está rodando (npm run dev -w @aiox/hub).",
    );
  }

  if (!response.ok) {
    const errorBody = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(errorBody?.error ?? `Erro ${response.status}: Falha na requisição.`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export const api = {
  auth: {
    me: () => request<UserSession>("/api/auth/me"),
    register: (email: string, password: string) =>
      request<UserSession>("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }),
    login: (email: string, password: string) =>
      request<UserSession>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }),
    logout: () => request<void>("/api/auth/logout", { method: "POST" }),
  },
  projects: {
    list: () => request<Project[]>("/api/projects"),
    create: (data: { name: string; description: string | null; status: ProjectStatus }) =>
      request<Project>("/api/projects", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: string, data: Partial<{ name: string; description: string | null; status: ProjectStatus }>) =>
      request<Project>(`/api/projects/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    remove: (id: string) =>
      request<void>(`/api/projects/${id}`, {
        method: "DELETE",
      }),
  },
  themes: {
    list: () => request<Theme[]>("/api/themes"),
    create: (name: string) =>
      request<Theme>("/api/themes", {
        method: "POST",
        body: JSON.stringify({ name }),
      }),
  },
  ideas: {
    list: () => request<Idea[]>("/api/ideas"),
    create: (data: {
      title: string;
      description: string | null;
      status: IdeaStatus;
      priority: IdeaPriority;
      projectId: string | null;
    }) =>
      request<Idea>("/api/ideas", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (
      id: string,
      data: Partial<{
        title: string;
        description: string | null;
        status: IdeaStatus;
        priority: IdeaPriority | null;
        projectId: string | null;
      }>,
    ) =>
      request<Idea>(`/api/ideas/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    setThemes: (id: string, themeIds: string[]) =>
      request<void>(`/api/ideas/${id}/themes`, {
        method: "POST",
        body: JSON.stringify({ themeIds }),
      }),
    remove: (id: string) =>
      request<void>(`/api/ideas/${id}`, {
        method: "DELETE",
      }),
  },
  commitments: {
    list: () => request<Commitment[]>("/api/commitments"),
    create: (data: {
      title: string;
      description: string | null;
      dueDate: string;
      status: CommitmentStatus;
      projectId: string | null;
    }) =>
      request<Commitment>("/api/commitments", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (
      id: string,
      data: Partial<{
        title: string;
        description: string | null;
        dueDate: string;
        status: CommitmentStatus;
        projectId: string | null;
      }>,
    ) =>
      request<Commitment>(`/api/commitments/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    remove: (id: string) =>
      request<void>(`/api/commitments/${id}`, {
        method: "DELETE",
      }),
  },
};
