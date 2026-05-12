"use client";

import ReactFlow, {
  Background,
  Controls,
  Panel,
  type Node,
  type Edge,
  type NodeProps,
  Handle,
  Position,
} from "reactflow";
import "reactflow/dist/style.css";
import { useMemo } from "react";
import type { Branch, Role, JourneyNode } from "@/data/ccoJourney";

// ─── Role colours ─────────────────────────────────────────────────────────────
const roleMeta: Record<Role, { label: string; color: string }> = {
  advertiser: { label: "Advertiser", color: "#6366f1" },
  technical: { label: "Technical", color: "#0ea5e9" },
  internal: { label: "Internal / PSO", color: "#f59e0b" },
};

const stageColors: Record<string, string> = {
  Setup: "#e0f2fe",
  "CCO Creation": "#ede9fe",
  Validation: "#fef9c3",
  Activation: "#dcfce7",
  Support: "#fee2e2",
};

const STAGE_LEGEND_ORDER = [
  "Setup",
  "CCO Creation",
  "Validation",
  "Activation",
  "Support",
] as const;

const ROLE_LEGEND_ORDER: Role[] = ["advertiser", "technical", "internal"];

// ─── Custom node ─────────────────────────────────────────────────────────────
interface FlowNodeData {
  journey: JourneyNode;
  isSelected: boolean;
  dimmed: boolean;
  onClick: (id: string) => void;
}

function JourneyFlowNode({ data }: NodeProps<FlowNodeData>) {
  const { journey, isSelected, dimmed, onClick } = data;
  const bg = stageColors[journey.stage] ?? "#f3f4f6";

  return (
    <>
      <Handle type="target" position={Position.Left} style={{ opacity: 0 }} />
      <div
        onClick={() => onClick(journey.id)}
        style={{
          background: bg,
          opacity: dimmed ? 0.35 : 1,
          borderWidth: isSelected ? 2 : 1,
          borderColor: isSelected ? "#6366f1" : "#cbd5e1",
          transition: "opacity 0.2s, box-shadow 0.2s",
        }}
        className="rounded-xl px-4 py-3 w-48 cursor-pointer shadow-sm hover:shadow-md"
      >
        {/* Stage label */}
        <div className="text-[9px] font-semibold uppercase tracking-widest text-slate-400 mb-1">
          {journey.stage}
        </div>

        {/* Title */}
        <div className="text-sm font-semibold text-slate-800 leading-snug">
          {journey.title}
        </div>

        {/* Role dots */}
        <div className="flex gap-1 mt-2 flex-wrap">
          {journey.roles.map((r) => (
            <span
              key={r}
              title={roleMeta[r].label}
              style={{ background: roleMeta[r].color }}
              className="w-2 h-2 rounded-full"
            />
          ))}
        </div>
      </div>
      <Handle type="source" position={Position.Right} style={{ opacity: 0 }} />
    </>
  );
}

const nodeTypes = { journey: JourneyFlowNode };

// ─── Layout helper ────────────────────────────────────────────────────────────
// Lay nodes out left-to-right based on their order in the array.
// Each branch gets its own row.
function buildFlowElements(
  nodes: JourneyNode[],
  edges: { id: string; source: string; target: string; label?: string }[],
  selectedId: string | null,
  roleFilter: Role | "all",
  onClick: (id: string) => void
): { flowNodes: Node[]; flowEdges: Edge[] } {
  const stageOrder = ["Setup", "CCO Creation", "Validation", "Activation", "Support"];
  const sorted = [...nodes].sort(
    (a, b) => stageOrder.indexOf(a.stage) - stageOrder.indexOf(b.stage)
  );

  const flowNodes: Node[] = sorted.map((n, i) => {
    const dimmed =
      roleFilter !== "all" && !n.roles.includes(roleFilter as Role);
    return {
      id: n.id,
      type: "journey",
      position: { x: i * 230, y: 0 },
      data: {
        journey: n,
        isSelected: selectedId === n.id,
        dimmed,
        onClick,
      } as FlowNodeData,
    };
  });

  const flowEdges: Edge[] = edges.map((e) => {
    const issueHandoff = e.label === "issue found";
    return {
      id: e.id,
      source: e.source,
      target: e.target,
      animated: false,
      style: {
        stroke: "#94a3b8",
        strokeWidth: 1.5,
        ...(issueHandoff ? { strokeDasharray: "5 5" } : {}),
      },
    };
  });

  return { flowNodes, flowEdges };
}

// ─── Props ────────────────────────────────────────────────────────────────────
interface JourneyMapProps {
  nodes: JourneyNode[];
  edges: { id: string; source: string; target: string; label?: string }[];
  branch: Branch;
  roleFilter: Role | "all";
  selectedId: string | null;
  onSelectNode: (id: string | null) => void;
}

export default function JourneyMap({
  nodes,
  edges,
  roleFilter,
  selectedId,
  onSelectNode,
}: JourneyMapProps) {
  const { flowNodes, flowEdges } = useMemo(
    () => buildFlowElements(nodes, edges, selectedId, roleFilter, onSelectNode),
    [nodes, edges, selectedId, roleFilter, onSelectNode]
  );

  return (
    <ReactFlow
      nodes={flowNodes}
      edges={flowEdges}
      nodeTypes={nodeTypes}
      fitView
      fitViewOptions={{ padding: 0.2 }}
      onNodeClick={(_, node) => onSelectNode(node.id)}
      onPaneClick={() => onSelectNode(null)}
      proOptions={{ hideAttribution: true }}
      minZoom={0.3}
      maxZoom={2}
    >
      <Background color="#e2e8f0" gap={20} />
      <Controls showInteractive={false} />
      <Panel
        position="top-left"
        className="!m-3 max-w-[calc(100%-1.5rem)] rounded-lg border border-slate-200/90 bg-white/95 px-3 py-2 shadow-sm backdrop-blur-sm"
      >
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
          {STAGE_LEGEND_ORDER.map((stage) => (
            <div key={stage} className="flex items-center gap-1.5">
              <span
                style={{ background: stageColors[stage] }}
                className="h-3 w-3 shrink-0 rounded border border-slate-200"
              />
              <span className="text-xs text-slate-600">
                {stage === "CCO Creation" ? "Creation" : stage}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5 border-t border-slate-100 pt-2">
          {ROLE_LEGEND_ORDER.map((r) => (
            <div key={r} className="flex items-center gap-1.5">
              <span
                style={{ background: roleMeta[r].color }}
                className="h-2.5 w-2.5 shrink-0 rounded-full"
              />
              <span className="text-xs text-slate-600">{roleMeta[r].label}</span>
            </div>
          ))}
        </div>
      </Panel>
    </ReactFlow>
  );
}
