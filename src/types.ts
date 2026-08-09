export type DateRange = "all" | "30d" | "90d" | "365d" | "custom";

export interface WeeklyContribution {
  week: string;
  commits: number;
  additions: number;
  deletions: number;
}

export interface RepositorySummary {
  name: string;
  fullName: string;
  description: string;
  htmlUrl: string;
  defaultBranch: string;
  stars: number;
  forks: number;
  openIssues: number | null;
  watchers: number;
  updatedAt: string;
}

export interface ContributorInput {
  login: string;
  name?: string;
  avatarUrl?: string;
  profileUrl?: string;
  commits: number;
  mergedPullRequests: number;
  reviews: number | null;
  additions: number | null;
  deletions: number | null;
  lastActiveAt?: string;
  weekly?: WeeklyContribution[];
  mergedPullRequestDates?: string[];
  reviewDates?: string[];
}

export interface ContributorMetric extends ContributorInput {
  score: number;
  normalized: {
    commits: number;
    mergedPullRequests: number;
    reviews: number | null;
    codeImpact: number | null;
  };
}

export interface CommitNode {
  sha: string;
  message: string;
  author: string;
  avatarUrl?: string;
  date: string;
  url: string;
  parents: string[];
  branches: string[];
  additions?: number;
  deletions?: number;
  files?: Array<{ filename: string; status: string; additions: number; deletions: number }>;
}

export interface BranchRef {
  name: string;
  sha: string;
  ahead: number | null;
  behind: number | null;
  updatedAt?: string;
}

export interface BranchGraphNode extends CommitNode {
  lane: number;
  row: number;
  emphasis: number;
}

export interface BranchGraph {
  branches: BranchRef[];
  nodes: BranchGraphNode[];
  edges: Array<{ from: string; to: string; merge: boolean }>;
  laneCount: number;
}

export interface RoadmapItem {
  id?: string;
  label: string;
  completed: boolean;
}

export interface RoadmapPhase {
  id: string;
  title: string;
  goal?: string;
  items: RoadmapItem[];
  source: string;
  editedAt?: string;
}

export interface Suggestion {
  id: string;
  severity: "high" | "medium" | "low";
  title: string;
  evidence: string;
  action: string;
  url?: string;
}

export interface PullRequestSummary {
  number: number;
  title: string;
  user: string;
  state: "open" | "closed";
  mergedAt: string | null;
  createdAt: string;
  updatedAt: string;
  htmlUrl: string;
  reviewers: string[];
  reviewsLoaded: boolean;
  milestoneTitle?: string;
}

export interface IssueSummary {
  number: number;
  title: string;
  state: "open" | "closed";
  createdAt: string;
  updatedAt: string;
  htmlUrl: string;
  milestoneTitle?: string;
}

export interface ReleaseSummary {
  id: number;
  name: string;
  tag: string;
  publishedAt: string;
  prerelease: boolean;
  htmlUrl: string;
}

export interface ApiStatus {
  source: "live" | "fixture";
  fetchedAt: string;
  remaining: number | null;
  limit: number | null;
  partialFailures: string[];
  availability: DataAvailability;
}

export interface DataAvailability {
  branches: boolean;
  pulls: boolean;
  reviews: boolean;
  issues: boolean;
  releases: boolean;
  contributorStats: boolean;
  roadmapDocuments: boolean;
  milestones: boolean;
}

export interface DashboardData {
  repository: RepositorySummary;
  contributors: ContributorMetric[];
  branches: BranchRef[];
  commits: CommitNode[];
  pulls: PullRequestSummary[];
  issues: IssueSummary[];
  releases: ReleaseSummary[];
  roadmap: RoadmapPhase[];
  suggestions: Suggestion[];
  status: ApiStatus;
}
