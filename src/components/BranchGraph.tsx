import { useMemo, useRef, useState } from "react";
import { Focus, Minus, Plus } from "lucide-react";
import { buildBranchGraph, nodeBySha } from "../lib/analytics";
import type { BranchRef, CommitNode } from "../types";

const LANE_COLORS = ["var(--lane-0)", "var(--lane-1)", "var(--lane-2)", "var(--lane-3)", "var(--lane-4)", "var(--lane-5)", "var(--lane-6)", "var(--lane-7)"];
const ROW_HEIGHT = 64;
const LANE_WIDTH = 34;
const GRAPH_LEFT = 38;

interface BranchGraphViewProps {
  commits: CommitNode[];
  branches: BranchRef[];
  branchOrder: string[];
  onSelect: (commit: CommitNode) => void;
  selectedSha?: string;
}

export function BranchGraphView({ commits, branches, branchOrder, onSelect, selectedSha }: BranchGraphViewProps) {
  const graph = useMemo(() => buildBranchGraph(commits, branches), [branches, commits]);
  const nodes = useMemo(() => nodeBySha(graph.nodes), [graph.nodes]);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const drag = useRef<{ x: number; y: number; startX: number; startY: number } | null>(null);
  const height = Math.max(460, graph.nodes.length * ROW_HEIGHT + 92);
  const longestTip = Math.max(0, ...branches.map((branch) => branch.name.length * 7.4 + 36));
  const copyLeft = Math.max(356, GRAPH_LEFT + Math.max(0, graph.laneCount - 1) * LANE_WIDTH + longestTip + 26);
  const width = Math.max(980, copyLeft + 540);
  const colorForLane = (lane: number) => {
    const stableIndex = Math.max(0, branchOrder.indexOf(branches[lane]?.name));
    return LANE_COLORS[stableIndex % LANE_COLORS.length];
  };

  const resetView = () => {
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  };

  return (
    <section className="branch-canvas" aria-label="Git 分支图">
      <div className="graph-toolbar" aria-label="分支图缩放控制">
        <button type="button" onClick={() => setZoom((value) => Math.max(0.7, value - 0.1))} aria-label="缩小分支图">
          <Minus size={16} />
        </button>
        <span className="mono">{Math.round(zoom * 100)}%</span>
        <button type="button" onClick={() => setZoom((value) => Math.min(1.6, value + 0.1))} aria-label="放大分支图">
          <Plus size={16} />
        </button>
        <button type="button" onClick={resetView} aria-label="重置分支图位置">
          <Focus size={16} />
        </button>
      </div>

      {graph.nodes.length === 0 ? (
        <div className="empty-state">当前筛选条件下没有可绘制的提交。</div>
      ) : (
        <div className="graph-scroll">
          <svg
            className="git-graph"
            viewBox={`0 0 ${width} ${height}`}
            style={{ width: width * zoom, height: height * zoom }}
            role="img"
            aria-label={`${branches.length} 条分支、${graph.nodes.length} 个提交的历史图`}
            onPointerDown={(event) => {
              if ((event.target as Element).closest("[data-commit-node]")) return;
              drag.current = { x: event.clientX, y: event.clientY, startX: offset.x, startY: offset.y };
              event.currentTarget.setPointerCapture(event.pointerId);
            }}
            onPointerMove={(event) => {
              if (!drag.current) return;
              setOffset({
                x: drag.current.startX + (event.clientX - drag.current.x) / zoom,
                y: drag.current.startY + (event.clientY - drag.current.y) / zoom,
              });
            }}
            onPointerUp={(event) => {
              drag.current = null;
              event.currentTarget.releasePointerCapture(event.pointerId);
            }}
          >
            <g transform={`translate(${offset.x} ${offset.y})`}>
              {graph.edges.map((edge) => {
                const from = nodes.get(edge.from);
                const to = nodes.get(edge.to);
                if (!from || !to) return null;
                const x1 = GRAPH_LEFT + from.lane * LANE_WIDTH;
                const y1 = 54 + from.row * ROW_HEIGHT;
                const x2 = GRAPH_LEFT + to.lane * LANE_WIDTH;
                const y2 = 54 + to.row * ROW_HEIGHT;
                const midpoint = y1 + (y2 - y1) * 0.5;
                return (
                  <path
                    key={`${edge.from}-${edge.to}`}
                    d={`M ${x1} ${y1} C ${x1} ${midpoint}, ${x2} ${midpoint}, ${x2} ${y2}`}
                    fill="none"
                    stroke={colorForLane(from.lane)}
                    strokeWidth={edge.merge ? 1.5 : 2}
                    strokeDasharray={edge.merge ? "5 4" : undefined}
                    opacity={Math.max(0.28, Math.min(from.emphasis, to.emphasis))}
                  />
                );
              })}

              {graph.nodes.map((node) => {
                const x = GRAPH_LEFT + node.lane * LANE_WIDTH;
                const y = 54 + node.row * ROW_HEIGHT;
                const tip = branches.find((branch) => branch.sha === node.sha);
                const color = colorForLane(node.lane);
                return (
                  <g
                    key={node.sha}
                    data-commit-node
                    className={`commit-node ${selectedSha === node.sha ? "is-selected" : ""}`}
                    role="button"
                    tabIndex={0}
                    aria-label={`${node.message}，${node.author}，${new Date(node.date).toLocaleString("zh-CN")}`}
                    onClick={() => onSelect(node)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        onSelect(node);
                      }
                    }}
                  >
                    <rect x="18" y={y - 25} width={width - 40} height="50" rx="5" fill="transparent" />
                    <circle cx={x} cy={y} r={node.parents.length > 1 ? 7 : 5.5} fill="var(--surface-1)" stroke={color} strokeWidth={selectedSha === node.sha ? 3 : 2} opacity={node.emphasis} />
                    {tip ? (
                      <g transform={`translate(${x + 14} ${y - 13})`}>
                        <rect width={Math.max(70, tip.name.length * 7.4 + 22)} height="26" rx="5" fill="var(--surface-3)" stroke={color} strokeOpacity="0.7" />
                        <text x="10" y="17" className="svg-branch-label" fill={color}>{tip.name}</text>
                      </g>
                    ) : null}
                    <text x={copyLeft} y={y - 7} className="svg-commit-title" opacity={Math.max(0.58, node.emphasis)}>
                      {node.message.length > 66 ? `${node.message.slice(0, 66)}…` : node.message}
                    </text>
                    <text x={copyLeft} y={y + 14} className="svg-commit-meta" opacity={Math.max(0.48, node.emphasis)}>
                      {node.sha.slice(0, 7)} · {node.author} · {new Date(node.date).toLocaleDateString("zh-CN")}
                    </text>
                  </g>
                );
              })}
            </g>
          </svg>
        </div>
      )}
    </section>
  );
}
