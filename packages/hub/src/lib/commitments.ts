import type { CommitmentStatus } from "./types";

export function isCommitmentOverdue(dueDate: string, status: CommitmentStatus): boolean {
  if (status === "cumprido") {
    return false;
  }
  const today = new Date();
  const due = new Date(dueDate);
  return due < today;
}

export function isDateInCurrentWeek(dateIso: string): boolean {
  const now = new Date();
  const day = now.getDay() || 7;
  const monday = new Date(now);
  monday.setDate(now.getDate() - day + 1);
  monday.setHours(0, 0, 0, 0);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);
  const date = new Date(dateIso);
  return date >= monday && date <= sunday;
}
