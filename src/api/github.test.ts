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

const commit = (sha: string, date = "2026-08-09T00:00:00Z") => ({
  sha,
  html_url: `https://github.com/Stone-People-Like/FadeMemo/commit/${sha}`,
  author: { login: "tester", avatar_url: "", html_url: "https://github.com/tester" },
  commit: {
    message: sha,
    author: { name: "tester", date },
    committer: { date },
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
      if (url.pathname.endsWith("/stats/contributors")) return json([{
        total: 1,
        author: { login: "tester", avatar_url: "", html_url: "https://github.com/tester" },
        weeks: [{ w: 1785715200, a: 10, d: 2, c: 1 }],
      }]);
      if (url.pathname.includes("/contents/")) return json({ content: "" });
      if (url.pathname.endsWith("/pulls")) return json([{
        number: 30,
        title: "修正活动时间",
        body: "取真实协作活动时间。",
        state: "closed",
        user: { login: "tester", avatar_url: "", html_url: "https://github.com/tester" },
        merged_at: "2026-08-11T10:00:00Z",
        created_at: "2026-08-10T09:00:00Z",
        updated_at: "2026-08-12T13:00:00Z",
        html_url: "https://github.com/Stone-People-Like/FadeMemo/pull/30",
        milestone: null,
      }]);
      if (url.pathname.endsWith("/pulls/30/reviews")) return json([]);
      if (url.pathname.endsWith("/issues")) return json([{
        number: 29,
        title: "查看协作详情",
        body: "在看板中阅读条目摘要并跳转 GitHub。",
        state: "open",
        user: { login: "reporter", avatar_url: "", html_url: "https://github.com/reporter" },
        created_at: "2026-08-11T09:00:00Z",
        updated_at: "2026-08-11T10:00:00Z",
        html_url: "https://github.com/Stone-People-Like/FadeMemo/issues/29",
        milestone: null,
      }]);
      if (url.pathname.endsWith("/commits")) return json([commit(url.searchParams.get("sha") === "main" ? "main-sha" : "dashboard-sha", "2026-08-11T12:00:00Z")]);
      if (url.pathname.includes("/compare/")) return json({ message: "No common ancestor between main and feature/github-dashboard." }, 404);
      return json([]);
    }));

    const data = await fetchDashboardData(true);
    const dashboardBranch = data.branches.find((branch) => branch.name === "feature/github-dashboard");

    expect(dashboardBranch).toMatchObject({ ahead: null, behind: null });
    expect(data.issues[0]).toMatchObject({ number: 29, user: "reporter", body: "在看板中阅读条目摘要并跳转 GitHub。" });
    expect(data.contributors.find((contributor) => contributor.login === "tester")?.lastActiveAt).toBe("2026-08-12T13:00:00Z");
    expect(data.status.partialFailures).not.toContain(
      "feature/github-dashboard 分支差异：No common ancestor between main and feature/github-dashboard.",
    );
  });
});
