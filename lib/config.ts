export const SCHOOL_CONFIG_KEY = "vozescolar_school_config";

export const DEFAULT_SCHOOL_CONFIG = {
  name: "Escuela Primaria Benito Juárez",
  logoUrl: "",
  primaryColor: "#1e3a5f",
};

export function getSchoolConfig() {
  if (typeof window === "undefined") return DEFAULT_SCHOOL_CONFIG;
  try {
    const stored = localStorage.getItem(SCHOOL_CONFIG_KEY);
    return stored ? JSON.parse(stored) : DEFAULT_SCHOOL_CONFIG;
  } catch {
    return DEFAULT_SCHOOL_CONFIG;
  }
}
