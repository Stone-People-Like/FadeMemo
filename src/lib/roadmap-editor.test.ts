import { describe, expect, it } from "vitest";
import type { RoadmapPhase } from "../types";
import { mergeRoadmapOverride, parseRoadmapOverride, updateRoadmap } from "./roadmap-editor";

const phases: RoadmapPhase[] = [{
  id: "phase-1",
  title: "核心骨架",
  goal: "完成可用闭环",
  source: "README.md",
  items: [{ label: "同步数据", completed: false }],
}];

describe("editable roadmap", () => {
  it("updates phase copy and supports adding, toggling, renaming and removing items", () => {
    let result = updateRoadmap(phases, { type: "update-phase", phaseId: "phase-1", title: "核心闭环", goal: "可以发布" });
    result = updateRoadmap(result, { type: "add-item", phaseId: "phase-1", label: "发布预览版" });
    const addedId = result[0].items[1].id!;
    result = updateRoadmap(result, { type: "update-item", phaseId: "phase-1", itemId: addedId, label: "发布 alpha", completed: true });
    result = updateRoadmap(result, { type: "remove-item", phaseId: "phase-1", itemId: addedId });

    expect(result[0]).toMatchObject({ title: "核心闭环", goal: "可以发布" });
    expect(result[0].items).toEqual([{ label: "同步数据", completed: false }]);
    expect(phases[0].title).toBe("核心骨架");
  });

  it("restores only valid persisted roadmap arrays and assigns stable item ids", () => {
    expect(parseRoadmapOverride("not-json")).toBeNull();
    expect(parseRoadmapOverride(JSON.stringify(phases))?.phases[0].items[0].id).toBe("phase-1-item-0");
    expect(parseRoadmapOverride('[{"id":"duplicate","title":"a","source":"x","items":[]},{"id":"duplicate","title":"b","source":"x","items":[]}]')).toBeNull();
  });

  it("layers edited phases and deletions over newly parsed repository phases", () => {
    const edited = updateRoadmap(phases, { type: "update-phase", phaseId: "phase-1", title: "本地标题", goal: "本地目标" });
    const repositoryNext = [...phases, { id: "phase-2", title: "仓库新增", source: "README.md", items: [] }];
    expect(mergeRoadmapOverride(repositoryNext, { phases: edited, deletedPhaseIds: [] }).map((phase) => phase.title)).toEqual(["本地标题", "仓库新增"]);
    expect(mergeRoadmapOverride(repositoryNext, { phases: edited, deletedPhaseIds: ["phase-1"] }).map((phase) => phase.title)).toEqual(["仓库新增"]);
  });
});
