"use client";

import { useEffect, useRef } from "react";

type AdsenseWindow = Window & {
  adsbygoogle?: { push: (ad: Record<string, never>) => unknown };
};

export function AdsenseAd() {
  const adRef = useRef<HTMLModElement>(null);
  const requestedRef = useRef(false);

  useEffect(() => {
    const ad = adRef.current;
    if (!ad) return;

    // Vent på målbar bredde før Google beregner den responsive annonsen.
    const requestAd = () => {
      if (requestedRef.current || ad.getBoundingClientRect().width <= 0) return;
      requestedRef.current = true;

      try {
        const adsWindow = window as AdsenseWindow;
        const queue = adsWindow.adsbygoogle ?? new Array<Record<string, never>>();
        adsWindow.adsbygoogle = queue;
        queue.push({});
      } catch (error) {
        console.error("Kunne ikke initialisere AdSense-annonsen.", error);
      }
    };

    const observer = new ResizeObserver(requestAd);
    observer.observe(ad);
    requestAd();
    return () => observer.disconnect();
  }, []);

  return (
    <aside aria-label="Annonse" className="w-full min-w-0">
      <p className="mb-2 text-center text-xs text-slate-500">Annonse</p>
      <div className="min-h-[280px]">
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client="ca-pub-3073306475357950"
          data-ad-slot="2721562873"
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    </aside>
  );
}
