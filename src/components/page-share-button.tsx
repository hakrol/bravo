"use client";

import { useState } from "react";

type PageShareButtonProps = {
  title: string;
  text?: string;
};

export function PageShareButton({ title, text }: PageShareButtonProps) {
  const [status, setStatus] = useState<string | null>(null);

  async function handleShare() {
    const url = window.location.href;
    const shareData: ShareData = {
      title,
      url,
    };

    if (text) {
      shareData.text = text;
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        setStatus(null);
        return;
      }

      await navigator.clipboard.writeText(url);
      setStatus("Lenken er kopiert");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }

      setStatus("Kunne ikke dele siden");
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        className="inline-flex items-center rounded-[5px] border border-emerald-100 bg-white/95 px-4 py-2 text-sm font-semibold text-emerald-950 shadow-[0_14px_32px_rgba(0,0,0,0.12)] transition hover:bg-white hover:shadow-[0_18px_40px_rgba(0,0,0,0.18)]"
        onClick={handleShare}
        type="button"
      >
        Del siden med en venn eller kollega
      </button>
      {status ? (
        <span aria-live="polite" className="text-sm font-medium text-emerald-50">
          {status}
        </span>
      ) : null}
    </div>
  );
}
