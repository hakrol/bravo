export type OccupationCardStatKey =
  | "salaryGrowth"
  | "employeeGrowth"
  | "averageAge"
  | "genderPayGap";

export type OccupationStatIcon =
  | OccupationCardStatKey
  | "salary";

export type OccupationCardStats = {
  salaryGrowthPercent?: number;
  employeeGrowthPercent?: number;
  averageAge?: number;
  genderPayGapPercent?: number;
};

export type OccupationStatMetric = {
  icon: OccupationStatIcon;
  label: string;
  value: string;
  valueClassName?: string;
};

type OccupationCardStatsRowProps = {
  className?: string;
  metrics?: OccupationCardStatKey[];
  stats?: OccupationCardStats;
  gridClassName?: string;
  withTopBorder?: boolean;
};

type OccupationStatGridProps = {
  className?: string;
  gridClassName?: string;
  metrics: OccupationStatMetric[];
  withTopBorder?: boolean;
};

const defaultMetrics: OccupationCardStatKey[] = [
  "salaryGrowth",
  "employeeGrowth",
  "averageAge",
  "genderPayGap",
];

export function OccupationCardStatsRow({
  className = "mt-5",
  gridClassName = "grid-cols-2",
  metrics = defaultMetrics,
  stats,
  withTopBorder = true,
}: OccupationCardStatsRowProps) {
  return (
    <OccupationStatGrid
      className={className}
      gridClassName={gridClassName}
      metrics={buildOccupationStatMetrics(stats).filter((metric) =>
        metrics.includes(metric.key),
      )}
      withTopBorder={withTopBorder}
    />
  );
}

export function OccupationStatGrid({
  className = "mt-5",
  gridClassName = "grid-cols-2",
  metrics,
  withTopBorder = true,
}: OccupationStatGridProps) {
  return (
    <dl
      className={[
        className,
        "grid gap-2",
        gridClassName,
        withTopBorder ? "border-t border-slate-200 pt-4" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {metrics.map((metric) => (
        <div
          className="flex min-w-0 items-center gap-2 rounded-[5px] bg-slate-50 px-3 py-2.5"
          key={metric.label}
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-slate-700 shadow-sm">
            <OccupationStatIconView icon={metric.icon} />
          </span>
          <div className="min-w-0">
            <dt className="truncate text-[0.7rem] font-medium leading-4 text-slate-500">
              {metric.label}
            </dt>
            <dd
              className={`text-sm font-semibold leading-5 sm:text-base ${
                metric.valueClassName ?? "text-slate-950"
              }`}
            >
              {metric.value}
            </dd>
          </div>
        </div>
      ))}
    </dl>
  );
}

function buildOccupationStatMetrics(stats?: OccupationCardStats) {
  return [
    {
      icon: "salaryGrowth" as const,
      key: "salaryGrowth" as const,
      label: "Lønnsvekst",
      value: formatSignedPercent(stats?.salaryGrowthPercent),
      valueClassName: getGrowthValueClassName(stats?.salaryGrowthPercent),
    },
    {
      icon: "employeeGrowth" as const,
      key: "employeeGrowth" as const,
      label: "Arbeidstakervekst",
      value: formatSignedPercent(stats?.employeeGrowthPercent),
      valueClassName: getGrowthValueClassName(stats?.employeeGrowthPercent),
    },
    {
      icon: "averageAge" as const,
      key: "averageAge" as const,
      label: "Snittalder",
      value: formatAge(stats?.averageAge),
      valueClassName: "text-slate-950",
    },
    {
      icon: "genderPayGap" as const,
      key: "genderPayGap" as const,
      label: "Lønnsforskjell",
      value: formatPercent(stats?.genderPayGapPercent),
      valueClassName: "text-slate-950",
    },
  ];
}

function OccupationStatIconView({ icon }: { icon: OccupationStatIcon }) {
  const commonProps = {
    "aria-hidden": true,
    className: "h-4 w-4",
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeWidth: 1.8,
    viewBox: "0 0 24 24",
    xmlns: "http://www.w3.org/2000/svg",
  };

  if (icon === "salaryGrowth") {
    return (
      <svg {...commonProps}>
        <path d="M4 17 10 11l4 4 6-8" />
        <path d="M15 7h5v5" />
      </svg>
    );
  }

  if (icon === "employeeGrowth") {
    return (
      <svg {...commonProps}>
        <path d="M16 19v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
        <path d="M9.5 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
      </svg>
    );
  }

  if (icon === "averageAge") {
    return (
      <svg {...commonProps}>
        <path d="M12 7v5l3 2" />
        <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    );
  }

  if (icon === "genderPayGap") {
    return (
      <svg {...commonProps}>
        <path d="M5 19 19 5" />
        <path d="M7.5 9.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
        <path d="M16.5 18.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
      </svg>
    );
  }

  return (
    <svg {...commonProps}>
      <path d="M5 12h14" />
      <path d="M7 16h10" />
      <path d="M9 8h6" />
    </svg>
  );
}

function formatSignedPercent(value?: number) {
  if (value === undefined) {
    return "–";
  }

  const prefix = value > 0 ? "+" : "";
  return `${prefix}${formatPercentValue(value)} %`;
}

function formatPercent(value?: number) {
  if (value === undefined) {
    return "–";
  }

  return `${formatPercentValue(value)} %`;
}

function formatPercentValue(value: number) {
  return value.toLocaleString("nb-NO", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
}

function formatAge(value?: number) {
  if (value === undefined) {
    return "–";
  }

  return `${value.toLocaleString("nb-NO", {
    maximumFractionDigits: 0,
  })} år`;
}

function getGrowthValueClassName(value?: number) {
  if (value === undefined || value === 0) {
    return "text-slate-950";
  }

  return value > 0 ? "text-emerald-700" : "text-red-700";
}
