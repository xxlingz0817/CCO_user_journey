"use client";

import { useState, useCallback, useMemo } from "react";
import dynamic from "next/dynamic";
import DetailPanel from "@/components/DetailPanel";
import ResizablePanel from "@/components/ResizablePanel";
import {
  allNodes,
  webEdges,
  appEdges,
  type Branch,
  type Role,
  type JourneyNode,
} from "@/data/ccoJourney";

const JourneyMap = dynamic(() => import("@/components/JourneyMap"), {
  ssr: false,
  loading: () => (
    <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
      Loading map…
    </div>
  ),
});

const roleOptions: { value: Role | "all"; label: string }[] = [
  { value: "all", label: "All Roles" },
  { value: "advertiser", label: "Advertiser / Marketer" },
  { value: "technical", label: "Technical Implementer" },
  { value: "internal", label: "Internal / PSO" },
];

export default function Home() {
  const [branch, setBranch] = useState<Branch>("web");
  const [roleFilter, setRoleFilter] = useState<Role | "all">("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filteredNodes = useMemo(
    () => allNodes.filter((n) => n.branch.includes(branch)),
    [branch]
  );

  const edges = branch === "web" ? webEdges : appEdges;

  const selectedNode: JourneyNode | null =
    allNodes.find((n) => n.id === selectedId) ?? null;

  const handleSelectNode = useCallback((id: string | null) => {
    setSelectedId(id);
  }, []);

  const handleBranchSwitch = (b: Branch) => {
    setBranch(b);
    setSelectedId(null);
  };

  return (
    <div className="h-screen flex flex-col bg-slate-50 font-sans">
      {/* Top bar */}
      <header className="flex items-center gap-4 px-5 py-3 bg-white border-b border-slate-200 shrink-0 flex-wrap">
        <h1 className="text-lg font-bold text-slate-800 mr-2 shrink-0 leading-tight">
          CCO User Journey
        </h1>

        {/* Branch toggle */}
        <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
          {(["web", "app"] as Branch[]).map((b) => (
            <button
              key={b}
              onClick={() => handleBranchSwitch(b)}
              className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${
                branch === b
                  ? "bg-white shadow text-slate-900"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {b === "web" ? "Web CCO" : "App CCO"}
            </button>
          ))}
        </div>

        {/* Role filter */}
        <div className="flex items-center gap-2 ml-2">
          <span className="text-xs text-slate-500 font-medium">Role:</span>
          <div className="flex gap-1 flex-wrap">
            {roleOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setRoleFilter(opt.value)}
                className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                  roleFilter === opt.value
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex min-h-0 flex-1 overflow-hidden">
        <div className="min-h-0 flex-1 min-w-0">
          <JourneyMap
            nodes={filteredNodes}
            edges={edges}
            branch={branch}
            roleFilter={roleFilter}
            selectedId={selectedId}
            onSelectNode={handleSelectNode}
          />
        </div>
        <ResizablePanel defaultVw={40} minVw={20} maxVw={70}>
          <DetailPanel node={selectedNode} onClose={() => setSelectedId(null)} />
        </ResizablePanel>
      </div>
    </div>
  );
}
