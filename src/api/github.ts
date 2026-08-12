import {
  generateSuggestions,
  mergeBranchCommit,
  parseRoadmapMarkdown,
  scoreContributors,
} from "../lib/analytics";
import type {
  BranchRef,
  CommitNode,
  ContributorInput,
  DataAvailability,
  DashboardData,
  IssueSummary,
  PullRequestSummary,
  ReleaseSummary,
  RepositorySummary,
  RoadmapPhase,
  WeeklyContribution,
} from "../types";

const OWNER = import.meta.env.VITE_GITHUB_OWNER || "Stone-People-Like";
const REPO = import.meta.env.VITE_GITHUB_REPO || "FadeMemo";
const API_ROOT = "https://api.github.com";
const CACHE_TTL = 5 * 60 * 1000;
const MAX_REVIEW_PULLS = 8;
const MAX_PAGES = 10;

let rateRemaining: number | null = null;
let rateLimit: number | null = null;

interface CacheRecord<T> {
  expiresAt: number;
  data: T;
}

export class GitHubApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly remaining: number | null,
  ) {
    super(message);
    this.name = "GitHubApiError";
  }
}

function cacheKey(path: string): string {
  return `fadememo-dashboard:${OWNER}/${REPO}:${path}`;
}

function readCache<T>(path: string): T | null {
  try {
    const raw = sessionStorage.getItem(cacheKey(path));
    if (!raw) return null;
    const record = JSON.parse(raw) as CacheRecord<T>;
    if (record.expiresAt < Date.now()) {
      sessionStorage.removeItem(cacheKey(path));
      return null;
    }
    return record.data;
  } catch {
    return null;
  }
}

function writeCache<T>(path: string, data: T): void {
  try {
    sessionStorage.setItem(
      cacheKey(path),
      JSON.stringify({ data, expiresAt: Date.now() + CACHE_TTL } satisfies CacheRecord<T>),
    );
  } catch {
    // A blocked or full storage area must not block live data.
  }
}

async function request<T>(path: string, force = false): Promise<T> {
  if (!force) {
    const cached = readCache<T>(path);
    if (cached !== null) return cached;
  }

  const response = await fetch(`${API_ROOT}${path}`, {
    headers: {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });
  const remainingHeader = response.headers.get("x-ratelimit-remaining");
  const limitHeader = response.headers.get("x-ratelimit-limit");
  if (remainingHeader) {
    const remaining = Number(remainingHeader);
    rateRemaining = rateRemaining === null ? remaining : Math.min(rateRemaining, remaining);
  }
  rateLimit = limitHeader ? Number(limitHeader) : rateLimit;

  if (response.status === 202) {
    throw new GitHubApiError("GitHub 正在生成统计数据，请稍后刷新。", 202, rateRemaining);
  }
  if (!response.ok) {
    let message = `GitHub API 请求失败（${response.status}）`;
    try {
      const body = (await response.json()) as { message?: string };
      if (body.message) message = body.message;
    } catch {
      // Keep the stable status-based message.
    }
    throw new GitHubApiError(message, response.status, rateRemaining);
  }
  const data = (await response.json()) as T;
  writeCache(path, data);
  return data;
}

async function requestPaginated<T>(path: string, force = false, maxPages = MAX_PAGES): Promise<T[]> {
  const results: T[] = [];
  for (let page = 1; page <= maxPages; page += 1) {
    const separator = path.includes("?") ? "&" : "?";
    const batch = await request<T[]>(`${path}${separator}per_page=100&page=${page}`, force);
    results.push(...batch);
    if (batch.length < 100) break;
  }
  return results;
}

async function optional<T>(
  label: string,
  task: Promise<T>,
  failures: string[],
  fallback: T,
  onFailure?: () => void,
): Promise<T> {
  try {
    return await task;
  } catch (error) {
    onFailure?.();
    failures.push(error instanceof Error ? `${label}：${error.message}` : `${label}：读取失败`);
    return fallback;
  }
}

async function optionalComparison(label: string, task: Promise<RawComparison>, failures: string[]): Promise<RawComparison | null> {
  try {
    return await task;
  } catch (error) {
    if (error instanceof GitHubApiError && error.status === 404 && /no common ancestor/i.test(error.message)) return null;
    failures.push(error instanceof Error ? `${label}：${error.message}` : `${label}：读取失败`);
    return null;
  }
}

function decodeContent(content?: string): string {
  if (!content) return "";
  const bytes = Uint8Array.from(atob(content.replace(/\n/g, "")), (character) =>
    character.charCodeAt(0),
  );
  return new TextDecoder("utf-8").decode(bytes);
}

function asWeek(timestamp: number): string {
  return new Date(timestamp * 1000).toISOString();
}

function mapCommit(raw: RawCommit, branch: string): CommitNode {
  return {
    sha: raw.sha,
    message: raw.commit.message.split("\n")[0],
    author: raw.author?.login || raw.commit.author?.name || "匿名贡献者",
    avatarUrl: raw.author?.avatar_url,
    date: raw.commit.author?.date || raw.commit.committer?.date || new Date(0).toISOString(),
    url: raw.html_url,
    parents: raw.parents.map((parent) => parent.sha),
    branches: [branch],
  };
}

export async function fetchCommitDetail(sha: string, force = false): Promise<CommitNode> {
  const raw = await request<RawCommitDetail>(`/repos/${OWNER}/${REPO}/commits/${sha}`, force);
  return {
    ...mapCommit(raw, ""),
    branches: [],
    additions: raw.stats?.additions,
    deletions: raw.stats?.deletions,
    files: raw.files?.map((file) => ({
      filename: file.filename,
      status: file.status,
      additions: file.additions,
      deletions: file.deletions,
    })),
  };
}

export async function fetchDashboardData(force = false): Promise<DashboardData> {
  rateRemaining = null;
  rateLimit = null;
  const failures: string[] = [];
  const availability: DataAvailability = {
    branches: true,
    pulls: true,
    reviews: true,
    issues: true,
    releases: true,
    contributorStats: true,
    roadmapDocuments: true,
    milestones: true,
  };
  const rawRepository = await request<RawRepository>(`/repos/${OWNER}/${REPO}`, force);
  const repository: RepositorySummary = {
    name: rawRepository.name,
    fullName: rawRepository.full_name,
    description: rawRepository.description || "",
    htmlUrl: rawRepository.html_url,
    defaultBranch: rawRepository.default_branch,
    stars: rawRepository.stargazers_count,
    forks: rawRepository.forks_count,
    openIssues: null,
    watchers: rawRepository.subscribers_count ?? rawRepository.watchers_count,
    updatedAt: rawRepository.updated_at,
  };

  const [rawBranches, rawPulls, rawIssues, rawReleases, contributorStats, readme, changelog, report, rawMilestones] =
    await Promise.all([
      optional("分支", requestPaginated<RawBranch>(`/repos/${OWNER}/${REPO}/branches`, force), failures, [], () => { availability.branches = false; }),
      optional("Pull Requests", requestPaginated<RawPull>(`/repos/${OWNER}/${REPO}/pulls?state=all&sort=updated&direction=desc`, force), failures, [], () => { availability.pulls = false; }),
      optional("Issues", requestPaginated<RawIssue>(`/repos/${OWNER}/${REPO}/issues?state=all&sort=updated&direction=desc`, force), failures, [], () => { availability.issues = false; }),
      optional("Releases", requestPaginated<RawRelease>(`/repos/${OWNER}/${REPO}/releases`, force), failures, [], () => { availability.releases = false; }),
      optional("贡献统计", request<RawContributorStats[]>(`/repos/${OWNER}/${REPO}/stats/contributors`, force), failures, [], () => { availability.contributorStats = false; }),
      optional("README", request<RawContent>(`/repos/${OWNER}/${REPO}/contents/README.md?ref=${rawRepository.default_branch}`, force), failures, null),
      optional("CHANGELOG", request<RawContent>(`/repos/${OWNER}/${REPO}/contents/CHANGELOG.md?ref=${rawRepository.default_branch}`, force), failures, null),
      optional("产品概念报告", request<RawContent>(`/repos/${OWNER}/${REPO}/contents/${encodeURIComponent("记·忘_产品概念报告.md")}?ref=${rawRepository.default_branch}`, force), failures, null),
      optional("Milestones", requestPaginated<RawMilestone>(`/repos/${OWNER}/${REPO}/milestones?state=all&sort=due_on&direction=asc`, force), failures, [], () => { availability.milestones = false; }),
    ]);
  availability.roadmapDocuments = Boolean(readme || changelog || report);

  const pulls: PullRequestSummary[] = rawPulls.map((pull) => ({
    number: pull.number,
    title: pull.title,
    body: pull.body,
    user: pull.user?.login || "匿名贡献者",
    state: pull.state,
    mergedAt: pull.merged_at,
    createdAt: pull.created_at,
    updatedAt: pull.updated_at,
    htmlUrl: pull.html_url,
    reviewers: [],
    reviewsLoaded: false,
    milestoneTitle: pull.milestone?.title,
  }));

  const reviewResults = await Promise.all(
    rawPulls.slice(0, MAX_REVIEW_PULLS).map((pull) =>
      optional(
        `PR #${pull.number} reviews`,
        request<RawReview[]>(`/repos/${OWNER}/${REPO}/pulls/${pull.number}/reviews?per_page=100`, force),
        failures,
        null,
        () => { availability.reviews = false; },
      ),
    ),
  );
  const reviewDates = new Map<string, string[]>();
  reviewResults.forEach((reviews, index) => {
    const pull = pulls[index];
    if (!pull || reviews === null) return;
    const reviewers = [...new Set(reviews.map((review) => review.user?.login).filter(Boolean) as string[])];
    pull.reviewers = reviewers;
    pull.reviewsLoaded = true;
    reviews.forEach((review) => {
      const login = review.user?.login;
      if (!login || !review.submitted_at) return;
      reviewDates.set(login, [...(reviewDates.get(login) ?? []), review.submitted_at]);
    });
  });

  const branchRefs: BranchRef[] = rawBranches.map((branch) => ({
    name: branch.name,
    sha: branch.commit.sha,
    ahead: branch.name === repository.defaultBranch ? 0 : null,
    behind: branch.name === repository.defaultBranch ? 0 : null,
  }));
  branchRefs.sort((a, b) =>
    a.name === repository.defaultBranch ? -1 : b.name === repository.defaultBranch ? 1 : a.name.localeCompare(b.name),
  );

  const commitMap = new Map<string, CommitNode>();
  await Promise.all(
    branchRefs.map(async (branch) => {
      const commits = await optional(
        `${branch.name} 提交历史`,
        requestPaginated<RawCommit>(`/repos/${OWNER}/${REPO}/commits?sha=${encodeURIComponent(branch.name)}`, force),
        failures,
        [],
        () => { availability.branches = false; },
      );
      commits.forEach((commit) => mergeBranchCommit(commitMap, mapCommit(commit, branch.name), branch.name));
      branch.updatedAt = commits[0]?.commit.author?.date || commits[0]?.commit.committer?.date;
      if (branch.name === repository.defaultBranch) return;
      const comparison = await optionalComparison(
        `${branch.name} 分支差异`,
        request<RawComparison>(`/repos/${OWNER}/${REPO}/compare/${encodeURIComponent(repository.defaultBranch)}...${encodeURIComponent(branch.name)}`, force),
        failures,
      );
      if (comparison) {
        branch.ahead = comparison.ahead_by;
        branch.behind = comparison.behind_by;
      }
    }),
  );
  const commits = [...commitMap.values()];

  const contributorMap = new Map<string, ContributorInput>();
  const ensureContributor = (login: string): ContributorInput => {
    const existing = contributorMap.get(login);
    if (existing) return existing;
    const created: ContributorInput = {
      login,
      commits: 0,
      mergedPullRequests: 0,
      reviews: null,
      additions: null,
      deletions: null,
      weekly: [],
      mergedPullRequestDates: [],
      reviewDates: [],
    };
    contributorMap.set(login, created);
    return created;
  };
  const markContributorActive = (contributor: ContributorInput, value?: string | null) => {
    if (value && (!contributor.lastActiveAt || value > contributor.lastActiveAt)) contributor.lastActiveAt = value;
  };

  contributorStats.forEach((stat) => {
    const login = stat.author?.login || "匿名贡献者";
    const contributor = ensureContributor(login);
    const weekly: WeeklyContribution[] = stat.weeks
      .filter((week) => week.c > 0 || week.a > 0 || week.d > 0)
      .map((week) => ({ week: asWeek(week.w), commits: week.c, additions: week.a, deletions: week.d }));
    contributor.avatarUrl = stat.author?.avatar_url;
    contributor.profileUrl = stat.author?.html_url;
    contributor.commits = stat.total;
    contributor.additions = weekly.reduce((sum, week) => sum + week.additions, 0);
    contributor.deletions = weekly.reduce((sum, week) => sum + week.deletions, 0);
    contributor.weekly = weekly;
    contributor.lastActiveAt = weekly.at(-1)?.week;
  });

  commits.forEach((commit) => {
    const contributor = ensureContributor(commit.author);
    if (contributorStats.length === 0) {
      contributor.commits += 1;
      contributor.weekly = [
        ...(contributor.weekly ?? []),
        { week: commit.date, commits: 1, additions: 0, deletions: 0 },
      ];
    }
    markContributorActive(contributor, commit.date);
  });

  pulls.forEach((pull) => {
    const contributor = ensureContributor(pull.user);
    if (pull.mergedAt) {
      contributor.mergedPullRequests += 1;
      contributor.mergedPullRequestDates = [...(contributor.mergedPullRequestDates ?? []), pull.mergedAt];
    }
    markContributorActive(contributor, pull.mergedAt);
    markContributorActive(contributor, pull.updatedAt);
  });
  if (availability.reviews) contributorMap.forEach((contributor) => { contributor.reviews = 0; });
  reviewDates.forEach((dates, login) => {
    const contributor = ensureContributor(login);
    contributor.reviews = dates.length;
    contributor.reviewDates = dates;
    dates.forEach((date) => markContributorActive(contributor, date));
  });

  const contributors = scoreContributors([...contributorMap.values()]);
  const issues: IssueSummary[] = rawIssues
    .filter((issue) => !issue.pull_request)
    .map((issue) => ({
      number: issue.number,
      title: issue.title,
      body: issue.body,
      user: issue.user?.login || "匿名贡献者",
      state: issue.state,
      createdAt: issue.created_at,
      updatedAt: issue.updated_at,
      htmlUrl: issue.html_url,
      milestoneTitle: issue.milestone?.title,
    }));
  if (availability.issues) repository.openIssues = issues.filter((issue) => issue.state === "open").length;
  const releases: ReleaseSummary[] = rawReleases.map((release) => ({
    id: release.id,
    name: release.name || release.tag_name,
    tag: release.tag_name,
    publishedAt: release.published_at || release.created_at,
    prerelease: release.prerelease,
    htmlUrl: release.html_url,
  }));

  const roadmapSources: Array<[RawContent | null, string]> = [
    [readme, "README.md"],
    [changelog, "CHANGELOG.md"],
    [report, "记·忘_产品概念报告.md"],
  ];
  const roadmapByTitle = new Map<string, RoadmapPhase>();
  roadmapSources.forEach(([content, source]) => {
    parseRoadmapMarkdown(decodeContent(content?.content), source).forEach((phase) => {
      if (!roadmapByTitle.has(phase.title)) roadmapByTitle.set(phase.title, phase);
    });
  });
  rawMilestones.forEach((milestone) => {
    const linkedIssues = issues.filter((issue) => issue.milestoneTitle === milestone.title);
    const linkedPulls = pulls.filter((pull) => pull.milestoneTitle === milestone.title);
    roadmapByTitle.set(`milestone:${milestone.number}`, {
      id: `milestone-${milestone.number}`,
      title: milestone.title,
      goal: milestone.description || undefined,
      source: `GitHub Milestone #${milestone.number}`,
      items: [
        ...linkedIssues.map((issue) => ({ label: `Issue #${issue.number} · ${issue.title}`, completed: issue.state === "closed" })),
        ...linkedPulls.map((pull) => ({ label: `PR #${pull.number} · ${pull.title}`, completed: Boolean(pull.mergedAt) })),
      ],
    });
  });
  const roadmap = [...roadmapByTitle.values()];
  const suggestions = generateSuggestions({ repository, contributors, branches: branchRefs, pulls, issues, releases, commits, availability });

  return {
    repository,
    contributors,
    branches: branchRefs,
    commits,
    pulls,
    issues,
    releases,
    roadmap,
    suggestions,
    status: {
      source: "live",
      fetchedAt: new Date().toISOString(),
      remaining: rateRemaining,
      limit: rateLimit,
      partialFailures: [...new Set(failures)],
      availability,
    },
  };
}

interface RawRepository {
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  default_branch: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  subscribers_count?: number;
  watchers_count: number;
  updated_at: string;
}

interface RawUser {
  login: string;
  avatar_url: string;
  html_url: string;
}

interface RawBranch { name: string; commit: { sha: string } }
interface RawCommit {
  sha: string;
  html_url: string;
  author: RawUser | null;
  commit: {
    message: string;
    author: { name: string; date: string } | null;
    committer: { date: string } | null;
  };
  parents: Array<{ sha: string }>;
}
interface RawCommitDetail extends RawCommit {
  stats?: { additions: number; deletions: number };
  files?: Array<{ filename: string; status: string; additions: number; deletions: number }>;
}
interface RawPull {
  number: number;
  title: string;
  body: string | null;
  state: "open" | "closed";
  user: RawUser | null;
  merged_at: string | null;
  created_at: string;
  updated_at: string;
  html_url: string;
  milestone: { title: string } | null;
}
interface RawReview { user: RawUser | null; submitted_at: string | null }
interface RawIssue {
  number: number;
  title: string;
  body: string | null;
  state: "open" | "closed";
  user: RawUser | null;
  created_at: string;
  updated_at: string;
  html_url: string;
  pull_request?: unknown;
  milestone: { title: string } | null;
}
interface RawRelease {
  id: number;
  name: string | null;
  tag_name: string;
  published_at: string | null;
  created_at: string;
  prerelease: boolean;
  html_url: string;
}
interface RawContributorStats {
  total: number;
  author: RawUser | null;
  weeks: Array<{ w: number; a: number; d: number; c: number }>;
}
interface RawContent { content?: string }
interface RawComparison { ahead_by: number; behind_by: number }
interface RawMilestone { number: number; title: string; description: string | null }
