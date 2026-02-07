export const THEME_STORAGE_KEY = "app-theme";

export type AppTheme = "light" | "dark" | "system";

function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function resolveTheme(theme: AppTheme): "light" | "dark" {
  return theme === "system" ? getSystemTheme() : theme;
}

export function applyTheme(theme: AppTheme) {
  if (typeof document === "undefined") return;

  const resolved = resolveTheme(theme);
  const root = document.documentElement;

  root.classList.toggle("dark", resolved === "dark");
}

export function getStoredTheme(): AppTheme {
  if (typeof window === "undefined") return "system";
  const theme = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (theme === "light" || theme === "dark" || theme === "system") return theme;
  return "system";
}

export function storeTheme(theme: AppTheme) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(THEME_STORAGE_KEY, theme);
}
