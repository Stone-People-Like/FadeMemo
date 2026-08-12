import type {
  BranchGraph,
  BranchGraphNode,
  BranchRef,
  CommitNode,
  ContributorInput,
  ContributorMetric,
  DateRange,
  DataAvailability,
  IssueSummary,
  PullRequestSummary,
  ReleaseSummary,
  RepositorySummary,
  RoadmapPhase,
  Suggestion,
} from "../types";

const SCORE_WEIGHTS = {
  commits: 0.3,
  mergedPullRequests: 0.3,
  reviews: 0.2,
  codeImpact: 0.2,
} as const;

function ratio(value: number, maximum: number): number {
  return maximum > 0 ? value / maximum : 0;
}

export function scoreContributors(inputs: ContributorInput[]): ContributorMetric[] {
  const maxima = {
    commits: Math.max(0, ...inputs.map((item) => item.commits)),
    mergedPullRequests: Math.max(0, ...inputs.map((item) => item.mergedPullRequests)),
    reviews: Math.max(0, ...inputs.map((item) => item.reviews ?? 0)),
    codeImpact: Math.max(
      0,
      ...inputs.map((item) => (item.additions ?? 0) + (item.deletions ?? 0)),
    ),
  };

  return inputs
    .map((input) => {
      const hasReviews = input.reviews !== null;
      const hasCodeImpact = input.additions !== null && input.deletions !== null;
      const normalized = {
        commits: ratio(input.commits, maxima.commits),
        mergedPullRequests: ratio(input.mergedPullRequests, maxima.mergedPullRequests),
        reviews: hasReviews ? ratio(input.reviews ?? 0, maxima.reviews) : null,
        codeImpact: hasCodeImpact
          ? Math.sqrt(
              ratio((input.additions ?? 0) + (input.deletions ?? 0), maxima.codeImpact),
            )
          : null,
      };

      const weighted =
        normalized.commits * SCORE_WEIGHTS.commits +
        normalized.mergedPullRequests * SCORE_WEIGHTS.mergedPullRequests +
        (normalized.reviews ?? 0) * SCORE_WEIGHTS.reviews +
        (normalized.codeImpact ?? 0) * SCORE_WEIGHTS.codeImpact;

      return {
        ...input,
        normalized,
        score: Math.round(weighted * 100),
      };
    })
    .sort((a, b) => b.score - a.score || b.commits - a.commits);
}

export function scoreContributorsForWindow(
  inputs: ContributorInput[],
  options: { range: DateRange; from?: string; to?: string; now?: Date },
): ContributorMetric[] {
  if (options.range === "all") return scoreContributors(inputs);
  const now = options.now ?? new Date();
  const rollingDays = options.range === "custom" ? null : Number.parseInt(options.range, 10);
  const from = options.range === "custom"
    ? options.from ? new Date(`${options.from}T00:00:00`).getTime() : Number.NEGATIVE_INFINITY
    : now.getTime() - (rollingDays ?? 0) * 24 * 60 * 60 * 1000;
  const to = options.range === "custom" && options.to
    ? new Date(`${options.to}T23:59:59.999`).getTime()
    : now.getTime();
  const within = (date: string) => {
    const value = new Date(date).getTime();
    return value >= from && value <= to;
  };

  return scoreContributors(
    inputs.map((input) => {
      const weekly = (input.weekly ?? []).filter((item) => within(item.week));
      const prDates = (input.mergedPullRequestDates ?? []).filter(within);
      const reviewDates = (input.reviewDates ?? []).filter(within);
      return {
        ...input,
        commits: weekly.reduce((sum, item) => sum + item.commits, 0),
        mergedPullRequests: prDates.length,
        reviews: input.reviews === null ? null : reviewDates.length,
        additions: input.additions === null
          ? null
          : weekly.reduce((sum, item) => sum + item.additions, 0),
        deletions: input.deletions === null
          ? null
          : weekly.reduce((sum, item) => sum + item.deletions, 0),
      };
    }),
  );
}

export function parseRoadmapMarkdown(markdown: string, source: string): RoadmapPhase[] {
  const lines = markdown.split(/\r?\n/);
  const phases: RoadmapPhase[] = [];
  let current: RoadmapPhase | null = null;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    const heading = line.match(/^#{2,4}\s+(.+)$/);
    if (heading && /(阶段|roadmap|milestone|phase)/i.test(heading[1])) {
      if (current) phases.push(current);
      const title = heading[1].replace(/[*_`]/g, "").trim();
      current = {
        id: `${source}-${phases.length}-${title}`.toLowerCase().replace(/\s+/g, "-"),
        title,
        items: [],
        source,
      };
      continue;
    }

    if (!current) continue;
    const goal = line.match(/^(?:目标|goal)\s*[：:]\s*(.+)$/i);
    if (goal) {
      current.goal = goal[1].trim();
      continue;
    }
    const item = line.match(/^[-*]\s+\[([ xX])\]\s+(.+)$/);
    if (item) {
      current.items.push({
        label: item[2].replace(/[*_`]/g, "").trim(),
        completed: item[1].toLowerCase() === "x",
      });
    }
  }

  if (current) phases.push(current);
  return phases;
}

export function buildBranchGraph(commits: CommitNode[], branches: BranchRef[]): BranchGraph {
  const commitMap = new Map(commits.map((commit) => [commit.sha, commit]));
  const lanes = new Map<string, number>();

  branches.forEach((branch, lane) => {
    let cursor = branch.sha;
    const visited = new Set<string>();
    while (cursor && !visited.has(cursor)) {
      visited.add(cursor);
      if (!lanes.has(cursor)) lanes.set(cursor, lane);
      const commit = commitMap.get(cursor);
      cursor = commit?.parents[0] ?? "";
    }
  });

  const incoming = new Map(commits.map((commit) => [commit.sha, 0]));
  commits.forEach((commit) => commit.parents.forEach((parent) => {
    if (incoming.has(parent)) incoming.set(parent, (incoming.get(parent) ?? 0) + 1);
  }));
  const branchRank = new Map(branches.map((branch, index) => [branch.sha, index]));
  const compare = (a: CommitNode, b: CommitNode) =>
    (branchRank.get(a.sha) ?? Number.MAX_SAFE_INTEGER) - (branchRank.get(b.sha) ?? Number.MAX_SAFE_INTEGER) ||
    new Date(b.date).getTime() - new Date(a.date).getTime() || a.sha.localeCompare(b.sha);
  const ready = commits.filter((commit) => incoming.get(commit.sha) === 0).sort(compare);
  const ordered: CommitNode[] = [];
  while (ready.length > 0) {
    const commit = ready.shift();
    if (!commit) break;
    ordered.push(commit);
    commit.parents.forEach((parent) => {
      if (!incoming.has(parent)) return;
      const next = (incoming.get(parent) ?? 0) - 1;
      incoming.set(parent, next);
      if (next === 0) {
        const parentCommit = commitMap.get(parent);
        if (parentCommit) ready.push(parentCommit);
        ready.sort(compare);
      }
    });
  }
  if (ordered.length < commits.length) {
    const seen = new Set(ordered.map((commit) => commit.sha));
    ordered.push(...commits.filter((commit) => !seen.has(commit.sha)).sort(compare));
  }
  const laneCount = Math.max(1, branches.length, ...lanes.values()) || 1;
  const nodes: BranchGraphNode[] = ordered.map((commit, row) => ({
    ...commit,
    lane:
      lanes.get(commit.sha) ??
      Math.max(0, branches.findIndex((branch) => commit.branches.includes(branch.name))),
    row,
    emphasis: Math.max(0.38, 1 - row / Math.max(ordered.length * 1.35, 1)),
  }));
  const visible = new Set(nodes.map((node) => node.sha));
  const edges = nodes.flatMap((node) =>
    node.parents
      .map((parent, index) => ({ from: node.sha, to: parent, merge: index > 0 }))
      .filter((edge) => visible.has(edge.to)),
  );

  return { branches, nodes, edges, laneCount };
}

export function generateSuggestions(input: {
  repository: RepositorySummary;
  contributors: ContributorMetric[];
  branches: BranchRef[];
  pulls: PullRequestSummary[];
  issues: IssueSummary[];
  releases: ReleaseSummary[];
  commits?: CommitNode[];
  availability?: Partial<DataAvailability>;
  now?: Date;
}): Suggestion[] {
  const suggestions: Suggestion[] = [];
  const available = input.availability ?? {};
  const isAvailable = (key: keyof DataAvailability) => available[key] !== false;
  const now = input.now ?? new Date();
  const unavailableSources = Object.entries(available).filter(([, value]) => value === false).map(([key]) => key);
  if (unavailableSources.length > 0) {
    suggestions.push({
      id: "partial-data",
      severity: "low",
      title: "部分规则因数据不可用而暂停",
      evidence: `未能验证的数据源：${unavailableSources.join("、")}。`,
      action: "查看顶部失败详情，并在 API 恢复后手动刷新。",
      url: input.repository.htmlUrl,
    });
  }
  const totalCommits = input.contributors.reduce((sum, item) => sum + item.commits, 0);
  const topContributor = [...input.contributors].sort((a, b) => b.commits - a.commits)[0];
  if (topContributor && totalCommits >= 10 && topContributor.commits / totalCommits >= 0.7) {
    suggestions.push({
      id: "contributor-concentration",
      severity: "high",
      title: "关键贡献集中在单一成员",
      evidence: `${topContributor.login} 占所选周期 ${Math.round((topContributor.commits / totalCommits) * 100)}% 的提交。`,
      action: "优先补齐核心模块说明并安排交叉评审，降低单点维护风险。",
      url: `${input.repository.htmlUrl}/graphs/contributors`,
    });
  }

  const divergent = input.branches
    .filter((branch) => branch.name !== input.repository.defaultBranch)
    .sort((a, b) => (b.ahead ?? 0) + (b.behind ?? 0) - ((a.ahead ?? 0) + (a.behind ?? 0)))[0];
  if (divergent && (divergent.ahead ?? 0) + (divergent.behind ?? 0) >= 10) {
    suggestions.push({
      id: "branch-divergence",
      severity: "medium",
      title: `${divergent.name} 与默认分支分叉较大`,
      evidence: `领先 ${divergent.ahead ?? "未知"}、落后 ${divergent.behind ?? "未知"} 个提交。`,
      action: "检查尚未同步的发布变更，并明确下一次集成节点。",
      url: `${input.repository.htmlUrl}/compare/${input.repository.defaultBranch}...${divergent.name}`,
    });
  }

  if (isAvailable("branches")) {
    input.branches
      .filter((branch) => branch.name !== input.repository.defaultBranch && branch.updatedAt)
      .filter((branch) => now.getTime() - new Date(branch.updatedAt ?? now).getTime() >= 90 * 86400000)
      .slice(0, 2)
      .forEach((branch) => suggestions.push({
        id: `stale-branch-${branch.name}`,
        severity: "low",
        title: `${branch.name} 已长期未更新`,
        evidence: `最近提交停留在 ${new Date(branch.updatedAt ?? "").toLocaleDateString("zh-CN")}。`,
        action: "确认分支是否仍有保留价值，关闭前先检查未合并提交。",
        url: `${input.repository.htmlUrl}/tree/${encodeURIComponent(branch.name)}`,
      }));
  }

  const mergedPulls = isAvailable("pulls") ? input.pulls.filter((pull) => pull.mergedAt && pull.reviewsLoaded) : [];
  const withoutReview = mergedPulls.filter((pull) => pull.reviewers.length === 0);
  if (mergedPulls.length >= 2 && withoutReview.length / mergedPulls.length >= 0.5) {
    suggestions.push({
      id: "review-coverage",
      severity: "medium",
      title: "合并前评审覆盖不足",
      evidence: `最近公开样本中 ${withoutReview.length}/${mergedPulls.length} 个已合并 PR 未返回 review 记录。`,
      action: "为 develop 启用至少一位成员评审的协作约定。",
      url: `${input.repository.htmlUrl}/pulls?q=is%3Apr+is%3Amerged`,
    });
  }

  const openIssues = isAvailable("issues") ? input.issues.filter((issue) => issue.state === "open") : [];
  if (openIssues.length >= 8) {
    suggestions.push({
      id: "issue-backlog",
      severity: "low",
      title: "待处理问题开始积压",
      evidence: `当前抓取范围内有 ${openIssues.length} 个开放 Issue。`,
      action: "按阶段目标标记优先级，并关闭已失效的问题。",
      url: `${input.repository.htmlUrl}/issues`,
    });
  }

  const latestRelease = isAvailable("releases") ? [...input.releases].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  )[0] : undefined;
  if (isAvailable("releases") && !latestRelease) {
    suggestions.push({
      id: "release-missing",
      severity: "low",
      title: "尚无可读取的 Release",
      evidence: "公开 API 未返回发布记录。",
      action: "在阶段成果稳定后创建带变更摘要的预发布版本。",
      url: `${input.repository.htmlUrl}/releases`,
    });
  } else if (latestRelease && now.getTime() - new Date(latestRelease.publishedAt).getTime() >= 120 * 86400000) {
    suggestions.push({
      id: "release-stalled",
      severity: "low",
      title: "发布节奏已经停滞",
      evidence: `最近 Release 发布于 ${new Date(latestRelease.publishedAt).toLocaleDateString("zh-CN")}。`,
      action: "核对当前阶段产出，决定发布预览版或更新版本计划。",
      url: `${input.repository.htmlUrl}/releases`,
    });
  }

  if (suggestions.length === 0 && Object.values(available).every((value) => value !== false)) {
    suggestions.push({
      id: "healthy-baseline",
      severity: "low",
      title: "当前未发现明显协作风险",
      evidence: "贡献分布、分支差异和任务积压均未触发阈值。",
      action: "保持当前节奏，并在下一个阶段节点重新检查。",
      url: input.repository.htmlUrl,
    });
  }
  return suggestions;
}

export function filterByRange<T extends { date?: string; lastActiveAt?: string }>(
  items: T[],
  range: "all" | "30d" | "90d" | "365d",
  now = new Date(),
): T[] {
  if (range === "all") return items;
  const days = Number.parseInt(range, 10);
  const threshold = now.getTime() - days * 24 * 60 * 60 * 1000;
  return items.filter((item) => {
    const value = item.date ?? item.lastActiveAt;
    return value ? new Date(value).getTime() >= threshold : false;
  });
}

export function latestRepositoryActivity(input: {
  repositoryUpdatedAt: string;
  commits: Array<Pick<CommitNode, "date">>;
  pulls: Array<Pick<PullRequestSummary, "updatedAt" | "mergedAt">>;
  issues: Array<Pick<IssueSummary, "updatedAt">>;
}): string {
  const candidates = [
    ...input.commits.map((commit) => commit.date),
    ...input.pulls.flatMap((pull) => [pull.updatedAt, pull.mergedAt]),
    ...input.issues.map((issue) => issue.updatedAt),
  ].filter((value): value is string => typeof value === "string" && !Number.isNaN(Date.parse(value)));

  if (!candidates.length) return input.repositoryUpdatedAt;
  return candidates.reduce((latest, value) => Date.parse(value) > Date.parse(latest) ? value : latest);
}

function localDateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function recentCommitActivity(commits: Array<Pick<CommitNode, "date">>, days = 14, now = new Date()): Array<[string, number]> {
  const end = new Date(now);
  end.setHours(0, 0, 0, 0);
  const counts = new Map<string, number>();
  for (let offset = days - 1; offset >= 0; offset -= 1) {
    const date = new Date(end);
    date.setDate(end.getDate() - offset);
    counts.set(localDateKey(date), 0);
  }
  commits.forEach((commit) => {
    const date = new Date(commit.date);
    if (Number.isNaN(date.getTime())) return;
    const key = localDateKey(date);
    if (counts.has(key)) counts.set(key, (counts.get(key) ?? 0) + 1);
  });
  return [...counts.entries()];
}

export function roadmapProgress(phases: RoadmapPhase[]): number {
  const items = phases.flatMap((phase) => phase.items);
  if (items.length === 0) return 0;
  return Math.round((items.filter((item) => item.completed).length / items.length) * 100);
}

export function mergeBranchCommit(
  map: Map<string, CommitNode>,
  commit: CommitNode,
  branch: string,
): void {
  const existing = map.get(commit.sha);
  if (existing) {
    if (!existing.branches.includes(branch)) existing.branches.push(branch);
    return;
  }
  map.set(commit.sha, { ...commit, branches: [...new Set([...commit.branches, branch])] });
}

export function nodeBySha(nodes: BranchGraphNode[]): Map<string, BranchGraphNode> {
  return new Map(nodes.map((node) => [node.sha, node]));
}
