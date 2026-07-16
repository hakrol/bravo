"use client";

import { useState } from "react";

export function LonnsjekkShareAction() {
  const [status, setStatus] = useState<string | null>(null);

  async function handleShare() {
    const shareData = {
      text: "Sammenlign lønnen din med oppdaterte lønnstall fra SSB.",
      title: "Lønnsjekk",
      url: `${window.location.origin}/lonnsjekk`,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        setStatus("Lønnsjekk er delt.");
        return;
      }

      await navigator.clipboard.writeText(shareData.url);
      setStatus("Lenken er kopiert.");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }

      setStatus("Kunne ikke dele lenken akkurat nå.");
    }
  }

  return (
    <div className="flex flex-col items-center gap-2 px-6 pb-2 sm:px-8">
      <button
        className="inline-flex min-h-11 items-center gap-2 rounded-full border border-emerald-900/15 bg-emerald-50/80 px-5 py-2.5 text-sm font-semibold text-emerald-950 shadow-[0_8px_22px_rgba(15,23,42,0.05)] transition hover:border-emerald-900/30 hover:bg-emerald-100/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2"
        onClick={() => void handleShare()}
        type="button"
      >
        <ShareIcon />
        Del Lønnsjekk med en venn eller kollega
      </button>
      {status ? (
        <p aria-live="polite" className="text-xs font-medium text-slate-500">
          {status}
        </p>
      ) : null}
    </div>
  );
}

function ShareIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24">
      <circle cx="18" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="6" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="18" cy="19" r="2.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="m8.2 10.8 7.6-4.5M8.2 13.2l7.6 4.5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
    </svg>
  );
}
