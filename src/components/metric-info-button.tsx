'use client'

import { useState } from "react";

type MetricInfoButtonProps = {
  label: string;
  description: string;
  variant?: "default" | "muted";
};

export function MetricInfoButton({ label, description, variant = "default" }: MetricInfoButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const buttonClassName =
    variant === "muted"
      ? "inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-slate-300 bg-white text-[10px] font-semibold text-slate-500 shadow-sm transition hover:bg-slate-50"
      : "inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#d6e2d7] bg-white text-[11px] font-semibold text-[var(--primary-strong)] shadow-sm transition hover:bg-[#f5f8f5]";

  return (
    <>
      <button
        aria-label={`Vis forklaring for ${label.toLowerCase()}`}
        className={buttonClassName}
        onClick={() => setIsOpen(true)}
        type="button"
      >
        i
      </button>

      {isOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 px-4"
          onClick={() => setIsOpen(false)}
        >
          <div
            aria-modal="true"
            className="w-full max-w-md rounded-md border bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.18)]"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--primary-strong)]">
                  Forklaring
                </p>
                <h3 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-slate-950">
                  {label}
                </h3>
              </div>
              <button
                aria-label="Lukk forklaring"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] text-lg text-slate-600 transition hover:bg-slate-50"
                onClick={() => setIsOpen(false)}
                type="button"
              >
                ×
              </button>
            </div>

            <p className="mt-5 text-sm leading-7 text-slate-700">{description}</p>
          </div>
        </div>
      ) : null}
    </>
  );
}
