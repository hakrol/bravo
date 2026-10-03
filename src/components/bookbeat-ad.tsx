"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { getBookbeatTrackingUrl, type BookbeatPlacement } from "@/lib/bookbeat";
import { shouldShowBookbeat } from "@/lib/bookbeat-routes";

type BookbeatAdProps = {
  placement?: BookbeatPlacement;
  className?: string;
};

export function BookbeatAd({ placement = "blog-after-content", className = "" }: BookbeatAdProps) {
  const pathname = usePathname();
  if (!shouldShowBookbeat(pathname)) return null;
  const sidebar = placement.endsWith("sidebar");

  function banner(width: number, height: number, bannerClassName: string) {
    const format = `${width}x${height}`;
    return (
      <a
        href={getBookbeatTrackingUrl(pathname, placement, format)}
        rel="sponsored noopener noreferrer"
        target="_blank"
        className={`mx-auto w-fit max-w-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-purple-600 ${bannerClassName}`}
      >
        <Image
          src={`/annonser/bookbeat/${format}.png`}
          alt="BookBeat – nyt over 1 million bøker. Lytt 60 dager gratis."
          width={width}
          height={height}
          unoptimized
          className="block h-auto max-w-full"
        />
      </a>
    );
  }

  return (
    <aside
      aria-label="Annonse"
      data-ad-placement={placement}
      className={`w-full min-w-0 print:hidden ${sidebar ? "hidden xl:block" : ""} ${className}`}
    >
      <p className="mb-2 text-center text-xs text-slate-500">Annonse</p>
      {sidebar ? banner(160, 600, "block") : (
        <div className="bookbeat-banner-container">
          {banner(300, 250, "bookbeat-banner-compact")}
          {banner(980, 120, "bookbeat-banner-wide")}
        </div>
      )}
    </aside>
  );
}
