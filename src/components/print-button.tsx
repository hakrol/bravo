"use client";

type PrintButtonProps = {
  label?: string;
};

export function PrintButton({ label = "Skriv ut eller lagre som PDF" }: PrintButtonProps) {
  return (
    <button
      className="print:hidden inline-flex min-h-11 items-center justify-center rounded-[5px] border border-transparent bg-[var(--primary-strong)] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(20,83,45,0.18)] transition hover:bg-[#0f6a37] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary-strong)]"
      type="button"
      onClick={() => window.print()}
    >
      {label}
    </button>
  );
}
