export const SCHOOL_CONFIG_KEY = "vozescolar_school_config";

export const DEFAULT_SCHOOL_CONFIG = {
  name: "CETIS 52 Hermenegildo Galeana",
  shortName: "CETIS 52",
  logoUrl: "/cetis52-logo.svg",
  primaryColor: "#76082c",
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
