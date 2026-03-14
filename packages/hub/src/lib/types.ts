export type ProjectStatus = "planejamento" | "em_andamento" | "pausado" | "concluido";
export type IdeaStatus = "rascunho" | "ativa" | "em_projeto" | "concluida" | "arquivada";
export type IdeaPriority = "baixa" | "media" | "alta";
export type CommitmentStatus = "pendente" | "em_andamento" | "cumprido" | "atrasado";

export interface Theme {
  id: string;
  userId: string;
  name: string;
}

export interface Project {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  status: ProjectStatus;
  createdAt: string;
  _count?: {
    ideas: number;
    commitments: number;
  };
}

export interface Idea {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  status: IdeaStatus;
  priority: IdeaPriority | null;
  projectId: string | null;
  createdAt: string;
  themes?: Theme[];
}

export interface Commitment {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  dueDate: string;
  status: CommitmentStatus;
  projectId: string | null;
  createdAt: string;
}

export interface UserSession {
  id: string;
  email: string;
}
