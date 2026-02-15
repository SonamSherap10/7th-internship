import type { ReactNode } from "react";

export function Card({
  title,
  children,
  right,
}: {
  title?: string;
  right?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/40">
      {(title || right) && (
        <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
          <div className="text-sm font-semibold text-slate-100">{title}</div>
          <div>{right}</div>
        </div>
      )}
      <div className="p-4">{children}</div>
    </div>
  );
}


