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
          "rounded-2xl border border-black/10 bg-white/75 px-4 py-4 shadow-[0_10px_30px_rgba(27,36,48,0.05)]",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
          På denne siden
        </p>
        <div className="-mx-1 mt-3 overflow-x-auto pb-1">
          <div className="flex min-w-max gap-2 px-1">
            {visibleSections.map((section) => {
              const active = section.id === activeSectionId;

              return (
                <a
                  key={section.id}
                  aria-current={active ? "location" : undefined}
                  className={[
                    "inline-flex items-center rounded-full border px-3 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2",
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
        "rounded-2xl border border-black/10 bg-white/55 p-3 shadow-[0_12px_30px_rgba(27,36,48,0.04)] backdrop-blur-sm",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <p className="px-2 pb-3 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
        På denne siden
      </p>
      <div className="space-y-1">
        {visibleSections.map((section) => {
          const active = section.id === activeSectionId;

          return (
            <a
              key={section.id}
              aria-current={active ? "location" : undefined}
              className={[
                "flex items-center rounded-xl px-3 py-2.5 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2",
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
