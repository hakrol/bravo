"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { AdsenseScript } from "@/components/adsense-script";
import { ADSENSE_CLIENT_ID, ADSENSE_SLOTS, type AdsensePlacement } from "@/lib/adsense";
import { shouldLoadAdsense } from "@/lib/adsense-routes";

type AdsenseWindow = Window & {
  adsbygoogle?: { push: (ad: Record<string, never>) => unknown };
};

type AdsenseAdProps = {
  placement?: AdsensePlacement;
  className?: string;
};

export function AdsenseAd({ placement = "blog-after-content", className = "" }: AdsenseAdProps) {
  const pathname = usePathname();
  if (!shouldLoadAdsense(pathname)) return null;

  return <AdsenseUnit key={`${pathname}:${placement}`} placement={placement} className={className} />;
}

function AdsenseUnit({ placement = "blog-after-content", className = "" }: AdsenseAdProps) {
  const sidebar = placement.endsWith("sidebar");
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
    <aside
      aria-label="Annonse"
      data-ad-placement={placement}
      className={`w-full min-w-0 print:hidden ${sidebar ? "hidden xl:block" : ""} ${className}`}
    >
      <AdsenseScript />
      <p className="mb-2 text-center text-xs text-slate-500">Annonse</p>
      <div className={sidebar ? "min-h-[600px]" : "min-h-[280px]"}>
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client={ADSENSE_CLIENT_ID}
          data-ad-slot={ADSENSE_SLOTS[placement]}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    </aside>
  );
}
