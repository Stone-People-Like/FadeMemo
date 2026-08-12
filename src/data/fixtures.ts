import { generateSuggestions, scoreContributors } from "../lib/analytics";
import type { DashboardData, RoadmapPhase } from "../types";

const repository = {
  name: "FadeMemo",
  fullName: "Stone-People-Like/FadeMemo",
  description: "一份越不回顾就越模糊的笔记。",
  htmlUrl: "https://github.com/Stone-People-Like/FadeMemo",
  defaultBranch: "main",
  stars: 27,
  forks: 6,
  openIssues: 9,
  watchers: 11,
  updatedAt: "2026-08-09T03:09:40Z",
};

const contributors = scoreContributors([
  {
    login: "guhuihe12",
    avatarUrl: "https://avatars.githubusercontent.com/u/9919?v=4",
    profileUrl: "https://github.com/guhuihe12",
    commits: 34,
    mergedPullRequests: 8,
    reviews: 5,
    additions: 6840,
    deletions: 1740,
    lastActiveAt: "2026-08-09T03:09:40Z",
    weekly: [
      { week: "2026-07-20", commits: 12, additions: 2100, deletions: 480 },
      { week: "2026-07-27", commits: 14, additions: 2860, deletions: 610 },
      { week: "2026-08-03", commits: 8, additions: 1880, deletions: 650 },
    ],
    mergedPullRequestDates: ["2026-07-21", "2026-07-22", "2026-07-23", "2026-07-24", "2026-07-26", "2026-07-28", "2026-08-02", "2026-08-08"],
    reviewDates: ["2026-07-24", "2026-07-31", "2026-08-02", "2026-08-08", "2026-08-09"],
  },
  {
    login: "xaopengyo-1010",
    avatarUrl: "https://avatars.githubusercontent.com/u/583231?v=4",
    profileUrl: "https://github.com/xaopengyo-1010",
    commits: 18,
    mergedPullRequests: 4,
    reviews: 7,
    additions: 3920,
    deletions: 1220,
    lastActiveAt: "2026-08-02T07:59:26Z",
    weekly: [
      { week: "2026-07-20", commits: 5, additions: 920, deletions: 180 },
      { week: "2026-07-27", commits: 10, additions: 2400, deletions: 780 },
      { week: "2026-08-03", commits: 3, additions: 600, deletions: 260 },
    ],
    mergedPullRequestDates: ["2026-07-30", "2026-08-01", "2026-08-02", "2026-08-02"],
    reviewDates: ["2026-07-24", "2026-07-28", "2026-07-31", "2026-08-01", "2026-08-02", "2026-08-04", "2026-08-08"],
  },
  {
    login: "stone-people-bot",
    commits: 7,
    mergedPullRequests: 2,
    reviews: null,
    additions: 760,
    deletions: 180,
    lastActiveAt: "2026-08-08T14:36:05Z",
    weekly: [{ week: "2026-08-03", commits: 7, additions: 760, deletions: 180 }],
    mergedPullRequestDates: ["2026-08-02", "2026-08-08"],
  },
]);

const branches = [
  { name: "main", sha: "d6b7ce7", ahead: 0, behind: 0, updatedAt: "2026-08-09T03:09:40Z" },
  { name: "develop", sha: "fb549d7", ahead: 1, behind: 1, updatedAt: "2026-08-09T03:02:56Z" },
  { name: "feature/android-ui-design", sha: "e31ecd6", ahead: 2, behind: 9, updatedAt: "2026-07-30T06:15:00Z" },
];

const commits = [
  { sha: "d6b7ce7", message: "Develop (#19): 发布 v0.0.1-alpha.4 准备", author: "guhuihe12", date: "2026-08-09T03:09:40Z", url: "https://github.com/Stone-People-Like/FadeMemo/commit/d6b7ce7", parents: ["9bf6dae", "fb549d7"], branches: ["main"] },
  { sha: "fb549d7", message: "chore(release): 改版为 0.0.1-alpha.4+3 (#18)", author: "guhuihe12", date: "2026-08-09T03:02:56Z", url: "https://github.com/Stone-People-Like/FadeMemo/commit/fb549d7", parents: ["4b522d2"], branches: ["develop"] },
  { sha: "4b522d2", message: "chore(release): 改版为 0.0.1-alpha.4+3", author: "stone-people-bot", date: "2026-08-08T14:36:05Z", url: "https://github.com/Stone-People-Like/FadeMemo/commit/4b522d2", parents: ["e881543"], branches: ["develop"] },
  { sha: "9bf6dae", message: "feat(website): 重构 landing page 商业级 UI", author: "guhuihe12", date: "2026-08-08T11:20:00Z", url: "https://github.com/Stone-People-Like/FadeMemo/commit/9bf6dae", parents: ["57948f6"], branches: ["main"] },
  { sha: "e881543", message: "fix(ui): 修复矮屏宣传片弹窗关闭入口不可见 (#16)", author: "xaopengyo-1010", date: "2026-08-02T07:59:26Z", url: "https://github.com/Stone-People-Like/FadeMemo/commit/e881543", parents: ["b313fc2"], branches: ["develop"] },
  { sha: "e31ecd6", message: "feat(design): add Android launcher assets", author: "xaopengyo-1010", date: "2026-07-30T06:15:00Z", url: "https://github.com/Stone-People-Like/FadeMemo/commit/e31ecd6", parents: ["6cb3be9"], branches: ["feature/android-ui-design"] },
  { sha: "b313fc2", message: "fix(ui): 修复矮屏弹窗关闭入口", author: "xaopengyo-1010", date: "2026-08-02T07:53:00Z", url: "https://github.com/Stone-People-Like/FadeMemo/commit/b313fc2", parents: ["bb10cc6"], branches: ["develop"] },
  { sha: "6cb3be9", message: "docs(design): define Android visual system", author: "xaopengyo-1010", date: "2026-07-30T05:20:00Z", url: "https://github.com/Stone-People-Like/FadeMemo/commit/6cb3be9", parents: ["bb10cc6"], branches: ["feature/android-ui-design"] },
  { sha: "bb10cc6", message: "fix(ui): 优化官网移动端布局适配 (#14)", author: "xaopengyo-1010", date: "2026-08-02T05:21:17Z", url: "https://github.com/Stone-People-Like/FadeMemo/commit/bb10cc6", parents: ["57948f6"], branches: ["develop"] },
  { sha: "57948f6", message: "feat(website): 重构 landing page", author: "guhuihe12", date: "2026-07-29T16:20:00Z", url: "https://github.com/Stone-People-Like/FadeMemo/commit/57948f6", parents: [], branches: ["main", "develop", "feature/android-ui-design"] },
];

const pulls = [
  { number: 19, title: "发布 v0.0.1-alpha.4 准备", body: "整理版本号、变更日志和发布前检查项。", user: "guhuihe12", state: "closed" as const, mergedAt: "2026-08-09T03:09:40Z", createdAt: "2026-08-09", updatedAt: "2026-08-09", htmlUrl: "https://github.com/Stone-People-Like/FadeMemo/pull/19", reviewers: ["xaopengyo-1010"], reviewsLoaded: true },
  { number: 16, title: "修复矮屏宣传片弹窗关闭入口不可见", body: "保证短屏设备滚动后仍可访问关闭按钮。", user: "xaopengyo-1010", state: "closed" as const, mergedAt: "2026-08-02T07:59:26Z", createdAt: "2026-08-02", updatedAt: "2026-08-02", htmlUrl: "https://github.com/Stone-People-Like/FadeMemo/pull/16", reviewers: [], reviewsLoaded: true },
];

const issues = Array.from({ length: 9 }, (_, index) => ({
  number: 20 + index,
  title: ["补齐 Go 损坏引擎", "信息填空模式", "错误检测模式", "发布流程自动化"][index % 4],
  body: ["补齐后端损坏等级与恢复逻辑。", "完善信息填空挑战的交互闭环。", "增加错误检测模式与结果反馈。", "整理自动发布和版本校验流程。"][index % 4],
  user: ["guhuihe12", "xaopengyo-1010", "stone-people-bot"][index % 3],
  state: index < 7 ? "open" as const : "closed" as const,
  createdAt: `2026-07-${String(20 + index).padStart(2, "0")}`,
  updatedAt: index === 0 ? "2026-08-11T17:35:30Z" : `2026-08-${String(1 + index).padStart(2, "0")}`,
  htmlUrl: `https://github.com/Stone-People-Like/FadeMemo/issues/${20 + index}`,
}));

const releases = [
  { id: 4, name: "v0.0.1-alpha.4", tag: "v0.0.1-alpha.4", publishedAt: "2026-08-09T03:30:00Z", prerelease: true, htmlUrl: "https://github.com/Stone-People-Like/FadeMemo/releases/tag/v0.0.1-alpha.4" },
  { id: 3, name: "v0.0.1-alpha.3", tag: "v0.0.1-alpha.3", publishedAt: "2026-07-31T08:20:00Z", prerelease: true, htmlUrl: "https://github.com/Stone-People-Like/FadeMemo/releases/tag/v0.0.1-alpha.3" },
];

const roadmap: RoadmapPhase[] = [
  { id: "phase-1", title: "第一阶段：核心骨架", goal: "能写笔记、能显示损坏、能填空修复", source: "README.md", items: [{ label: "Flutter 界面", completed: true }, { label: "基础损坏等级", completed: true }, { label: "Go 后端连接", completed: false }, { label: "信息填空模式", completed: false }] },
  { id: "phase-2", title: "第二阶段：模式完整", goal: "五种挑战模式全部上线", source: "README.md", items: [{ label: "错误检测", completed: false }, { label: "对比判断", completed: false }, { label: "时序重组", completed: false }, { label: "缩写还原", completed: false }] },
  { id: "phase-3", title: "第三阶段：体验打磨", goal: "让用户愿意持续使用", source: "README.md", items: [{ label: "损坏动画", completed: true }, { label: "统计面板", completed: false }, { label: "批量导入", completed: false }] },
];

export function getFixtureData(): DashboardData {
  return {
    repository,
    contributors,
    branches,
    commits,
    pulls,
    issues,
    releases,
    roadmap,
    suggestions: generateSuggestions({ repository, contributors, branches, pulls, issues, releases }),
    status: {
      source: "fixture",
      fetchedAt: new Date().toISOString(),
      remaining: null,
      limit: null,
      partialFailures: [],
      availability: { branches: true, pulls: true, reviews: true, issues: true, releases: true, contributorStats: true, roadmapDocuments: true, milestones: true },
    },
  };
}
