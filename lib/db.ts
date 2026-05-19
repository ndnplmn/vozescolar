import { supabase } from "./supabase";
import { Complaint, Status } from "./types";

// ── Types matching Supabase rows ──────────────────────────────
interface DBComplaint {
  id: string;
  folio: string;
  role: string;
  content: string;
  category: string;
  urgency: string;
  status: string;
  is_anonymous: boolean;
  content_hash: string | null;
  admin_response: string | null;
  evidence_url: string | null;
  evidence_name: string | null;
  sentiment_score: number | null;
  created_at: string;
  updated_at: string;
  timeline_entries?: DBTimeline[];
}

interface DBTimeline {
  id: string;
  complaint_id: string;
  status: string;
  message: string | null;
  created_at: string;
}

// ── Converters ────────────────────────────────────────────────
function toComplaint(row: DBComplaint): Complaint {
  return {
    id:             row.id,
    folio:          row.folio,
    role:           row.role as Complaint["role"],
    content:        row.content,
    category:       row.category as Complaint["category"],
    urgency:        row.urgency as Complaint["urgency"],
    status:         row.status as Status,
    isAnonymous:    row.is_anonymous,
    contentHash:    row.content_hash ?? "",
    adminResponse:  row.admin_response ?? undefined,
    evidenceName:   row.evidence_name ?? undefined,
    evidenceUrl:    row.evidence_url ?? undefined,
    createdAt:      row.created_at,
    sentimentScore: row.sentiment_score ?? undefined,
    timeline: (row.timeline_entries ?? []).map((t) => ({
      status:    t.status as Status,
      timestamp: t.created_at,
      message:   t.message ?? undefined,
    })),
  };
}

// ── Write: save new complaint ─────────────────────────────────
export async function saveComplaintDB(
  complaint: Omit<Complaint, "timeline"> & { evidenceFile?: File }
): Promise<{ folio: string } | { error: string }> {
  let evidenceUrl: string | null = null;

  // Upload evidence file if provided
  if (complaint.evidenceFile) {
    const ext  = complaint.evidenceFile.name.split(".").pop();
    const path = `${complaint.id}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from("evidence")
      .upload(path, complaint.evidenceFile, { upsert: false });
    if (!uploadError) evidenceUrl = path;
  }

  const { error: insertError } = await supabase.from("complaints").insert({
    id:             complaint.id,
    folio:          complaint.folio,
    role:           complaint.role,
    content:        complaint.content,
    category:       complaint.category,
    urgency:        complaint.urgency,
    status:         "recibida",
    is_anonymous:   complaint.isAnonymous,
    content_hash:   complaint.contentHash,
    evidence_url:   evidenceUrl,
    evidence_name:  complaint.evidenceName ?? null,
  });

  if (insertError) return { error: insertError.message };

  // Insert initial timeline entry
  await supabase.from("timeline_entries").insert({
    complaint_id: complaint.id,
    status:       "recibida",
  });

  return { folio: complaint.folio };
}

// ── Read: get complaint by folio ──────────────────────────────
export async function getComplaintByFolioDB(
  folio: string
): Promise<Complaint | null> {
  const { data, error } = await supabase
    .from("complaints")
    .select("*, timeline_entries(*)")
    .eq("folio", folio)
    .single();

  if (error || !data) return null;
  return toComplaint(data as DBComplaint);
}

// ── Read: get all complaints (admin) ──────────────────────────
export async function getAllComplaintsDB(): Promise<Complaint[]> {
  const { data, error } = await supabase
    .from("complaints")
    .select("*, timeline_entries(*)")
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return (data as DBComplaint[]).map(toComplaint);
}

// ── Update: advance status ────────────────────────────────────
export async function updateStatusDB(
  id: string,
  status: Status,
  message?: string
): Promise<boolean> {
  const { error } = await supabase
    .from("complaints")
    .update({ status })
    .eq("id", id);

  if (error) return false;

  await supabase.from("timeline_entries").insert({
    complaint_id: id,
    status,
    message: message ?? null,
  });

  return true;
}

// ── Update: save admin response ───────────────────────────────
export async function saveAdminResponseDB(
  id: string,
  response: string
): Promise<boolean> {
  const { error } = await supabase
    .from("complaints")
    .update({ admin_response: response, status: "en_proceso" })
    .eq("id", id);

  if (error) return false;

  await supabase.from("timeline_entries").insert({
    complaint_id: id,
    status:       "en_proceso",
    message:      "Respuesta oficial enviada.",
  });

  return true;
}

// ── Update: save sentiment score ──────────────────────────────
export async function saveSentimentDB(
  id: string,
  score: number
): Promise<void> {
  await supabase.from("complaints").update({ sentiment_score: score }).eq("id", id);
}

// ── Read: evidence signed URL (admin only) ────────────────────
export async function getEvidenceUrlDB(path: string): Promise<string | null> {
  const { data } = await supabase.storage
    .from("evidence")
    .createSignedUrl(path, 3600); // 1-hour expiry
  return data?.signedUrl ?? null;
}
