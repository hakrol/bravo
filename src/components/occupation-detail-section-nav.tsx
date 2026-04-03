"use client";

import { useEffect, useMemo, useState } from "react";

export type OccupationDetailSectionNavItem = {
  id: string;
  label: string;
};

type OccupationDetailSectionNavProps = {
  sections: OccupationDetailSectionNavItem[];
  variant?: "desktop" | "mobile";
  className?: string;
};

const SECTION_ROOT_MARGIN = "-120px 0px -55% 0px";

export function OccupationDetailSectionNav({
  sections,
  variant = "desktop",
  className,
}: OccupationDetailSectionNavProps) {
  const [activeSectionId, setActiveSectionId] = useState(sections[0]?.id ?? "");

  const visibleSections = useMemo(() => sections.filter((section) => section.id), [sections]);

  useEffect(() => {
    if (visibleSections.length === 0) {
      return;
    }

    const updateFromHash = () => {
      const hash = window.location.hash.replace(/^#/, "");

      if (hash && visibleSections.some((section) => section.id === hash)) {
        setActiveSectionId(hash);
      }
    };

    updateFromHash();

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((entryA, entryB) => entryB.intersectionRatio - entryA.intersectionRatio);

        const nextActiveId = visibleEntries[0]?.target.id;

        if (nextActiveId) {
          setActiveSectionId(nextActiveId);
        }
      },
      {
        rootMargin: SECTION_ROOT_MARGIN,
        threshold: [0.15, 0.35, 0.6],
      },
    );

    visibleSections.forEach((section) => {
      const element = document.getElementById(section.id);

      if (element) {
        observer.observe(element);
      }
    });

    window.addEventListener("hashchange", updateFromHash);

    return () => {
      observer.disconnect();
      window.removeEventListener("hashchange", updateFromHash);
    };
  }, [visibleSections]);

  if (visibleSections.length <= 1) {
    return null;
  }

  if (variant === "mobile") {
    return (
      <nav
        aria-label="Seksjoner på siden"
        className={[
          "rounded-[5px] border border-black/10 px-3 py-3 shadow-[0_10px_26px_rgba(27,36,48,0.05)]",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
          På denne siden
        </p>
        <div className="-mx-1 mt-2.5 overflow-x-auto pb-1">
          <div className="flex min-w-max gap-2 px-1">
            {visibleSections.map((section) => {
              const active = section.id === activeSectionId;

              return (
                <a
                  key={section.id}
                  aria-current={active ? "location" : undefined}
                  className={[
                    "inline-flex items-center rounded-[5px] border px-2.5 py-1.5 text-[13px] font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2",
                    active
                      ? "border-[var(--primary)] bg-[var(--primary)] text-white"
                      : "border-black/10 bg-white text-slate-700 hover:border-[var(--primary)] hover:text-[var(--primary-strong)]",
                  ].join(" ")}
                  href={`#${section.id}`}
                  onClick={() => setActiveSectionId(section.id)}
                >
                  {section.label}
                </a>
              );
            })}
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav
      aria-label="Seksjoner på siden"
      className={[
        "rounded-[5px] border border-black/10 p-2.5 shadow-[0_10px_24px_rgba(27,36,48,0.04)] backdrop-blur-sm",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <p className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
        På denne siden
      </p>
      <div className="space-y-0.5">
        {visibleSections.map((section) => {
          const active = section.id === activeSectionId;

          return (
            <a
              key={section.id}
              aria-current={active ? "location" : undefined}
              className={[
                "flex items-center rounded-[5px] px-2.5 py-2 text-[13px] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2",
                active
                  ? "bg-[rgba(20,83,45,0.1)] font-semibold text-[var(--primary-strong)]"
                  : "text-slate-700 hover:bg-white/80 hover:text-slate-950",
              ].join(" ")}
              href={`#${section.id}`}
              onClick={() => setActiveSectionId(section.id)}
            >
              {section.label}
            </a>
          );
        })}
      </div>
    </nav>
  );
}
