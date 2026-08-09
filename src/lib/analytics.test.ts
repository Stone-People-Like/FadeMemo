import { describe, expect, it } from "vitest";
import {
  buildBranchGraph,
  filterByRange,
  generateSuggestions,
  parseRoadmapMarkdown,
  scoreContributors,
  scoreContributorsForWindow,
} from "./analytics";

describe("scoreContributors", () => {
  it("returns a transparent weighted score and preserves unavailable metrics", () => {
    const [lead, peer] = scoreContributors([
      { login: "lead", commits: 10, mergedPullRequests: 4, reviews: null, additions: 800, deletions: 200 },
      { login: "peer", commits: 5, mergedPullRequests: 2, reviews: null, additions: 200, deletions: 50 },
    ]);

    expect(lead.score).toBe(80);
    expect(peer.score).toBeGreaterThan(35);
    expect(peer.score).toBeLessThan(45);
    expect(lead.normalized.reviews).toBeNull();
  });

  it("does not reward a contributor when a weighted metric is unavailable", () => {
    const metrics = scoreContributors([
      { login: "known", commits: 10, mergedPullRequests: 2, reviews: 0, additions: 100, deletions: 0 },
      { login: "missing", commits: 10, mergedPullRequests: 2, reviews: null, additions: 100, deletions: 0 },
    ]);
    expect(metrics.find((item) => item.login === "missing")?.score).toBe(metrics.find((item) => item.login === "known")?.score);
  });
});

describe("scoreContributorsForWindow", () => {
  it("recalculates every score input inside the selected rolling window", () => {
    const [metric] = scoreContributorsForWindow(
      [{
        login: "dev",
        commits: 11,
        mergedPullRequests: 2,
        reviews: 2,
        additions: 110,
        deletions: 11,
        weekly: [
          { week: "2026-08-03", commits: 3, additions: 30, deletions: 3 },
          { week: "2025-01-01", commits: 8, additions: 80, deletions: 8 },
        ],
        mergedPullRequestDates: ["2026-08-04", "2025-01-03"],
        reviewDates: ["2026-08-05", "2025-01-04"],
      }],
      { range: "30d", now: new Date("2026-08-09") },
    );

    expect(metric).toMatchObject({ commits: 3, mergedPullRequests: 1, reviews: 1, additions: 30, deletions: 3 });
  });
});

describe("filterByRange", () => {
  it("keeps all history by default and applies rolling activity windows", () => {
    const items = [
      { id: "recent", date: "2026-08-01T00:00:00Z" },
      { id: "old", date: "2025-01-01T00:00:00Z" },
    ];
    const now = new Date("2026-08-09T00:00:00Z");

    expect(filterByRange(items, "all", now)).toHaveLength(2);
    expect(filterByRange(items, "30d", now).map((item) => item.id)).toEqual(["recent"]);
  });
});

describe("generateSuggestions", () => {
  it("explains contributor concentration and branch divergence with evidence", () => {
    const contributors = scoreContributors([
      { login: "lead", commits: 18, mergedPullRequests: 8, reviews: 2, additions: 900, deletions: 100 },
      { login: "peer", commits: 2, mergedPullRequests: 1, reviews: 1, additions: 80, deletions: 20 },
    ]);
    const suggestions = generateSuggestions({
      repository: { name: "FadeMemo", fullName: "x/FadeMemo", description: "", htmlUrl: "https://github.com/x/FadeMemo", defaultBranch: "main", stars: 4, forks: 1, openIssues: 2, watchers: 4, updatedAt: "2026-08-01" },
      contributors,
      branches: [
        { name: "main", sha: "a", ahead: 0, behind: 0 },
        { name: "develop", sha: "b", ahead: 12, behind: 1 },
      ],
      pulls: [],
      issues: [],
      releases: [],
    });

    expect(suggestions.some((item) => item.id === "contributor-concentration")).toBe(true);
    expect(suggestions.some((item) => item.id === "branch-divergence")).toBe(true);
  });
});

describe("buildBranchGraph", () => {
  it("assigns stable branch lanes and preserves real merge-parent edges", () => {
    const graph = buildBranchGraph(
      [
        { sha: "m3", message: "merge develop", author: "a", date: "2026-08-03", url: "#", parents: ["m2", "d2"], branches: ["main"] },
        { sha: "d2", message: "feature", author: "b", date: "2026-08-02", url: "#", parents: ["m1"], branches: ["develop"] },
        { sha: "m2", message: "main work", author: "a", date: "2026-08-01", url: "#", parents: ["m1"], branches: ["main"] },
        { sha: "m1", message: "root", author: "a", date: "2026-07-30", url: "#", parents: [], branches: ["main", "develop"] },
      ],
      [
        { name: "main", sha: "m3", ahead: 0, behind: 0 },
        { name: "develop", sha: "d2", ahead: 1, behind: 1 },
      ],
    );

    expect(graph.nodes.find((node) => node.sha === "m3")?.lane).toBe(0);
    expect(graph.nodes.find((node) => node.sha === "d2")?.lane).toBe(1);
    expect(graph.edges).toContainEqual({ from: "m3", to: "d2", merge: true });
    expect(graph.laneCount).toBe(2);
  });

  it("keeps every child above its parent even when author dates are misleading", () => {
    const graph = buildBranchGraph(
      [
        { sha: "child", message: "child", author: "a", date: "2026-01-01", url: "#", parents: ["parent"], branches: ["main"] },
        { sha: "parent", message: "parent", author: "a", date: "2026-08-01", url: "#", parents: [], branches: ["main"] },
      ],
      [{ name: "main", sha: "child", ahead: 0, behind: 0 }],
    );
    expect(graph.nodes.find((node) => node.sha === "child")!.row).toBeLessThan(graph.nodes.find((node) => node.sha === "parent")!.row);
  });
});

describe("parseRoadmapMarkdown", () => {
  it("extracts phases, goals, and checkbox progress from repository markdown", () => {
    const phases = parseRoadmapMarkdown(
      `## 第一阶段：核心骨架\n\n目标：能写笔记、能显示损坏\n\n- [x] Flutter 界面\n- [ ] Go 后端\n\n## 第二阶段：模式完整\n\n- [ ] 错误检测`,
      "README.md",
    );

    expect(phases).toHaveLength(2);
    expect(phases[0]).toMatchObject({
      title: "第一阶段：核心骨架",
      goal: "能写笔记、能显示损坏",
      source: "README.md",
    });
    expect(phases[0].items).toEqual([
      { label: "Flutter 界面", completed: true },
      { label: "Go 后端", completed: false },
    ]);
  });

  it("preserves a phase that has a goal but no checkbox items", () => {
    expect(parseRoadmapMarkdown("## 第三阶段：发布\n\n目标：准备首个稳定版本", "README.md")).toMatchObject([
      { title: "第三阶段：发布", goal: "准备首个稳定版本", items: [] },
    ]);
  });
});
