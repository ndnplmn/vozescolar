import { createClient } from "@supabase/supabase-js";

// Active Supabase credentials for VozEscolar (bwmmnlkberwgjqikjuap)
const DEFAULT_SUPABASE_URL = "https://bwmmnlkberwgjqikjuap.supabase.co";
const DEFAULT_SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3bW1ubGtiZXJ3Z2pxaWtqdWFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM2NjM4MTUsImV4cCI6MjEwOTIzOTgxNX0.iZchQrpDxV6udJLA9TlNckpZ3lYp82PBLT5dOeG8cZk";
const DEFAULT_SUPABASE_SERVICE_ROLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3bW1ubGtiZXJ3Z2pxaWtqdWFwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MzY2MzgxNSwiZXhwIjoyMTA5MjM5ODE1fQ.tAqYHtW1kZ8WPTbt8bAAK2tVOiOGjwrpIagz85qT8kw";

function isValidKeyForProject(key: string | undefined): boolean {
  if (!key) return false;
  try {
    const parts = key.split(".");
    if (parts.length !== 3) return false;
    const json = typeof atob === "function"
      ? atob(parts[1].replace(/-/g, "+").replace(/_/g, "/"))
      : Buffer.from(parts[1], "base64").toString("utf8");
    const payload = JSON.parse(json);
    return payload.ref === "bwmmnlkberwgjqikjuap";
  } catch {
    return false;
  }
}

const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const url = (!rawUrl || !rawUrl.includes("bwmmnlkberwgjqikjuap")) ? DEFAULT_SUPABASE_URL : rawUrl;

const anon = isValidKeyForProject(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  : DEFAULT_SUPABASE_ANON_KEY;

const serviceRole = isValidKeyForProject(process.env.SUPABASE_SERVICE_ROLE_KEY)
  ? process.env.SUPABASE_SERVICE_ROLE_KEY!
  : DEFAULT_SUPABASE_SERVICE_ROLE_KEY;

// Browser client — uses anon key, respects RLS
export const supabase = createClient(url, anon, {
  auth: { persistSession: true, autoRefreshToken: true },
  realtime: { params: { eventsPerSecond: 10 } },
});

// Server client — uses service role key, bypasses RLS
// Only import this in API routes (server-side), never in components
export function createServerClient() {
  return createClient(url, serviceRole, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
