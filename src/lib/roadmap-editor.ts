import type { RoadmapPhase } from "../types";

export type RoadmapEditAction =
  | { type: "add-phase"; phase?: RoadmapPhase }
  | { type: "remove-phase"; phaseId: string }
  | { type: "update-phase"; phaseId: string; title: string; goal: string }
  | { type: "add-item"; phaseId: string; label: string; itemId?: string }
  | { type: "update-item"; phaseId: string; itemId: string; label: string; completed: boolean }
  | { type: "remove-item"; phaseId: string; itemId: string };

export interface RoadmapOverride {
  phases: RoadmapPhase[];
  deletedPhaseIds: string[];
}

function createId(prefix: string): string {
  const suffix = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  return `${prefix}-${suffix}`;
}

export function withRoadmapItemIds(phases: RoadmapPhase[]): RoadmapPhase[] {
  return phases.map((phase) => ({
    ...phase,
    items: phase.items.map((item, index) => ({ ...item, id: item.id ?? `${phase.id}-item-${index}` })),
  }));
}

export function updateRoadmap(phases: RoadmapPhase[], action: RoadmapEditAction): RoadmapPhase[] {
  const editedAt = new Date().toISOString();
  if (action.type === "add-phase") {
    return [...phases, action.phase ?? { id: createId("phase"), title: "新阶段", goal: "", source: "本地编辑", items: [], editedAt }];
  }
  if (action.type === "remove-phase") return phases.filter((phase) => phase.id !== action.phaseId);
  return phases.map((phase) => {
    if (phase.id !== action.phaseId) return phase;
    if (action.type === "update-phase") return { ...phase, title: action.title, goal: action.goal, editedAt };
    if (action.type === "add-item") return { ...phase, editedAt, items: [...phase.items, { id: action.itemId ?? createId("item"), label: action.label, completed: false }] };
    if (action.type === "update-item") return { ...phase, editedAt, items: phase.items.map((item) => item.id === action.itemId ? { ...item, label: action.label, completed: action.completed } : item) };
    return { ...phase, editedAt, items: phase.items.filter((item) => item.id !== action.itemId) };
  });
}

function isRoadmapPhase(value: unknown): value is RoadmapPhase {
  if (typeof value !== "object" || value === null) return false;
  const phase = value as Partial<RoadmapPhase>;
  return typeof phase.id === "string" && phase.id.length > 0 && typeof phase.title === "string" && typeof phase.source === "string" &&
    (phase.goal === undefined || typeof phase.goal === "string") && Array.isArray(phase.items) && phase.items.every((item) =>
      typeof item === "object" && item !== null && typeof item.label === "string" && typeof item.completed === "boolean" &&
      ((item as { id?: unknown }).id === undefined || typeof (item as { id?: unknown }).id === "string"));
}

function validOverride(phases: unknown, deletedPhaseIds: unknown): RoadmapOverride | null {
  if (!Array.isArray(phases) || !phases.every(isRoadmapPhase) || !Array.isArray(deletedPhaseIds) || !deletedPhaseIds.every((id) => typeof id === "string")) return null;
  const phaseIds = phases.map((phase) => phase.id);
  if (new Set(phaseIds).size !== phaseIds.length) return null;
  if (phases.some((phase) => {
    const itemIds = phase.items.map((item) => item.id).filter(Boolean);
    return new Set(itemIds).size !== itemIds.length;
  })) return null;
  return { phases: withRoadmapItemIds(phases), deletedPhaseIds: [...new Set(deletedPhaseIds)] };
}

export function parseRoadmapOverride(raw: string | null): RoadmapOverride | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (Array.isArray(parsed)) return validOverride(parsed, []);
    if (typeof parsed !== "object" || parsed === null) return null;
    const override = parsed as { phases?: unknown; deletedPhaseIds?: unknown };
    return validOverride(override.phases, override.deletedPhaseIds);
  } catch {
    return null;
  }
}

export function mergeRoadmapOverride(repositoryPhases: RoadmapPhase[], override: RoadmapOverride | null): RoadmapPhase[] {
  const repository = withRoadmapItemIds(repositoryPhases);
  if (!override) return repository;
  const deleted = new Set(override.deletedPhaseIds);
  const edited = new Map(override.phases.filter((phase) => phase.editedAt || phase.source === "本地编辑").map((phase) => [phase.id, phase]));
  const merged = repository.filter((phase) => !deleted.has(phase.id)).map((phase) => edited.get(phase.id) ?? phase);
  const repositoryIds = new Set(repository.map((phase) => phase.id));
  merged.push(...override.phases.filter((phase) => !repositoryIds.has(phase.id) && !deleted.has(phase.id)));
  return merged;
}
