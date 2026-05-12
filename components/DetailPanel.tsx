"use client";

import type { JourneyNode, Role, Severity } from "@/data/ccoJourney";

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

interface Props {
  node: JourneyNode | null;
  onClose: () => void;
}

export default function DetailPanel({ node, onClose }: Props) {
  if (!node) {
    return (
      <aside className="flex h-full min-h-0 w-full shrink-0 items-center justify-center bg-slate-50 text-sm text-slate-400">
        Click a node to see details
      </aside>
    );
  }

  return (
    <aside className="flex min-h-0 w-full shrink-0 flex-col overflow-y-auto bg-white">
      {/* Header */}
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

        {/* Roles */}
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
        {/* Pain Points */}
        {node.painPoints.length > 0 && (
          <section>
            <h3 className="font-semibold text-slate-700 mb-2 flex items-center gap-1">
              <span aria-hidden>⚠️</span> Pain Points
            </h3>
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
          </section>
        )}

        {/* Design Opportunities */}
        {node.designOpportunities.length > 0 && (
          <section>
            <h3 className="font-semibold text-slate-700 mb-2 flex items-center gap-1">
              <span aria-hidden>💡</span> Design Opportunities
            </h3>
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
          </section>
        )}

        {/* Dependencies */}
        {node.dependencies.length > 0 && (
          <section>
            <h3 className="font-semibold text-slate-700 mb-2 flex items-center gap-1">
              <span aria-hidden>🔗</span> Dependencies
            </h3>
            <ul className="space-y-1">
              {node.dependencies.map((d) => (
                <li
                  key={d}
                  className="text-slate-500 bg-slate-50 rounded px-2 py-1 leading-snug"
                >
                  {d}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Open Questions */}
        {node.openQuestions.length > 0 && (
          <section>
            <h3 className="font-semibold text-slate-700 mb-2 flex items-center gap-1">
              <span aria-hidden>❓</span> Open Questions
            </h3>
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
          </section>
        )}
      </div>
    </aside>
  );
}
