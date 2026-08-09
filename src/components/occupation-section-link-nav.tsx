"use client";

import { track } from "@vercel/analytics";
import { useEffect, useRef, useState, type MouseEvent } from "react";

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
  const [activeHref, setActiveHref] = useState(items[0]?.href ?? "");
  const navScrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sectionElements = items
      .map((item) => ({
        element: document.getElementById(item.href.replace(/^#/, "")),
        href: item.href,
      }))
      .filter(
        (section): section is { element: HTMLElement; href: string } => Boolean(section.element),
      );

    if (sectionElements.length === 0) {
      return;
    }

    let animationFrame = 0;

    const updateActiveSection = () => {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = window.requestAnimationFrame(() => {
        const activationLine = 72;
        let nextActiveHref = sectionElements[0].href;

        for (const section of sectionElements) {
          if (section.element.getBoundingClientRect().top <= activationLine) {
            nextActiveHref = section.href;
          } else {
            break;
          }
        }

        const isAtPageBottom =
          window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;

        if (isAtPageBottom) {
          nextActiveHref = sectionElements[sectionElements.length - 1].href;
        }

        setActiveHref((currentHref) =>
          currentHref === nextActiveHref ? currentHref : nextActiveHref,
        );
      });
    };

    updateActiveSection();
    window.addEventListener("resize", updateActiveSection);
    window.addEventListener("scroll", updateActiveSection, { passive: true });

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", updateActiveSection);
      window.removeEventListener("scroll", updateActiveSection);
    };
  }, [items]);

  useEffect(() => {
    const scroller = navScrollerRef.current;
    const activeLink = scroller?.querySelector<HTMLElement>(
      `[data-section-href="${activeHref}"]`,
    );

    if (!scroller || !activeLink) {
      return;
    }

    const targetLeft = activeLink.offsetLeft - (scroller.clientWidth - activeLink.offsetWidth) / 2;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    scroller.scrollTo({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      left: Math.max(0, targetLeft),
    });
  }, [activeHref]);

  if (items.length === 0) {
    return null;
  }

  function handleSectionClick(
    event: MouseEvent<HTMLAnchorElement>,
    item: OccupationSectionLinkNavItem,
  ) {
    const target = document.getElementById(item.href.replace(/^#/, ""));

    if (target) {
      event.preventDefault();
      const stickyOffset = 56;
      const targetTop = target.getBoundingClientRect().top + window.scrollY - stickyOffset;

      window.history.pushState(null, "", item.href);
      window.scrollTo({ behavior: "smooth", top: targetTop });
      setActiveHref(item.href);
    }

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
      className="sticky top-0 z-[60] mb-3 w-full border-y border-slate-200/80 bg-white/94 px-2 py-1.5 shadow-[0_8px_22px_rgba(15,47,34,0.09)] backdrop-blur-xl sm:px-4 lg:px-6"
    >
      <div
        className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        ref={navScrollerRef}
      >
        <div className="mx-auto flex w-max min-w-full justify-center gap-1">
          {items.map((item) => {
            const isActive = activeHref === item.href;

            return (
              <a
                aria-current={isActive ? "location" : undefined}
                className={[
                  "inline-flex h-9 items-center justify-center gap-2 rounded-lg border px-3 text-[13px] font-medium whitespace-nowrap transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700",
                  isActive
                    ? "border-emerald-700 bg-emerald-700 text-white shadow-[0_5px_14px_rgba(4,120,64,0.24)]"
                    : "border-slate-200/80 bg-white/80 text-slate-700 shadow-sm hover:border-emerald-700/20 hover:bg-emerald-50/45 hover:text-emerald-900",
                ].join(" ")}
                data-section-href={item.href}
                href={item.href}
                key={item.href}
                onClick={(event) => handleSectionClick(event, item)}
              >
                <SectionIcon href={item.href} />
                <span>{item.label}</span>
              </a>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

function SectionIcon({ href }: { href: string }) {
  const commonProps = {
    "aria-hidden": true,
    className: "h-4 w-4 shrink-0",
    fill: "none",
    viewBox: "0 0 24 24",
    xmlns: "http://www.w3.org/2000/svg",
  } as const;

  switch (href) {
    case "#kort-oppsummert":
      return (
        <svg {...commonProps}>
          <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.7" />
          <circle cx="16" cy="16" r="3" stroke="currentColor" strokeWidth="1.7" />
          <path d="M14.5 6.5h2a2 2 0 0 1 2 2v2M9.5 17.5h-2a2 2 0 0 1-2-2v-2" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
        </svg>
      );
    case "#manedslonn":
      return (
        <svg {...commonProps}>
          <ellipse cx="12" cy="6" rx="6.5" ry="3" stroke="currentColor" strokeWidth="1.7" />
          <path d="M5.5 6v4c0 1.7 2.9 3 6.5 3s6.5-1.3 6.5-3V6M5.5 10v4c0 1.7 2.9 3 6.5 3s6.5-1.3 6.5-3v-4M5.5 14v4c0 1.7 2.9 3 6.5 3s6.5-1.3 6.5-3v-4" stroke="currentColor" strokeWidth="1.7" />
        </svg>
      );
    case "#lonn":
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.7" />
          <path d="M12 7v5l3 2" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
        </svg>
      );
    case "#lonnsfordeling":
      return (
        <svg {...commonProps}>
          <path d="M12 3v9h9A9 9 0 1 1 12 3Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.7" />
          <path d="M15 3.6A8.7 8.7 0 0 1 20.4 9H15V3.6Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.7" />
        </svg>
      );
    case "#lonnsutvikling":
      return (
        <svg {...commonProps}>
          <path d="m4 17 5-5 4 3 7-8" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
          <circle cx="4" cy="17" r="1.25" fill="currentColor" />
          <circle cx="9" cy="12" r="1.25" fill="currentColor" />
          <circle cx="13" cy="15" r="1.25" fill="currentColor" />
          <circle cx="20" cy="7" r="1.25" fill="currentColor" />
        </svg>
      );
    case "#reallonn":
      return (
        <svg {...commonProps}>
          <path d="M5 8.5h13.5a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-11a2 2 0 0 1 2-2h10" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.7" />
          <path d="M16 12h5v4h-5a2 2 0 1 1 0-4Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.7" />
        </svg>
      );
    case "#lonnsestimat":
      return (
        <svg {...commonProps}>
          <rect x="5" y="3" width="14" height="18" rx="2" stroke="currentColor" strokeWidth="1.7" />
          <path d="M8 7h8M8 11h2m2 0h1m2 0h1M8 15h2m2 0h1m2 0h1M8 18h2m2 0h4" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
        </svg>
      );
    case "#relaterte-jobber":
      return (
        <svg {...commonProps}>
          <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.7" />
          <circle cx="17" cy="9" r="2.4" stroke="currentColor" strokeWidth="1.7" />
          <path d="M3.5 19c.5-3.4 2.5-5.2 5.5-5.2s5 1.8 5.5 5.2M14.5 14.2c3.3-.8 5.5.8 6 3.8" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
        </svg>
      );
    default:
      return (
        <svg {...commonProps}>
          <path d="M5 20V12m5 8V7m5 13V10m5 10V4" stroke="currentColor" strokeLinecap="round" strokeWidth="1.9" />
        </svg>
      );
  }
}
