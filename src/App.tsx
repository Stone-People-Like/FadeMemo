import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  BookOpenCheck,
  Check,
  ChevronRight,
  CircleDot,
  Code2,
  GitBranch,
  GitCommitHorizontal,
  GitFork,
  Lightbulb,
  ListChecks,
  Menu,
  MessageSquareCode,
  Moon,
  Network,
  Plus,
  GitPullRequest,
  RefreshCw,
  RotateCcw,
  Sparkle,
  Star,
  Sun,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { fetchCommitDetail, fetchDashboardData, GitHubApiError } from "./api/github";
import { BranchGraphView } from "./components/BranchGraph";
import { getFixtureData } from "./data/fixtures";
import {
  buildBranchGraph,
  roadmapProgress,
  scoreContributorsForWindow,
} from "./lib/analytics";
import { normalizeSyncMinutes, resolveInitialTheme, syncIntervalOptions, type SyncMinutes, type ThemePreference } from "./lib/preferences";
import { mergeRoadmapOverride, parseRoadmapOverride, updateRoadmap, type RoadmapEditAction, type RoadmapOverride } from "./lib/roadmap-editor";
import type {
  CommitNode,
  ContributorMetric,
  DashboardData,
  DateRange,
  RoadmapPhase,
  Suggestion,
} from "./types";

type View = "overview" | "contributors" | "branches" | "roadmap" | "suggestions";

const THEME_KEY = "fadememo-dashboard:theme";
const SYNC_KEY = "fadememo-dashboard:sync-minutes";
const ROADMAP_KEY = "fadememo-dashboard:roadmap-override";

const NAVIGATION: Array<{ id: View; label: string; icon: typeof Activity }> = [
  { id: "overview", label: "总览", icon: Activity },
  { id: "contributors", label: "贡献者", icon: Users },
  { id: "branches", label: "分支图", icon: Network },
  { id: "roadmap", label: "阶段目标", icon: ListChecks },
  { id: "suggestions", label: "建议", icon: Lightbulb },
];

function formatNumber(value: number): string {
  return new Intl.NumberFormat("zh-CN", { notation: value >= 10_000 ? "compact" : "standard" }).format(value);
}

function formatDate(value?: string): string {
  if (!value) return "暂无";
  return new Intl.DateTimeFormat("zh-CN", { year: "numeric", month: "short", day: "numeric" }).format(new Date(value));
}

function relativeDate(value?: string): string {
  if (!value) return "未知";
  const days = Math.max(0, Math.floor((Date.now() - new Date(value).getTime()) / 86_400_000));
  if (days === 0) return "今天";
  if (days === 1) return "昨天";
  if (days < 30) return `${days} 天前`;
  return formatDate(value);
}

function useDialogFocus(onClose: () => void) {
  const dialogRef = useRef<HTMLElement>(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const dialog = dialogRef.current;
    const focusable = () => [...(dialog?.querySelectorAll<HTMLElement>('button, a[href], input, [tabindex]:not([tabindex="-1"])') ?? [])];
    focusable()[0]?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeRef.current();
        return;
      }
      if (event.key !== "Tab") return;
      const items = focusable();
      if (!items.length) return;
      const first = items[0];
      const last = items.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => { document.removeEventListener("keydown", onKeyDown); previous?.focus(); };
  }, []);
  return dialogRef;
}

export default function App() {
  const [view, setView] = useState<View>("overview");
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [syncWarning, setSyncWarning] = useState<string | null>(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(() => window.matchMedia("(max-width: 980px)").matches);
  const [theme, setTheme] = useState<ThemePreference>(() => resolveInitialTheme(localStorage.getItem(THEME_KEY), window.matchMedia("(prefers-color-scheme: dark)").matches));
  const [syncMinutes, setSyncMinutes] = useState<SyncMinutes>(() => normalizeSyncMinutes(localStorage.getItem(SYNC_KEY)));
  const [roadmapOverride, setRoadmapOverride] = useState<RoadmapOverride | null>(() => parseRoadmapOverride(localStorage.getItem(ROADMAP_KEY)));
  const sidebarRef = useRef<HTMLElement>(null);
  const syncInFlight = useRef(false);
  const dataRef = useRef<DashboardData | null>(null);
  const demoMode = new URLSearchParams(window.location.search).get("demo") === "1";

  const load = useCallback(async (force = false, background = false) => {
    if (syncInFlight.current) return;
    syncInFlight.current = true;
    if (!background) {
      setLoading(true);
      setError(null);
    }
    try {
      const next = demoMode ? getFixtureData() : await fetchDashboardData(force);
      dataRef.current = next;
      setData(next);
      setError(null);
      setSyncWarning(null);
    } catch (caught) {
      const message = caught instanceof GitHubApiError && caught.status === 403
        ? "GitHub 公共 API 已达到当前限额，请稍后同步。"
        : caught instanceof Error ? caught.message : "无法读取 GitHub 数据。";
      if (background && dataRef.current) setSyncWarning(message);
      else {
        dataRef.current = null;
        setError(message);
        setData(null);
      }
    } finally {
      syncInFlight.current = false;
      if (!background) setLoading(false);
    }
  }, [demoMode]);

  useEffect(() => {
    void load(false);
  }, [load]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem(SYNC_KEY, String(syncMinutes));
    if (demoMode) return;
    const timer = window.setInterval(() => {
      const remaining = dataRef.current?.status.remaining;
      if (document.visibilityState === "visible" && (remaining === null || remaining === undefined || remaining >= 20)) void load(false, true);
    }, syncMinutes * 60_000);
    return () => window.clearInterval(timer);
  }, [demoMode, load, syncMinutes]);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 980px)");
    const update = () => setIsMobile(query.matches);
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (isMobile && !mobileNavOpen) sidebarRef.current?.setAttribute("inert", "");
    else sidebarRef.current?.removeAttribute("inert");
  }, [isMobile, mobileNavOpen]);

  const activeNavigation = NAVIGATION.find((item) => item.id === view)!;
  const visibleData = useMemo(() => data ? { ...data, roadmap: mergeRoadmapOverride(data.roadmap, roadmapOverride) } : data, [data, roadmapOverride]);
  const saveRoadmapOverride = (override: RoadmapOverride) => {
    localStorage.setItem(ROADMAP_KEY, JSON.stringify(override));
    setRoadmapOverride(override);
  };
  const restoreRoadmap = () => {
    localStorage.removeItem(ROADMAP_KEY);
    setRoadmapOverride(null);
  };

  return (
    <div className="app-shell">
      <aside ref={sidebarRef} className={`sidebar ${mobileNavOpen ? "is-open" : ""}`} aria-hidden={isMobile && !mobileNavOpen}>
        <div className="brand-lockup">
          <span className="brand-mark" aria-hidden="true"><GitCommitHorizontal size={18} /></span>
          <div>
            <strong>FadeMemo</strong>
            <span>PROJECT TRACE</span>
          </div>
          <button className="mobile-close" type="button" onClick={() => setMobileNavOpen(false)} aria-label="关闭导航"><X size={18} /></button>
        </div>
        <nav aria-label="看板导航">
          {NAVIGATION.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                className={view === item.id ? "is-active" : ""}
                aria-current={view === item.id ? "page" : undefined}
                onClick={() => { setView(item.id); setMobileNavOpen(false); }}
              >
                <Icon size={17} />
                <span>{item.label}</span>
                {item.id === "branches" && data ? <small>{data.branches.length}</small> : null}
              </button>
            );
          })}
        </nav>
        <div className="sidebar-foot">
          <span className={`source-dot ${!demoMode ? "is-live" : ""}`} />
          <div>
            <strong>{demoMode ? "示例数据" : "GitHub 实时数据"}</strong>
            <span>{data ? `更新于 ${new Date(data.status.fetchedAt).toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" })}` : "等待数据"}</span>
          </div>
        </div>
      </aside>

      <main className="main-frame">
        <header className="topbar">
          <div className="topbar-title">
            <button className="mobile-menu" type="button" onClick={() => setMobileNavOpen(true)} aria-label="打开导航"><Menu size={19} /></button>
            <activeNavigation.icon size={18} />
            <span>{activeNavigation.label}</span>
          </div>
          <div className="topbar-actions">
            {syncWarning ? <span className="sync-warning" title={syncWarning}><AlertTriangle size={13} />同步延迟</span> : null}
            {data?.status.remaining !== null && data?.status.remaining !== undefined ? (
              <span className="rate-limit mono">API {data.status.remaining}/{data.status.limit ?? "—"}</span>
            ) : null}
            <label className="sync-settings">
              <span>自动同步</span>
              <select aria-label="自动同步间隔" value={syncMinutes} onChange={(event) => setSyncMinutes(normalizeSyncMinutes(event.target.value))} disabled={demoMode}>
                {syncIntervalOptions.map((minutes) => <option key={minutes} value={minutes}>{minutes} 分钟</option>)}
              </select>
            </label>
            <button className="icon-button" type="button" onClick={() => setTheme((current) => current === "dark" ? "light" : "dark")} aria-label={theme === "dark" ? "切换到浅色主题" : "切换到深色主题"}>
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button className="primary-button" type="button" onClick={() => void load(true)} disabled={loading}>
              <RefreshCw size={15} className={loading ? "is-spinning" : ""} />
              {demoMode ? "刷新示例" : "同步"}
            </button>
          </div>
        </header>

        <div className="page-content">
          {loading ? <LoadingState /> : null}
          {!loading && error ? <ErrorState message={error} onRetry={() => void load(true)} /> : null}
          {!loading && visibleData ? (
            <>
              {visibleData.status.partialFailures.length > 0 ? <PartialDataNotice failures={visibleData.status.partialFailures} /> : null}
              {view === "overview" ? <Overview data={visibleData} onNavigate={setView} /> : null}
              {view === "contributors" ? <ContributorsView data={visibleData} /> : null}
              {view === "branches" ? <BranchesView data={visibleData} /> : null}
              {view === "roadmap" ? <RoadmapView repositoryPhases={data?.roadmap ?? []} override={roadmapOverride} onChange={saveRoadmapOverride} onRestore={restoreRoadmap} /> : null}
              {view === "suggestions" ? <SuggestionsView suggestions={visibleData.suggestions} /> : null}
            </>
          ) : null}
        </div>
      </main>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="loading-layout" aria-live="polite" aria-label="正在读取 GitHub 数据">
      <div className="skeleton skeleton-heading" />
      <div className="skeleton skeleton-hero" />
      <div className="skeleton-grid">
        <div className="skeleton" /><div className="skeleton" /><div className="skeleton" />
      </div>
    </div>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <section className="error-state" role="alert">
      <AlertTriangle size={24} />
      <p className="eyebrow">DATA INTERRUPTED</p>
      <h1>项目轨迹暂时不可读</h1>
      <p>{message}</p>
      <div><button className="primary-button" type="button" onClick={onRetry}>重新同步</button></div>
    </section>
  );
}

function PartialDataNotice({ failures }: { failures: string[] }) {
  return (
    <details className="partial-notice">
      <summary><AlertTriangle size={15} /> 部分数据暂不可用 <span>{failures.length}</span></summary>
      <ul>{failures.map((failure) => <li key={failure}>{failure}</li>)}</ul>
    </details>
  );
}

function Overview({ data, onNavigate }: { data: DashboardData; onNavigate: (view: View) => void }) {
  const progress = roadmapProgress(data.roadmap);
  const openPulls = data.status.availability.pulls ? data.pulls.filter((pull) => pull.state === "open").length : "不可用";
  const graph = buildBranchGraph(data.commits, data.branches);
  const activity = useMemo(() => {
    const counts = new Map<string, number>();
    data.commits.forEach((commit) => {
      const day = commit.date.slice(0, 10);
      counts.set(day, (counts.get(day) ?? 0) + 1);
    });
    return [...counts.entries()].sort(([a], [b]) => a.localeCompare(b)).slice(-14);
  }, [data.commits]);
  const activityMax = Math.max(1, ...activity.map(([, count]) => count));

  return (
    <div className="view-stack">
      <section className="overview-lead">
        <div className="repo-intro">
          <p className="eyebrow">REPOSITORY OBSERVATORY</p>
          <h1>{data.repository.name}<span>项目轨迹</span></h1>
          <p>{data.repository.description || "通过代码、协作和阶段目标读取项目现在所处的位置。"}</p>
          <a href={data.repository.htmlUrl} target="_blank" rel="noreferrer">打开 GitHub <ArrowUpRight size={14} /></a>
        </div>
        <div className="star-focal">
          <Star size={20} />
          <strong className="mono">{formatNumber(data.repository.stars)}</strong>
          <span>GitHub Stars</span>
          <small>最后活动 {relativeDate(data.repository.updatedAt)}</small>
        </div>
      </section>

      <section className="metric-rail" aria-label="项目指标">
        <Metric icon={GitFork} label="Forks" value={data.repository.forks} />
        <Metric icon={CircleDot} label="Open issues" value={data.repository.openIssues} />
        <Metric icon={GitPullRequest} label="Open PR" value={openPulls} />
        <Metric icon={GitBranch} label="Branches" value={data.branches.length} />
        <Metric icon={Users} label="Contributors" value={data.contributors.length} />
      </section>

      <div className="overview-grid">
        <section className="panel activity-panel">
          <PanelHeading eyebrow="ACTIVITY" title="最近提交脉搏" action="查看分支图" onAction={() => onNavigate("branches")} />
          <div className="activity-chart" aria-label="最近提交活动">
            {activity.length ? activity.map(([date, count]) => (
              <div key={date} className="activity-day">
                <div className="activity-column"><b className="mono">{count}</b><span style={{ height: `${Math.max(8, (count / activityMax) * 100)}%` }} /></div>
                <small>{date.slice(5)}</small>
              </div>
            )) : <div className="empty-inline">暂无提交活动数据</div>}
          </div>
          <div className="activity-summary"><strong className="mono">{graph.nodes.length}</strong><span>个可见提交</span><strong className="mono">{graph.edges.filter((edge) => edge.merge).length}</strong><span>条合并关系</span></div>
        </section>

        <section className="panel branch-health-panel">
          <PanelHeading eyebrow="BRANCH HEALTH" title="分支状态" action="展开" onAction={() => onNavigate("branches")} />
          <div className="branch-list">
            {data.branches.slice(0, 5).map((branch, index) => (
              <div className="branch-row" key={branch.name}>
                <span className={`branch-swatch lane-${index % 8}`} />
                <div><strong>{branch.name}</strong><span>{branch.sha.slice(0, 7)}</span></div>
                <div className="branch-delta mono">+{branch.ahead ?? "—"} / −{branch.behind ?? "—"}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="panel roadmap-panel">
          <PanelHeading eyebrow="ROADMAP" title="阶段目标" action="查看全部" onAction={() => onNavigate("roadmap")} />
          <div className="progress-readout"><strong className="mono">{progress}%</strong><span>已完成检查项</span></div>
          <div className="progress-track"><span style={{ width: `${progress}%` }} /></div>
          {data.roadmap.slice(0, 2).map((phase) => <PhaseLine key={phase.id} phase={phase} />)}
          {!data.roadmap.length ? <div className="empty-inline">未能从项目文档解析阶段目标</div> : null}
        </section>

        <section className="panel release-panel">
          <PanelHeading eyebrow="RELEASES" title="发布刻度" />
          <div className="release-list">
            {data.releases.slice(0, 4).map((release, index) => (
              <a href={release.htmlUrl} target="_blank" rel="noreferrer" key={release.id}>
                <span className="release-marker">{index === 0 ? <Sparkle size={13} /> : null}</span>
                <div><strong>{release.name}</strong><span>{formatDate(release.publishedAt)} · {release.prerelease ? "预发布" : "正式版"}</span></div>
                <ArrowUpRight size={14} />
              </a>
            ))}
            {!data.releases.length ? <div className="empty-inline">暂无 Release</div> : null}
          </div>
        </section>
      </div>

      <button type="button" className="advice-strip" onClick={() => onNavigate("suggestions")}>
        <Lightbulb size={19} />
        <div><span>当前建议</span><strong>{data.suggestions[0]?.title ?? "未发现明显风险"}</strong></div>
        <p>{data.suggestions[0]?.evidence}</p>
        <ChevronRight size={18} />
      </button>
    </div>
  );
}

function Metric({ icon: Icon, label, value }: { icon: typeof Activity; label: string; value: number | string | null }) {
  return <div className="metric"><Icon size={16} /><span>{label}</span><strong className="mono">{typeof value === "number" ? formatNumber(value) : value ?? "不可用"}</strong></div>;
}

function PanelHeading({ eyebrow, title, action, onAction }: { eyebrow: string; title: string; action?: string; onAction?: () => void }) {
  return <header className="panel-heading"><div><span>{eyebrow}</span><h2>{title}</h2></div>{action ? <button type="button" onClick={onAction}>{action}<ChevronRight size={14} /></button> : null}</header>;
}

function PhaseLine({ phase }: { phase: RoadmapPhase }) {
  const completed = phase.items.filter((item) => item.completed).length;
  return <div className="phase-line"><div><strong>{phase.title}</strong><span>{phase.goal || phase.source}</span></div><span className="mono">{phase.items.length ? `${completed}/${phase.items.length}` : "无检查项"}</span></div>;
}

function ContributorsView({ data }: { data: DashboardData }) {
  const [range, setRange] = useState<DateRange>("all");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const [selected, setSelected] = useState<ContributorMetric | null>(null);
  const contributors = useMemo(
    () => scoreContributorsForWindow(data.contributors, { range, from: customFrom, to: customTo }),
    [customFrom, customTo, data.contributors, range],
  );
  const maxScore = Math.max(1, ...contributors.map((item) => item.score));

  return (
    <div className="view-stack">
      <PageHeading eyebrow="CONTRIBUTION LEDGER" title="谁在推动项目向前" description="综合分由提交、合并 PR、评审和代码影响组成；评审统计来自最近 8 个 PR 的公开数据。" />
      <div className="filter-row">
        <div className="segmented" aria-label="贡献时间范围">
          {(["all", "30d", "90d", "365d", "custom"] as DateRange[]).map((item) => (
            <button key={item} type="button" aria-pressed={range === item} className={range === item ? "is-active" : ""} onClick={() => setRange(item)}>
              {{ all: "全历史", "30d": "30 天", "90d": "90 天", "365d": "365 天", custom: "自定义" }[item]}
            </button>
          ))}
        </div>
        {range === "custom" ? <div className="date-filter"><label>从<input type="date" value={customFrom} onChange={(event) => setCustomFrom(event.target.value)} /></label><label>到<input type="date" value={customTo} onChange={(event) => setCustomTo(event.target.value)} /></label></div> : null}
      </div>

      <section className="contributor-ledger">
        <div className="ledger-head"><span>贡献者</span><span>透明综合分</span><span>提交</span><span>PR</span><span>评审</span><span>代码影响</span></div>
        {contributors.map((contributor, index) => {
          const impact = contributor.additions === null || contributor.deletions === null ? null : contributor.additions + contributor.deletions;
          return (
            <button className="contributor-row" type="button" key={contributor.login} onClick={() => setSelected(contributor)}>
              <div className="contributor-person">
                <span className="rank mono">{String(index + 1).padStart(2, "0")}</span>
                {contributor.avatarUrl ? <img src={contributor.avatarUrl} alt="" /> : <span className="avatar-fallback">{contributor.login.slice(0, 1).toUpperCase()}</span>}
                <div><strong>{contributor.name || contributor.login}</strong><span>最近活跃 {relativeDate(contributor.lastActiveAt)}</span></div>
              </div>
              <div className="score-cell"><strong className="mono">{contributor.score}</strong><span><i style={{ width: `${(contributor.score / maxScore) * 100}%` }} /></span></div>
              <span className="mono data-value">{contributor.commits}</span>
              <span className="mono data-value">{contributor.mergedPullRequests}</span>
              <span className="mono data-value">{contributor.reviews ?? "不可用"}</span>
              <span className="mono data-value">{impact === null ? "不可用" : formatNumber(impact)}</span>
            </button>
          );
        })}
        {!contributors.length ? <div className="empty-state">当前时间范围内没有贡献数据。</div> : null}
      </section>
      {selected ? <ContributorDrawer contributor={selected} onClose={() => setSelected(null)} /> : null}
    </div>
  );
}

function ContributorDrawer({ contributor, onClose }: { contributor: ContributorMetric; onClose: () => void }) {
  const dialogRef = useDialogFocus(onClose);
  const parts = [
    ["Commits", contributor.commits, contributor.normalized.commits, "30%"],
    ["Merged PR", contributor.mergedPullRequests, contributor.normalized.mergedPullRequests, "30%"],
    ["Reviews", contributor.reviews, contributor.normalized.reviews, "20%"],
    ["Code impact", contributor.additions === null || contributor.deletions === null ? null : contributor.additions + contributor.deletions, contributor.normalized.codeImpact, "20%"],
  ] as const;
  return (
    <div className="drawer-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <aside ref={dialogRef} className="detail-drawer" aria-modal="true" role="dialog" aria-labelledby="contributor-title">
        <button className="drawer-close" type="button" onClick={onClose} aria-label="关闭贡献者详情"><X size={18} /></button>
        <p className="eyebrow">CONTRIBUTOR TRACE</p>
        <div className="drawer-person">{contributor.avatarUrl ? <img src={contributor.avatarUrl} alt="" /> : <span className="avatar-fallback">{contributor.login.slice(0, 1).toUpperCase()}</span>}<div><h2 id="contributor-title">{contributor.login}</h2><span>最近活跃 {relativeDate(contributor.lastActiveAt)}</span></div></div>
        <div className="drawer-score"><strong className="mono">{contributor.score}</strong><span>透明综合分 / 100</span></div>
        <div className="score-breakdown">{parts.map(([label, raw, normalized, weight]) => <div key={label}><header><span>{label} · 权重 {weight}</span><strong className="mono">{raw ?? "不可用"}</strong></header><span className="breakdown-track"><i style={{ width: `${(normalized ?? 0) * 100}%` }} /></span></div>)}</div>
        <div className="drawer-stats"><div><span>增加</span><strong className="mono">{contributor.additions === null ? "—" : `+${formatNumber(contributor.additions)}`}</strong></div><div><span>删除</span><strong className="mono">{contributor.deletions === null ? "—" : `−${formatNumber(contributor.deletions)}`}</strong></div></div>
        {contributor.profileUrl ? <a className="drawer-link" href={contributor.profileUrl} target="_blank" rel="noreferrer">查看 GitHub 主页 <ArrowUpRight size={15} /></a> : null}
      </aside>
    </div>
  );
}

function BranchesView({ data }: { data: DashboardData }) {
  const [visibleBranches, setVisibleBranches] = useState(() => new Set(data.branches.map((branch) => branch.name)));
  const [dateRange, setDateRange] = useState<"all" | "30d" | "90d" | "365d">("all");
  const [historyLimit, setHistoryLimit] = useState(60);
  const [selected, setSelected] = useState<CommitNode | null>(null);
  const [detail, setDetail] = useState<CommitNode | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const requestSequence = useRef(0);
  const selectedBranches = data.branches.filter((branch) => visibleBranches.has(branch.name));
  const cutoff = dateRange === "all" ? Number.NEGATIVE_INFINITY : Date.now() - Number.parseInt(dateRange, 10) * 86400000;
  const matchingCommits = data.commits.filter((commit) => commit.branches.some((branch) => visibleBranches.has(branch)) && new Date(commit.date).getTime() >= cutoff);
  const commits = buildBranchGraph(matchingCommits, selectedBranches).nodes.slice(0, historyLimit);

  const selectCommit = async (commit: CommitNode) => {
    const sequence = ++requestSequence.current;
    setSelected(commit);
    setDetail(commit);
    if (data.status.source === "fixture") {
      setDetail({ ...commit, additions: 86, deletions: 24, files: [{ filename: "website/src/App.tsx", status: "modified", additions: 42, deletions: 12 }, { filename: "README.md", status: "modified", additions: 44, deletions: 12 }] });
      return;
    }
    setDetailLoading(true);
    try {
      const fetched = await fetchCommitDetail(commit.sha);
      if (sequence === requestSequence.current) setDetail({ ...fetched, branches: commit.branches });
    } catch {
      if (sequence === requestSequence.current) setDetail(commit);
    } finally {
      if (sequence === requestSequence.current) setDetailLoading(false);
    }
  };

  return (
    <div className="view-stack branch-view">
      <PageHeading eyebrow="BRANCH ATLAS" title="真实分支轨迹" description="每条线都来自 commit parent；虚线表示合并关系，越早的轨迹越安静。拖动画布可查看完整历史。" />
      <div className="branch-filter-bar">
        <span>显示分支</span>
        {data.branches.map((branch, index) => (
          <button key={branch.name} type="button" aria-pressed={visibleBranches.has(branch.name)} className={visibleBranches.has(branch.name) ? "is-active" : ""} onClick={() => setVisibleBranches((current) => { const next = new Set(current); if (next.has(branch.name) && next.size > 1) next.delete(branch.name); else next.add(branch.name); return next; })}>
            <i className={`branch-swatch lane-${index % 8}`} />{branch.name}<small className="mono">+{branch.ahead ?? "—"}/−{branch.behind ?? "—"}</small>
          </button>
        ))}
      </div>
      <div className="branch-history-controls">
        <div className="segmented" aria-label="分支历史时间范围">
          {(["all", "30d", "90d", "365d"] as const).map((range) => <button key={range} type="button" aria-pressed={dateRange === range} className={dateRange === range ? "is-active" : ""} onClick={() => { setDateRange(range); setHistoryLimit(60); }}>{{ all: "全部", "30d": "30 天", "90d": "90 天", "365d": "365 天" }[range]}</button>)}
        </div>
        <button className="quiet-button" type="button" onClick={() => setVisibleBranches(new Set([data.repository.defaultBranch]))}>聚焦默认分支</button>
        <span className="mono">已显示 {commits.length}/{matchingCommits.length}</span>
      </div>
      <BranchGraphView commits={commits} branches={selectedBranches} branchOrder={data.branches.map((branch) => branch.name)} selectedSha={selected?.sha} onSelect={(commit) => void selectCommit(commit)} />
      {historyLimit < matchingCommits.length ? <button className="load-history" type="button" onClick={() => setHistoryLimit((current) => current + 60)}>继续加载更早历史</button> : null}
      {detail ? <CommitDrawer commit={detail} loading={detailLoading} onClose={() => { setDetail(null); setSelected(null); }} /> : null}
    </div>
  );
}

function CommitDrawer({ commit, loading, onClose }: { commit: CommitNode; loading: boolean; onClose: () => void }) {
  const dialogRef = useDialogFocus(onClose);
  return (
    <div className="drawer-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <aside ref={dialogRef} className="detail-drawer commit-drawer" role="dialog" aria-modal="true" aria-labelledby="commit-title">
        <button className="drawer-close" type="button" onClick={onClose} aria-label="关闭提交详情"><X size={18} /></button>
        <p className="eyebrow">COMMIT DETAIL</p>
        <span className="commit-sha mono">{commit.sha}</span>
        <h2 id="commit-title">{commit.message}</h2>
        <div className="commit-author"><Code2 size={16} /><div><strong>{commit.author}</strong><span>{new Date(commit.date).toLocaleString("zh-CN")}</span></div></div>
        <dl className="commit-metadata"><div><dt>所属分支</dt><dd>{commit.branches.length ? commit.branches.join(" · ") : "按 SHA 查询"}</dd></div><div><dt>父提交</dt><dd className="mono">{commit.parents.length ? commit.parents.map((sha) => sha.slice(0, 7)).join(" · ") : "根提交"}</dd></div></dl>
        {loading ? <div className="drawer-loading"><RefreshCw className="is-spinning" size={16} /> 正在读取文件明细</div> : (
          <>
            <div className="drawer-stats"><div><span>增加</span><strong className="mono positive">{commit.additions === undefined ? "—" : `+${commit.additions}`}</strong></div><div><span>删除</span><strong className="mono negative">{commit.deletions === undefined ? "—" : `−${commit.deletions}`}</strong></div></div>
            <div className="file-list"><h3>变更文件</h3>{commit.files?.length ? commit.files.slice(0, 20).map((file) => <div key={file.filename}><span className="file-status">{file.status.slice(0, 1).toUpperCase()}</span><strong>{file.filename}</strong><small className="mono"><i>+{file.additions}</i> / −{file.deletions}</small></div>) : <div className="empty-inline">文件统计不可用</div>}</div>
          </>
        )}
        <a className="drawer-link" href={commit.url} target="_blank" rel="noreferrer">在 GitHub 查看提交 <ArrowUpRight size={15} /></a>
      </aside>
    </div>
  );
}

function RoadmapView({ repositoryPhases, override, onChange, onRestore }: { repositoryPhases: RoadmapPhase[]; override: RoadmapOverride | null; onChange: (override: RoadmapOverride) => void; onRestore: () => void }) {
  const phases = useMemo(() => mergeRoadmapOverride(repositoryPhases, override), [repositoryPhases, override]);
  const [editing, setEditing] = useState(false);
  const hasLocalOverride = override !== null;
  const edit = (action: RoadmapEditAction) => {
    const deletedPhaseIds = new Set(override?.deletedPhaseIds ?? []);
    if (action.type === "remove-phase" && repositoryPhases.some((phase) => phase.id === action.phaseId)) deletedPhaseIds.add(action.phaseId);
    onChange({ phases: updateRoadmap(phases, action), deletedPhaseIds: [...deletedPhaseIds] });
  };
  const restore = () => {
    onRestore();
    setEditing(false);
  };
  const totalProgress = roadmapProgress(phases);
  return (
    <div className="view-stack">
      <div className="roadmap-heading-row">
        <PageHeading eyebrow="PROJECT MILESTONES" title="阶段目标与完成刻度" description="目标来自仓库文档与 GitHub Milestones；本地编辑会覆盖解析结果，但不会修改 GitHub 文件。" />
        <div className="roadmap-actions">
          {hasLocalOverride ? <button className="quiet-button" type="button" onClick={restore}><RotateCcw size={15} />恢复仓库结果</button> : null}
          <button className={editing ? "primary-button" : "quiet-button"} type="button" aria-pressed={editing} onClick={() => setEditing((current) => !current)}>{editing ? "完成编辑" : "编辑目标"}</button>
        </div>
      </div>
      <section className="roadmap-overview"><div><span>总体检查项进度</span><strong className="mono">{totalProgress}%</strong></div><div className="progress-track"><span style={{ width: `${totalProgress}%` }} /></div><small>{hasLocalOverride ? "本地覆盖已启用 · 自动保存在此浏览器" : "来源：README、CHANGELOG、产品概念报告、GitHub Milestones"}</small></section>
      {editing ? <button className="add-phase-button" type="button" onClick={() => edit({ type: "add-phase" })}><Plus size={16} />新增阶段</button> : null}
      <div className="roadmap-timeline">
        {phases.map((phase, index) => {
          const completed = phase.items.filter((item) => item.completed).length;
          const progress = phase.items.length ? Math.round((completed / phase.items.length) * 100) : 0;
          return (
            <article className="phase-card" key={phase.id}>
              <div className="phase-index mono">{String(index + 1).padStart(2, "0")}</div>
              <div className="phase-body">
                <header>
                  <div><span>{phase.editedAt ? "本地编辑" : phase.source}</span>{editing ? <><input className="phase-title-input" aria-label={`阶段 ${index + 1} 标题`} value={phase.title} onChange={(event) => edit({ type: "update-phase", phaseId: phase.id, title: event.target.value, goal: phase.goal ?? "" })} /><textarea aria-label={`阶段 ${index + 1} 目标`} value={phase.goal ?? ""} placeholder="阶段目标" onChange={(event) => edit({ type: "update-phase", phaseId: phase.id, title: phase.title, goal: event.target.value })} /></> : <><h2>{phase.title}</h2><p>{phase.goal || "以仓库检查项作为阶段完成标准。"}</p></>}</div>
                  <strong className="mono">{phase.items.length ? `${progress}%` : "—"}</strong>
                </header>
                <div className={`phase-items ${editing ? "is-editing" : ""}`}>
                  {phase.items.length ? phase.items.map((item, itemIndex) => {
                    const itemId = item.id ?? `${phase.id}-item-${itemIndex}`;
                    return editing ? <div className="editable-roadmap-item" key={itemId}><input type="checkbox" checked={item.completed} aria-label={`切换 ${item.label} 完成状态`} onChange={(event) => edit({ type: "update-item", phaseId: phase.id, itemId, label: item.label, completed: event.target.checked })} /><input value={item.label} aria-label={`检查项 ${itemIndex + 1}`} onChange={(event) => edit({ type: "update-item", phaseId: phase.id, itemId, label: event.target.value, completed: item.completed })} /><button type="button" onClick={() => edit({ type: "remove-item", phaseId: phase.id, itemId })} aria-label={`删除检查项 ${item.label}`}><Trash2 size={14} /></button></div> : <div key={itemId} className={item.completed ? "is-complete" : ""}><span>{item.completed ? <Check size={13} /> : null}</span><p>{item.label}</p></div>;
                  }) : !editing ? <div className="empty-inline">该来源未提供可计算的检查项。</div> : null}
                  {editing ? <button className="add-item-button" type="button" onClick={() => edit({ type: "add-item", phaseId: phase.id, label: "新检查项" })}><Plus size={14} />添加检查项</button> : null}
                </div>
                {editing ? <button className="delete-phase-button" type="button" onClick={() => edit({ type: "remove-phase", phaseId: phase.id })}><Trash2 size={14} />删除阶段</button> : null}
              </div>
            </article>
          );
        })}
        {!phases.length ? <div className="empty-state">仓库文档与 Milestones 中暂未解析到阶段目标。</div> : null}
      </div>
    </div>
  );
}

function SuggestionsView({ suggestions }: { suggestions: Suggestion[] }) {
  const severityLabel = { high: "高优先级", medium: "需关注", low: "建议" };
  return (
    <div className="view-stack">
      <PageHeading eyebrow="EVIDENCE-BASED NOTES" title="基于证据的项目建议" description="每条建议都有触发阈值和数据依据；这里没有无法解释的 AI 判断。" />
      <div className="suggestion-list">
        {suggestions.map((suggestion, index) => (
          <article className="suggestion-item" key={suggestion.id}>
            <div className={`severity-marker is-${suggestion.severity}`}><span>{String(index + 1).padStart(2, "0")}</span></div>
            <div className="suggestion-copy"><header><span className={`severity-label is-${suggestion.severity}`}>{severityLabel[suggestion.severity]}</span><h2>{suggestion.title}</h2></header><div className="evidence"><MessageSquareCode size={16} /><p><strong>触发依据</strong>{suggestion.evidence}</p></div><div className="action-note"><BookOpenCheck size={16} /><p><strong>建议动作</strong>{suggestion.action}</p></div></div>
            {suggestion.url ? <a href={suggestion.url} target="_blank" rel="noreferrer" aria-label={`打开 ${suggestion.title} 的 GitHub 证据`}><ArrowUpRight size={17} /></a> : null}
          </article>
        ))}
      </div>
    </div>
  );
}

function PageHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return <header className="page-heading"><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p>{description}</p></header>;
}
