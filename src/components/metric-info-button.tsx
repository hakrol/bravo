'use client'

import { useState } from "react";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";

type MetricInfoButtonProps = {
  label: string;
  description: ReactNode;
  children?: ReactNode;
  modalVariant?: "default" | "compact";
  variant?: "default" | "muted";
};

export function MetricInfoButton({
  label,
  description,
  children,
  modalVariant = "default",
  variant = "default",
}: MetricInfoButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const iconClassName =
    variant === "muted"
      ? "inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-slate-300 bg-white text-[10px] font-semibold text-slate-500 shadow-sm transition hover:bg-slate-50"
      : "inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#d6e2d7] bg-white text-[11px] font-semibold text-[var(--primary-strong)] shadow-sm transition hover:bg-[#f5f8f5]";
  const buttonClassName = children
    ? "inline-flex items-center justify-center gap-2 text-sm font-semibold text-[var(--primary-strong)] transition hover:text-[var(--primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--primary-strong)]"
    : iconClassName;
  const backdropClassName =
    modalVariant === "compact"
      ? "fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 px-4"
      : "fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/35 px-4 py-6 sm:py-10";
  const dialogClassName =
    modalVariant === "compact"
      ? "w-full max-w-md rounded-md border bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.18)]"
      : "w-full max-w-2xl rounded-md border bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.18)]";

  return (
    <>
      <button
        aria-label={`Vis forklaring for ${label.toLowerCase()}`}
        className={buttonClassName}
        onClick={() => setIsOpen(true)}
        type="button"
      >
        {children ? (
          <>
            <span className={iconClassName} aria-hidden>
              i
            </span>
            <span>{children}</span>
          </>
        ) : (
          "i"
        )}
      </button>

      {isOpen ? createPortal(
        <div
          className={backdropClassName}
          onClick={() => setIsOpen(false)}
        >
          <div
            aria-modal="true"
            className={dialogClassName}
            onClick={(event) => event.stopPropagation()}
            role="dialog"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="pt-1">
                <h3 className="text-2xl font-semibold tracking-[-0.03em] text-slate-950">
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

            {typeof description === "string" ? (
              <p className="mt-5 text-base leading-7 text-slate-700 sm:text-lg sm:leading-8">
                {description}
              </p>
            ) : (
              <div className="mt-5 text-base leading-7 text-slate-700 sm:text-lg sm:leading-8">
                {description}
              </div>
            )}
          </div>
        </div>
      , document.body) : null}
    </>
  );
}
