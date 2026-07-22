"use client";

import { track } from "@vercel/analytics";

type OccupationSectionLinkNavItem = {
  href: string;
  label: string;
};

type OccupationSectionLinkNavProps = {
  analytics: {
    eventName?: string;
    occupationCode: string;
    occupationLabel: string;
    occupationSlug: string;
    pageType?: string;
  };
  ariaLabel?: string;
  items: OccupationSectionLinkNavItem[];
};

export function OccupationSectionLinkNav({
  analytics,
  ariaLabel = "Seksjoner på yrkessiden",
  items,
}: OccupationSectionLinkNavProps) {
  if (items.length === 0) {
    return null;
  }

  function handleSectionClick(item: OccupationSectionLinkNavItem) {
    track(analytics.eventName ?? "Occupation detail section clicked", {
      occupation_code: analytics.occupationCode,
      occupation_label: analytics.occupationLabel,
      occupation_slug: analytics.occupationSlug,
      page_type: analytics.pageType ?? "occupation_detail",
      section_id: item.href.replace(/^#/, ""),
      section_label: item.label,
    });
  }

  return (
    <nav
      aria-label={ariaLabel}
      className="mx-auto mb-2 w-full max-w-7xl overflow-x-auto pb-1"
    >
      <div className="flex min-w-max gap-2">
        {items.map((item) => (
          <a
            className="inline-flex h-8 items-center rounded-[5px] border border-slate-200 bg-white px-3 text-sm font-medium text-slate-800 shadow-sm transition hover:border-emerald-700/25 hover:text-emerald-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
            href={item.href}
            key={item.href}
            onClick={() => handleSectionClick(item)}
          >
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
