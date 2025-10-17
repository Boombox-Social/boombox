export type Theme = "light" | "dark";

export const THEME_COOKIE_NAME = "boombox-theme";
export const DEFAULT_THEME: Theme = "dark";

// Client-side: Get theme from cookies
export function getClientTheme(): Theme {
  if (typeof document === "undefined") return DEFAULT_THEME;
  
  const cookies = document.cookie.split("; ");
  const themeCookie = cookies.find((row) =>
    row.startsWith(`${THEME_COOKIE_NAME}=`)
  );
  
  if (themeCookie) {
    const theme = themeCookie.split("=")[1] as Theme;
    return theme;
  }
  
  return DEFAULT_THEME;
}

// Client-side: Set theme cookie (session only)
export function setClientTheme(theme: Theme): void {
  // Session cookie (no max-age or expires)
  document.cookie = `${THEME_COOKIE_NAME}=${theme}; path=/; SameSite=Lax`;
  
  // Apply theme class to document - only use 'dark' class
  if (theme === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
  
  // Dispatch custom event for components to listen to
  window.dispatchEvent(new CustomEvent("themechange", { detail: theme }));
}

// Apply theme class immediately (for preventing flash)
export function applyThemeClass(theme: Theme): void {
  if (typeof document === "undefined") return;
  
  if (theme === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}