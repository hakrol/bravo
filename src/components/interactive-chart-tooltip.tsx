import type { ComponentPropsWithRef } from "react";

/** Felles utseende; hvert diagram styrer plassering og responsiv oppførsel. */
export function InteractiveChartTooltip({ className = "", ...props }: ComponentPropsWithRef<"div">) {
  return <div {...props} role="tooltip" className={`rounded-[6px] border border-slate-200 bg-white px-4 py-3 text-xs leading-5 text-slate-600 shadow-[0_12px_32px_rgba(15,23,42,0.12)] ${className}`} />;
}
