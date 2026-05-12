"use client";

import {
  useState,
  useCallback,
  useEffect,
  type ReactNode,
  type KeyboardEvent,
  type MouseEvent as ReactMouseEvent,
} from "react";

type Props = {
  children: ReactNode;
  /** Initial width as % of viewport width (vw). */
  defaultVw?: number;
  minVw?: number;
  maxVw?: number;
};

export default function ResizablePanel({
  children,
  defaultVw = 40,
  minVw = 20,
  maxVw = 70,
}: Props) {
  const [panelVw, setPanelVw] = useState(defaultVw);

  const clamp = useCallback(
    (v: number) => Math.min(maxVw, Math.max(minVw, v)),
    [minVw, maxVw]
  );

  useEffect(() => {
    const onResize = () => {
      setPanelVw((w) => clamp(w));
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [clamp]);

  const startDrag = useCallback(
    (e: ReactMouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      const startX = e.clientX;
      const startVw = panelVw;

      const onMove = (ev: globalThis.MouseEvent) => {
        const iw = window.innerWidth || 1;
        const vwPerPx = 100 / iw;
        const deltaVw = (startX - ev.clientX) * vwPerPx;
        setPanelVw(clamp(startVw + deltaVw));
      };

      const onUp = () => {
        document.removeEventListener("mousemove", onMove);
        document.removeEventListener("mouseup", onUp);
        document.body.style.removeProperty("user-select");
        document.body.style.removeProperty("cursor");
      };

      document.body.style.userSelect = "none";
      document.body.style.cursor = "col-resize";
      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onUp);
    },
    [panelVw, clamp]
  );

  const onHandleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        setPanelVw((w) => clamp(w + 1));
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        setPanelVw((w) => clamp(w - 1));
      }
    },
    [clamp]
  );

  return (
    <div
      className="flex h-full min-h-0 shrink-0 overflow-hidden border-l border-slate-200 bg-slate-50"
      style={{ width: `${panelVw}vw` }}
    >
      <button
        type="button"
        role="separator"
        aria-orientation="vertical"
        aria-valuenow={Math.round(panelVw)}
        aria-valuemin={minVw}
        aria-valuemax={maxVw}
        aria-label="Resize detail panel"
        onMouseDown={startDrag}
        onKeyDown={onHandleKeyDown}
        className="group w-3 shrink-0 cursor-col-resize border-0 bg-slate-100 p-0 outline-none hover:bg-slate-200 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-400"
      >
        <span
          className="mx-auto my-2 block h-[calc(100%-1rem)] max-h-48 w-0.5 rounded-full bg-slate-300 group-hover:bg-indigo-400 group-focus-visible:bg-indigo-500"
          aria-hidden
        />
      </button>
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-slate-50">
        {children}
      </div>
    </div>
  );
}
