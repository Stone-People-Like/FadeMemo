import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchDashboardData } from "./github";

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", "x-ratelimit-remaining": "48", "x-ratelimit-limit": "60" },
  });
}

const repository = {
  name: "FadeMemo",
  full_name: "Stone-People-Like/FadeMemo",
  description: "",
  html_url: "https://github.com/Stone-People-Like/FadeMemo",
  default_branch: "main",
  stargazers_count: 1,
  forks_count: 0,
  open_issues_count: 0,
  watchers_count: 1,
  updated_at: "2026-08-09T00:00:00Z",
};

const commit = (sha: string) => ({
  sha,
  html_url: `https://github.com/Stone-People-Like/FadeMemo/commit/${sha}`,
  author: null,
  commit: {
    message: sha,
    author: { name: "tester", date: "2026-08-09T00:00:00Z" },
    committer: { date: "2026-08-09T00:00:00Z" },
  },
  parents: [],
});

describe("fetchDashboardData", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("treats an orphan branch as not comparable instead of a partial data failure", async () => {
    vi.stubGlobal("fetch", vi.fn(async (input: string | URL | Request) => {
      const url = new URL(String(input));
      if (url.pathname === "/repos/Stone-People-Like/FadeMemo") return json(repository);
      if (url.pathname.endsWith("/branches")) return json([
        { name: "main", commit: { sha: "main-sha" } },
        { name: "feature/github-dashboard", commit: { sha: "dashboard-sha" } },
      ]);
      if (url.pathname.endsWith("/stats/contributors")) return json([]);
      if (url.pathname.includes("/contents/")) return json({ content: "" });
      if (url.pathname.endsWith("/commits")) return json([commit(url.searchParams.get("sha") === "main" ? "main-sha" : "dashboard-sha")]);
      if (url.pathname.includes("/compare/")) return json({ message: "No common ancestor between main and feature/github-dashboard." }, 404);
      return json([]);
    }));

    const data = await fetchDashboardData(true);
    const dashboardBranch = data.branches.find((branch) => branch.name === "feature/github-dashboard");

    expect(dashboardBranch).toMatchObject({ ahead: null, behind: null });
    expect(data.status.partialFailures).not.toContain(
      "feature/github-dashboard 分支差异：No common ancestor between main and feature/github-dashboard.",
    );
  });
});
