import { Complaint } from "./types";

const COMPLAINTS_KEY = "vozescolar_complaints";

export function saveComplaint(complaint: Complaint): void {
  if (typeof window === "undefined") return;
  const existing = getLocalComplaints();
  existing.push(complaint);
  localStorage.setItem(COMPLAINTS_KEY, JSON.stringify(existing));
}

export function getLocalComplaints(): Complaint[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(COMPLAINTS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function getComplaintByFolio(folio: string): Complaint | null {
  const complaints = getLocalComplaints();
  return complaints.find((c) => c.folio === folio) ?? null;
}

export function updateComplaint(id: string, updates: Partial<Complaint>): void {
  if (typeof window === "undefined") return;
  const complaints = getLocalComplaints();
  const idx = complaints.findIndex((c) => c.id === id);
  if (idx !== -1) {
    complaints[idx] = { ...complaints[idx], ...updates };
    localStorage.setItem(COMPLAINTS_KEY, JSON.stringify(complaints));
  }
}
