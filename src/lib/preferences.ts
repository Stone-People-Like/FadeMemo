export type ThemePreference = "dark" | "light";
export type SyncMinutes = 1 | 5 | 15 | 30;

const SYNC_INTERVALS: SyncMinutes[] = [1, 5, 15, 30];

export function resolveInitialTheme(stored: string | null, systemDark: boolean): ThemePreference {
  if (stored === "dark" || stored === "light") return stored;
  return systemDark ? "dark" : "light";
}

export function normalizeSyncMinutes(stored: string | null): SyncMinutes {
  const value = Number(stored);
  return SYNC_INTERVALS.includes(value as SyncMinutes) ? value as SyncMinutes : 5;
}

export const syncIntervalOptions = SYNC_INTERVALS;
