'use client'

import { useState } from "react";

type InlineDefinitionModalProps = {
  label: string;
  title: string;
  description: string;
};

export function InlineDefinitionModal({
  label,
  title,
  description,
}: InlineDefinitionModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        className="border-b border-dotted border-current text-left text-inherit transition hover:text-[var(--primary-strong)]"
        onClick={() => setIsOpen(true)}
        type="button"
      >
        {label}
      </button>

      {isOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 px-4"
          onClick={() => setIsOpen(false)}
        >
          <div
            aria-modal="true"
            className="w-full max-w-lg rounded-xl border bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.18)]"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--primary-strong)]">
                  Definisjon
                </p>
                <h3 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">
                  {title}
                </h3>
              </div>
              <button
                aria-label="Lukk definisjon"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] text-lg text-slate-600 transition hover:bg-slate-50"
                onClick={() => setIsOpen(false)}
                type="button"
              >
                ×
              </button>
            </div>

            <div className="mt-5 space-y-4 text-sm leading-7 text-slate-700">
              <p>{description}</p>
              <p>
                Tallet viser hva personer i yrket i gjennomsnitt har avtalt i månedslønn på
                måletidspunktet. Det er et gjennomsnitt for registrerte personer i yrket, ikke et
                konkret lønnstilbud til én enkelt person.
              </p>
              <p>
                Beløpet er oppgitt i kroner per måned og bør brukes som markedsnivå og
                sammenligningsgrunnlag. Erfaring, ansiennitet, sektor, geografi og ansvar kan gi
                store utslag for enkeltpersoner.
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
