export type Role = "alumno" | "padre" | "docente" | "personal";

export type Category =
  | "acoso_escolar"
  | "docente"
  | "infraestructura"
  | "administrativo"
  | "seguridad"
  | "otro";

export type Urgency = "critical" | "high" | "medium" | "low";

export type Status =
  | "recibida"
  | "en_revision"
  | "en_proceso"
  | "resuelta"
  | "cerrada";

export interface TimelineEntry {
  status: Status;
  timestamp: string;
  message?: string;
}

export interface Complaint {
  id: string;
  folio: string;
  role: Role;
  content: string;
  category: Category;
  urgency: Urgency;
  status: Status;
  isAnonymous: boolean;
  contentHash: string;
  createdAt: string;
  timeline: TimelineEntry[];
  adminResponse?: string;
  evidenceBase64?: string;
  evidenceName?: string;
  sentimentScore?: number;
}
