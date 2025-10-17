import { cookies } from "next/headers";
import { Theme, THEME_COOKIE_NAME, DEFAULT_THEME } from "./theme";

// Server-side: Get theme from cookies
export async function getServerTheme(): Promise<Theme> {
  const cookieStore = await cookies();
  const themeCookie = cookieStore.get(THEME_COOKIE_NAME);
  return (themeCookie?.value as Theme) || DEFAULT_THEME;
}