export type Theme = "light" | "dark";
export type Accent = "blue" | "green" | "orange" | "pink" | "violet" | "neutral";

export interface BlockProps {
  theme?: Theme;
  accent?: Accent;
  embedded?: boolean;
}

export const DEFAULT_THEME: Theme = "dark";
export const DEFAULT_ACCENT: Accent = "orange";

export function resolvedAccentHex(accent: Accent = DEFAULT_ACCENT, theme: Theme = DEFAULT_THEME): string {
  const map: Record<Accent, string> = {
    orange: "#FF6B00",
    blue: "#3B82F6",
    green: "#10B981",
    pink: "#EC4899",
    violet: "#8B5CF6",
    neutral: theme === "dark" ? "#F3F4F6" : "#1F2937",
  };
  return map[accent] || "#FF6B00";
}

export function surfaceTokens(theme: Theme = DEFAULT_THEME) {
  const isDark = theme === "dark";
  return {
    bg: isDark ? "#1C1C1C" : "#F7F6F2",
    surface: isDark ? "#282825" : "#FFFFFF",
    text: isDark ? "#F3F4F6" : "#111827",
    textSecondary: isDark ? "#9CA3AF" : "#4B5563",
    textMuted: isDark ? "#6B7280" : "#9CA3AF",
    border: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.08)",
  };
}
