"use client";

import ReactFlow, {
  Background,
  Controls,
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

  const hasPain = journey.painPoints.some((p) => p.severity === "high");

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
          {hasPain && (
            <span className="text-[10px] text-red-500 font-bold ml-auto">
              ⚠
            </span>
          )}
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

  const flowEdges: Edge[] = edges.map((e) => ({
    id: e.id,
    source: e.source,
    target: e.target,
    label: e.label,
    animated: e.label === "issue found",
    style: { stroke: "#94a3b8", strokeWidth: 1.5 },
    labelStyle: { fontSize: 10, fill: "#94a3b8" },
  }));

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
    </ReactFlow>
  );
}
