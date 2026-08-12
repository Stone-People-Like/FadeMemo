export function calendarDayDistance(value: string, now = new Date()): number {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 0;
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  const target = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  return Math.max(0, Math.round((today - target) / 86_400_000));
}
