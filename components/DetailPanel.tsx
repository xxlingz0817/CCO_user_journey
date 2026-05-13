"use client";

import { useCallback, useState } from "react";
import type {
  DesignOpportunity,
  JourneyNode,
  PainPoint,
  Role,
  Severity,
} from "@/data/ccoJourney";

const roleLabel: Record<Role, string> = {
  advertiser: "Advertiser / Marketer",
  technical: "Technical Implementer",
  internal: "Internal / PSO",
};

const roleColor: Record<Role, string> = {
  advertiser: "bg-indigo-100 text-indigo-700",
  technical: "bg-sky-100 text-sky-700",
  internal: "bg-amber-100 text-amber-700",
};

const severityBadge: Record<Severity, string> = {
  high: "bg-red-100 text-red-700",
  medium: "bg-yellow-100 text-yellow-700",
  low: "bg-green-100 text-green-700",
};

const ROLES: Role[] = ["advertiser", "technical", "internal"];
const SEVERITIES: Severity[] = ["high", "medium", "low"];

export type NodeDetailPatch = Partial<
  Pick<JourneyNode, "painPoints" | "designOpportunities" | "openQuestions">
>;

interface Props {
  node: JourneyNode | null;
  onClose: () => void;
  onUpdateNode: (nodeId: string, patch: NodeDetailPatch) => void;
}

function PencilIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  );
}

export default function DetailPanel({ node, onClose, onUpdateNode }: Props) {
  const [editPain, setEditPain] = useState(false);
  const [editDesign, setEditDesign] = useState(false);
  const [editQuestions, setEditQuestions] = useState(false);

  const finishEditPain = useCallback(() => {
    if (!node) return;
    const filtered = node.painPoints.filter((p) => p.text.trim() !== "");
    if (filtered.length !== node.painPoints.length) {
      onUpdateNode(node.id, { painPoints: filtered });
    }
    setEditPain(false);
  }, [node, onUpdateNode]);

  const finishEditDesign = useCallback(() => {
    if (!node) return;
    const filtered = node.designOpportunities.filter(
      (d) => d.title.trim() !== "" || d.description.trim() !== ""
    );
    if (filtered.length !== node.designOpportunities.length) {
      onUpdateNode(node.id, { designOpportunities: filtered });
    }
    setEditDesign(false);
  }, [node, onUpdateNode]);

  const finishEditQuestions = useCallback(() => {
    if (!node) return;
    const filtered = node.openQuestions.filter((q) => q.trim() !== "");
    if (filtered.length !== node.openQuestions.length) {
      onUpdateNode(node.id, { openQuestions: filtered });
    }
    setEditQuestions(false);
  }, [node, onUpdateNode]);

  if (!node) {
    return (
      <aside className="flex min-h-0 w-full flex-1 items-center justify-center bg-slate-50 text-sm text-slate-400">
        Click a node to see details
      </aside>
    );
  }

  const setPainPoints = (points: PainPoint[]) =>
    onUpdateNode(node.id, { painPoints: points });
  const setDesignOps = (items: DesignOpportunity[]) =>
    onUpdateNode(node.id, { designOpportunities: items });
  const setQuestions = (items: string[]) =>
    onUpdateNode(node.id, { openQuestions: items });

  const updatePainAt = (index: number, patch: Partial<PainPoint>) => {
    setPainPoints(
      node.painPoints.map((p, i) => (i === index ? { ...p, ...patch } : p))
    );
  };
  const removePainAt = (index: number) => {
    setPainPoints(node.painPoints.filter((_, i) => i !== index));
  };
  const addPainPoint = () => {
    setPainPoints([
      ...node.painPoints,
      { role: "advertiser", severity: "medium", text: "" },
    ]);
  };

  const updateDesignAt = (index: number, patch: Partial<DesignOpportunity>) => {
    setDesignOps(
      node.designOpportunities.map((d, i) =>
        i === index ? { ...d, ...patch } : d
      )
    );
  };
  const removeDesignAt = (index: number) => {
    setDesignOps(node.designOpportunities.filter((_, i) => i !== index));
  };
  const addDesignOp = () => {
    setDesignOps([...node.designOpportunities, { title: "", description: "" }]);
  };

  const updateQuestionAt = (index: number, value: string) => {
    setQuestions(node.openQuestions.map((q, i) => (i === index ? value : q)));
  };
  const removeQuestionAt = (index: number) => {
    setQuestions(node.openQuestions.filter((_, i) => i !== index));
  };
  const addQuestion = () => {
    setQuestions([...node.openQuestions, ""]);
  };

  const inputClass =
    "w-full rounded-md border border-slate-200 bg-white px-2 py-1.5 text-sm text-slate-800 shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400";
  const selectClass =
    "rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-700 focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400";
  const ghostBtn =
    "rounded-md px-2 py-1 text-xs font-semibold text-slate-500 hover:bg-slate-100 hover:text-slate-800";
  const dangerBtn =
    "rounded-md px-2 py-1 text-xs font-semibold text-red-600 hover:bg-red-50";

  return (
    <aside className="flex min-h-0 w-full flex-1 flex-col overflow-y-auto overscroll-y-contain bg-white [scrollbar-gutter:stable]">
      <div className="px-5 pt-5 pb-4 border-b border-slate-100 sticky top-0 bg-white z-10">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-1">
              {node.stage}
            </div>
            <h2 className="text-base font-semibold text-slate-900 leading-snug">
              {node.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-lg leading-none mt-0.5 shrink-0"
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <p className="mt-2 text-sm text-slate-600 leading-relaxed">
          {node.shortDescription}
        </p>

        <div className="flex flex-wrap gap-1.5 mt-3">
          {node.roles.map((r) => (
            <span
              key={r}
              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${roleColor[r]}`}
            >
              {roleLabel[r]}
            </span>
          ))}
        </div>
      </div>

      <div className="px-5 py-4 space-y-5 text-sm">
        <section>
            <div className="mb-2 flex items-center gap-2">
              <h3 className="flex min-w-0 flex-1 items-center gap-1 font-semibold text-slate-700">
                <span aria-hidden>⚠️</span>
                Pain Points
              </h3>
              {editPain ? (
                <button
                  type="button"
                  onClick={finishEditPain}
                  className="shrink-0 rounded-md px-2 py-1 text-xs font-semibold text-indigo-600 hover:bg-indigo-50"
                >
                  Done
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setEditPain(true)}
                  className="shrink-0 rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                  aria-label="Edit pain points"
                >
                  <PencilIcon />
                </button>
              )}
            </div>
            {editPain ? (
              <ul className="space-y-3">
                {node.painPoints.map((p, i) => (
                  <li
                    key={i}
                    className="rounded-lg border border-slate-200 bg-slate-50/80 p-3 space-y-2"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <label className="text-[10px] font-semibold uppercase text-slate-500">
                        Severity
                      </label>
                      <select
                        className={selectClass}
                        value={p.severity}
                        onChange={(e) =>
                          updatePainAt(i, {
                            severity: e.target.value as Severity,
                          })
                        }
                      >
                        {SEVERITIES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                      <label className="text-[10px] font-semibold uppercase text-slate-500">
                        Role
                      </label>
                      <select
                        className={selectClass}
                        value={p.role}
                        onChange={(e) =>
                          updatePainAt(i, { role: e.target.value as Role })
                        }
                      >
                        {ROLES.map((r) => (
                          <option key={r} value={r}>
                            {roleLabel[r]}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        className={`${dangerBtn} ml-auto`}
                        onClick={() => removePainAt(i)}
                      >
                        Remove
                      </button>
                    </div>
                    <textarea
                      className={`${inputClass} min-h-[4rem] resize-y`}
                      value={p.text}
                      onChange={(e) =>
                        updatePainAt(i, { text: e.target.value })
                      }
                      placeholder="Describe the pain point…"
                    />
                  </li>
                ))}
                <li>
                  <button
                    type="button"
                    className={`${ghostBtn} border border-dashed border-slate-300 w-full py-2`}
                    onClick={addPainPoint}
                  >
                    + Add pain point
                  </button>
                </li>
              </ul>
            ) : node.painPoints.length > 0 ? (
              <ul className="space-y-2">
                {node.painPoints.map((p, i) => (
                  <li key={i} className="flex gap-2 items-start">
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded shrink-0 mt-0.5 ${severityBadge[p.severity]}`}
                    >
                      {p.severity.toUpperCase()}
                    </span>
                    <div>
                      <span
                        className={`text-[9px] font-semibold uppercase ${
                          p.role === "advertiser"
                            ? "text-indigo-500"
                            : p.role === "technical"
                              ? "text-sky-500"
                              : "text-amber-500"
                        }`}
                      >
                        {roleLabel[p.role]}
                      </span>
                      <p className="text-slate-600 leading-snug">{p.text}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-slate-400">No pain points yet.</p>
            )}
        </section>

        <section>
            <div className="mb-2 flex items-center gap-2">
              <h3 className="flex min-w-0 flex-1 items-center gap-1 font-semibold text-slate-700">
                <span aria-hidden>💡</span>
                Design Opportunities
              </h3>
              {editDesign ? (
                <button
                  type="button"
                  onClick={finishEditDesign}
                  className="shrink-0 rounded-md px-2 py-1 text-xs font-semibold text-indigo-600 hover:bg-indigo-50"
                >
                  Done
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setEditDesign(true)}
                  className="shrink-0 rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                  aria-label="Edit design opportunities"
                >
                  <PencilIcon />
                </button>
              )}
            </div>
            {editDesign ? (
              <ul className="space-y-3">
                {node.designOpportunities.map((d, i) => (
                  <li
                    key={i}
                    className="rounded-lg border border-violet-200 bg-violet-50/50 p-3 space-y-2"
                  >
                    <input
                      className={inputClass}
                      value={d.title}
                      onChange={(e) =>
                        updateDesignAt(i, { title: e.target.value })
                      }
                      placeholder="Title"
                    />
                    <textarea
                      className={`${inputClass} min-h-[4rem] resize-y`}
                      value={d.description}
                      onChange={(e) =>
                        updateDesignAt(i, { description: e.target.value })
                      }
                      placeholder="Description"
                    />
                    <button
                      type="button"
                      className={dangerBtn}
                      onClick={() => removeDesignAt(i)}
                    >
                      Remove
                    </button>
                  </li>
                ))}
                <li>
                  <button
                    type="button"
                    className={`${ghostBtn} border border-dashed border-violet-300 w-full py-2`}
                    onClick={addDesignOp}
                  >
                    + Add opportunity
                  </button>
                </li>
              </ul>
            ) : node.designOpportunities.length > 0 ? (
              <ul className="space-y-2">
                {node.designOpportunities.map((d, i) => (
                  <li key={i} className="bg-violet-50 rounded-lg px-3 py-2">
                    <div className="font-medium text-violet-800">{d.title}</div>
                    <p className="text-slate-600 mt-0.5 leading-snug">
                      {d.description}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-slate-400">
                No design opportunities yet.
              </p>
            )}
        </section>

        <section>
            <div className="mb-2 flex items-center gap-2">
              <h3 className="flex min-w-0 flex-1 items-center gap-1 font-semibold text-slate-700">
                <span aria-hidden>❓</span>
                Open Questions
              </h3>
              {editQuestions ? (
                <button
                  type="button"
                  onClick={finishEditQuestions}
                  className="shrink-0 rounded-md px-2 py-1 text-xs font-semibold text-indigo-600 hover:bg-indigo-50"
                >
                  Done
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setEditQuestions(true)}
                  className="shrink-0 rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                  aria-label="Edit open questions"
                >
                  <PencilIcon />
                </button>
              )}
            </div>
            {editQuestions ? (
              <ul className="space-y-2">
                {node.openQuestions.map((q, i) => (
                  <li key={i} className="flex gap-2 items-start">
                    <textarea
                      className={`${inputClass} min-h-[2.75rem] flex-1 resize-y`}
                      value={q}
                      onChange={(e) => updateQuestionAt(i, e.target.value)}
                      placeholder="Question…"
                    />
                    <button
                      type="button"
                      className={`${dangerBtn} shrink-0 self-start`}
                      onClick={() => removeQuestionAt(i)}
                    >
                      Remove
                    </button>
                  </li>
                ))}
                <li>
                  <button
                    type="button"
                    className={`${ghostBtn} border border-dashed border-slate-300 w-full py-2`}
                    onClick={addQuestion}
                  >
                    + Add question
                  </button>
                </li>
              </ul>
            ) : node.openQuestions.length > 0 ? (
              <ul className="space-y-1">
                {node.openQuestions.map((q, i) => (
                  <li
                    key={i}
                    className="text-slate-500 bg-slate-50 rounded px-2 py-1 leading-snug"
                  >
                    {q}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-slate-400">No open questions yet.</p>
            )}
        </section>
      </div>
    </aside>
  );
}
