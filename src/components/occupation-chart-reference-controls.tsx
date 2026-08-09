"use client";

import { MetricInfoButton } from "@/components/metric-info-button";

export type OccupationChartTone = "neutral" | "women" | "men";

type LatestItem = {
  key: string;
  label: string;
  tone: OccupationChartTone;
  value: string;
};

type FilterItem = {
  available: boolean;
  key: string;
  label: string;
  tone: OccupationChartTone;
};

type LegendItem = {
  color: string;
  key: string;
  label: string;
};

export type OccupationChartDevelopmentItem = {
  key: string;
  label: string;
  period: string;
  tone: OccupationChartTone;
  value: string;
  valueTone: "positive" | "negative" | "neutral";
};

export type OccupationChartDevelopmentGroup = {
  items: OccupationChartDevelopmentItem[];
  key: string;
  label: string;
};

export function OccupationChartReferenceControls({
  activeFilter,
  filters,
  latestDataDescription,
  latestItems,
  legends,
  onFilterChange,
  periodLabel,
}: {
  activeFilter: string;
  filters: FilterItem[];
  latestDataDescription: string;
  latestItems: LatestItem[];
  legends: LegendItem[];
  onFilterChange: (key: string) => void;
  periodLabel?: string;
}) {
  return (
    <div className="space-y-5">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
            Siste data
          </p>
          <MetricInfoButton
            description={latestDataDescription}
            label="Siste data"
            variant="muted"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          {periodLabel ? (
            <div className="inline-flex min-h-11 items-center gap-2 rounded-[7px] border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 shadow-[0_4px_14px_rgba(15,23,42,0.04)]">
              <ChartControlIcon icon="calendar" />
              <span>{periodLabel}</span>
            </div>
          ) : null}

          {latestItems.map((item) => (
            <div
              className="inline-flex min-h-11 items-center rounded-[7px] border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 shadow-[0_4px_14px_rgba(15,23,42,0.04)] sm:text-base"
              key={item.key}
            >
              <span>{item.label}:&nbsp;</span>
              <strong className={getValueClasses(item.tone)}>{item.value}</strong>
            </div>
          ))}
        </div>
      </div>

      <div
        aria-label="Velg hvilke tall grafen skal vise"
        className="inline-grid max-w-full grid-cols-3 overflow-hidden rounded-[9px] border border-slate-200 bg-white shadow-[0_4px_14px_rgba(15,23,42,0.04)]"
        role="group"
      >
        {filters.map((filter) => {
          const isActive = filter.key === activeFilter;

          return (
            <button
              aria-label={filter.label}
              aria-pressed={isActive}
              className={`inline-flex min-w-0 items-center justify-center gap-2 border-r border-slate-200 px-3 py-3 text-sm font-medium transition last:border-r-0 sm:min-w-32 sm:px-5 sm:text-base ${
                !filter.available
                  ? "cursor-not-allowed bg-slate-100 text-slate-400"
                  : isActive
                    ? "bg-[#06245f] text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]"
                    : "bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-950"
              }`}
              disabled={!filter.available}
              key={filter.key}
              onClick={() => onFilterChange(filter.key)}
              type="button"
            >
              <span className={getFilterIconClasses(filter.tone, isActive)}>
                <ChartControlIcon icon={getFilterIcon(filter.tone)} />
              </span>
              {filter.label === "Begge kjønn" ? (
                <>
                  <span className="sm:hidden">Begge</span>
                  <span className="hidden sm:inline">{filter.label}</span>
                </>
              ) : (
                <span className="truncate">{filter.label}</span>
              )}
            </button>
          );
        })}
      </div>

      {legends.length > 0 ? (
        <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-700 sm:text-base">
          {legends.map((legend) => (
            <div className="flex items-center gap-2.5" key={legend.key}>
              <span
                aria-hidden="true"
                className="h-3.5 w-3.5 rounded-full"
                style={{ backgroundColor: legend.color }}
              />
              <span>{legend.label}</span>
            </div>
          ))}
        </div>
      ) : null}

    </div>
  );
}

export function OccupationChartDevelopmentCards({
  groups,
}: {
  groups: OccupationChartDevelopmentGroup[];
}) {
  if (groups.length === 0) {
    return null;
  }

  return (
    <div className="mt-6 space-y-5">
      {groups.map((group) => (
        <section key={group.key}>
          <h4 className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
            {group.label}
          </h4>
          <div className="mt-2 grid grid-cols-2 gap-3">
            {group.items.map((item) => (
              <div
                aria-label={`${item.label}: ${item.value} i perioden ${item.period}`}
                className={`flex min-w-0 items-center gap-1.5 rounded-[10px] border px-2.5 py-3 text-[10px] sm:gap-2 sm:px-3 sm:text-xs lg:px-4 ${getGrowthCardClasses(item.tone)}`}
                key={item.key}
              >
                <ChartControlIcon icon="trend" />
                <span className="min-w-0 whitespace-nowrap text-slate-700">
                  {item.label}:&nbsp;
                  <strong
                    className="font-bold"
                    style={{ color: getDevelopmentValueColor(item.valueTone) }}
                  >
                    {item.value}
                  </strong>
                  <span className="hidden sm:inline"> i perioden {item.period}</span>
                </span>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function getValueClasses(tone: OccupationChartTone) {
  if (tone === "women") {
    return "font-bold text-pink-600";
  }

  if (tone === "men") {
    return "font-bold text-blue-600";
  }

  return "font-bold text-slate-950";
}

function getGrowthCardClasses(tone: OccupationChartTone) {
  if (tone === "women") {
    return "border-pink-200 bg-pink-50/70 text-pink-600";
  }

  if (tone === "men") {
    return "border-blue-200 bg-blue-50/70 text-blue-600";
  }

  return "border-slate-200 bg-slate-50 text-slate-700";
}

function getDevelopmentValueColor(tone: OccupationChartDevelopmentItem["valueTone"]) {
  if (tone === "positive") {
    return "#047857";
  }

  if (tone === "negative") {
    return "#dc2626";
  }

  return "#334155";
}

export function getOccupationChartValueTone(value: number) {
  if (value > 0) {
    return "positive" as const;
  }

  if (value < 0) {
    return "negative" as const;
  }

  return "neutral" as const;
}

function getFilterIcon(tone: OccupationChartTone) {
  if (tone === "women") {
    return "woman" as const;
  }

  if (tone === "men") {
    return "man" as const;
  }

  return "people" as const;
}

function getFilterIconClasses(tone: OccupationChartTone, isActive: boolean) {
  if (isActive) {
    return "text-white";
  }

  if (tone === "women") {
    return "text-pink-600";
  }

  if (tone === "men") {
    return "text-blue-600";
  }

  return "text-slate-600";
}

function ChartControlIcon({
  icon,
}: {
  icon: "calendar" | "people" | "woman" | "man" | "trend";
}) {
  const commonProps = {
    "aria-hidden": true,
    className: "h-5 w-5 shrink-0",
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeWidth: 1.8,
    viewBox: "0 0 24 24",
  };

  if (icon === "calendar") {
    return (
      <svg {...commonProps} className="h-5 w-5 shrink-0 text-slate-500">
        <rect height="15" rx="2" width="17" x="3.5" y="5.5" />
        <path d="M7.5 3.5v4M16.5 3.5v4M3.5 9.5h17" />
      </svg>
    );
  }

  if (icon === "people") {
    return (
      <svg {...commonProps}>
        <circle cx="9" cy="8" r="3" />
        <circle cx="17" cy="9" r="2.3" />
        <path d="M3.5 19c.5-3.3 2.4-5 5.5-5s5 1.7 5.5 5M14.5 14.5c3.2-.8 5.4.7 6 3.5" />
      </svg>
    );
  }

  if (icon === "woman") {
    return (
      <span aria-hidden="true" className="inline-flex h-5 w-5 items-center justify-center text-2xl leading-none">
        ♀
      </span>
    );
  }

  if (icon === "man") {
    return (
      <span aria-hidden="true" className="inline-flex h-5 w-5 items-center justify-center text-2xl leading-none">
        ♂
      </span>
    );
  }

  return (
    <svg {...commonProps}>
      <path d="m4 17 5-5 4 3 7-8M15 7h5v5" />
    </svg>
  );
}
