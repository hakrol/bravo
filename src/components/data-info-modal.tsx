'use client'

import { useState } from "react";

type DataInfoModalProps = {
  title: string;
  description: string;
};

export function DataInfoModal({ title, description }: DataInfoModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        aria-label="Vis informasjon om datagrunnlaget"
        className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-[#d6e2d7] bg-white text-sm font-semibold text-[var(--primary-strong)] shadow-sm transition hover:bg-[#f5f8f5]"
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
            className="w-full max-w-lg rounded-md border bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.18)]"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">
                  {title}
                </h3>
              </div>
              <button
                aria-label="Lukk informasjon"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] text-lg text-slate-600 transition hover:bg-slate-50"
                onClick={() => setIsOpen(false)}
                type="button"
              >
                ×
              </button>
            </div>

            <div className="mt-5 space-y-4 text-sm leading-7 text-slate-700">
              <p>
                Tallene viser median avtalt månedslønn for yrkene i tabellen,
                hentet fra SSB. Det betyr at halvparten tjener mer og
                halvparten tjener mindre. Dette gir et bilde av det typiske lønnsnivået.
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
