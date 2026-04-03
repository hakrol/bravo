import Link from "next/link";

type RelatedOccupationSalaryComparisonItem = {
  occupationCode: string;
  occupationLabel: string;
  href: string;
  medianAll?: number;
  medianWomen?: number;
  medianMen?: number;
  growthWomen?: number;
  growthMen?: number;
  groupCode?: string;
};

type RelatedOccupationSalaryComparisonProps = {
  rows: RelatedOccupationSalaryComparisonItem[];
  referenceMedianWomen?: number;
  referenceMedianMen?: number;
};

const currencyFormatter = new Intl.NumberFormat("nb-NO", {
  maximumFractionDigits: 0,
});

export function RelatedOccupationSalaryComparison({
  rows,
  referenceMedianWomen,
  referenceMedianMen,
}: RelatedOccupationSalaryComparisonProps) {
  if (rows.length === 0) {
    return null;
  }

  return (
    <section className="rounded-md border bg-[var(--surface)] px-5 py-5 shadow-sm sm:px-6">
      <div className="space-y-2 pb-2">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--primary-strong)]">
          Relaterte yrker
        </p>
        <h2 className="text-xl font-semibold tracking-[-0.03em] text-slate-950">
          Månedslønn sammenlignet med relaterte yrker
        </h2>
      </div>

      <div className="mt-4 overflow-x-auto pb-1">
        <div className="flex gap-4">
        {rows.map((row) => (
          <article
            key={row.occupationCode}
            className="min-w-[280px] max-w-[320px] flex-1 rounded-2xl border border-black/8 bg-white p-3 shadow-[0_8px_24px_rgba(15,23,42,0.06)]"
          >
            <div className={`rounded-xl px-3.5 py-3.5 ${getCardToneClassName(row.groupCode)}`}>
              <div className="flex min-w-0 items-start justify-between gap-3">
                <Link
                  className="group flex min-w-0 flex-1 items-start gap-2 font-semibold text-slate-900 transition hover:text-[var(--primary)]"
                  href={row.href}
                >
                  <span className="min-w-0 line-clamp-2">{row.occupationLabel}</span>
                  <span
                    aria-hidden="true"
                    className="mt-[1px] shrink-0 text-base text-slate-700 transition-transform group-hover:translate-x-0.5"
                  >
                    &gt;
                  </span>
                </Link>
                <span
                  aria-hidden="true"
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-black/10 bg-white/75 text-slate-700"
                >
                  <OccupationGroupIcon groupCode={row.groupCode} />
                </span>
              </div>
            </div>

            <dl className="mt-3 grid grid-cols-2 gap-2 text-sm">
              <div className="rounded-lg border border-black/8 bg-white px-3 py-2">
                <dt className="text-[var(--muted)]">Månedslønn ♀</dt>
                <dd className="mt-1 text-base font-semibold text-slate-950">{formatSalary(row.medianWomen)}</dd>
                <DifferenceText
                  referenceValue={referenceMedianWomen}
                  value={row.medianWomen}
                />
              </div>
              <div className="rounded-lg border border-black/8 bg-white px-3 py-2">
                <dt className="text-[var(--muted)]">Månedslønn ♂</dt>
                <dd className="mt-1 text-base font-semibold text-slate-950">{formatSalary(row.medianMen)}</dd>
                <DifferenceText
                  referenceValue={referenceMedianMen}
                  value={row.medianMen}
                />
              </div>
              <div className="rounded-lg border border-black/8 bg-white px-3 py-2">
                <dt className="text-[var(--muted)]">Lønnsvekst ♀</dt>
                <dd className={`mt-1 text-base font-semibold ${getGrowthToneClassName(row.growthWomen)}`}>
                  {formatGrowth(row.growthWomen)}
                </dd>
              </div>
              <div className="rounded-lg border border-black/8 bg-white px-3 py-2">
                <dt className="text-[var(--muted)]">Lønnsvekst ♂</dt>
                <dd className={`mt-1 text-base font-semibold ${getGrowthToneClassName(row.growthMen)}`}>
                  {formatGrowth(row.growthMen)}
                </dd>
              </div>
            </dl>
          </article>
        ))}
        </div>
      </div>
    </section>
  );
}

function formatSalary(value?: number) {
  if (value === undefined) {
    return ":";
  }

  return `${currencyFormatter.format(value)} kr`;
}

function getMedianDifferenceDisplay(value?: number, referenceValue?: number) {
  if (value === undefined || referenceValue === undefined) {
    return {
      arrow: "•",
      className: "text-slate-600",
      label: ":",
    };
  }

  const difference = value - referenceValue;

  if (difference === 0) {
    return {
      arrow: "→",
      className: "text-slate-600",
      label: "0 kr",
    };
  }

  const differenceLabel = `${currencyFormatter.format(Math.abs(difference))} kr`;

  if (difference > 0) {
    return {
      arrow: "↑",
      className: "text-emerald-700",
      label: differenceLabel,
    };
  }

  return {
    arrow: "↓",
    className: "text-red-700",
    label: differenceLabel,
  };
}

function DifferenceText({
  value,
  referenceValue,
}: {
  value?: number;
  referenceValue?: number;
}) {
  const difference = getMedianDifferenceDisplay(value, referenceValue);

  return (
    <p className={`mt-1 text-xs font-medium ${difference.className}`}>
      <span aria-hidden="true" className="mr-1">
        {difference.arrow}
      </span>
      {difference.label}
    </p>
  );
}

function formatGrowth(value?: number) {
  if (value === undefined) {
    return ":";
  }

  const prefix = value > 0 ? "+" : "";
  return `${prefix}${value.toLocaleString("nb-NO", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })} %`;
}

function getGrowthToneClassName(value?: number) {
  if (value === undefined || value === 0) {
    return "text-slate-700";
  }

  return value > 0 ? "text-emerald-700" : "text-red-700";
}

function OccupationGroupIcon({ groupCode }: { groupCode?: string }) {
  const commonProps = {
    className: "h-5 w-5",
    fill: "none",
    viewBox: "0 0 24 24",
    xmlns: "http://www.w3.org/2000/svg",
  } as const;

  switch (groupCode) {
    case "1":
      return (
        <svg {...commonProps}>
          <path d="M6 18h12M8 15V9m4 6V6m4 9v-3" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
        </svg>
      );
    case "2":
      return (
        <svg {...commonProps}>
          <path d="M4 9 12 5l8 4-8 4-8-4Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.8" />
          <path d="M7 12v3.5c0 1 2.2 2.5 5 2.5s5-1.5 5-2.5V12" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
        </svg>
      );
    case "4":
      return (
        <svg {...commonProps}>
          <rect x="5" y="6" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="1.8" />
          <path d="M5 10h14" stroke="currentColor" strokeWidth="1.8" />
        </svg>
      );
    case "5":
      return (
        <svg {...commonProps}>
          <path d="M7 7h10l-1 4H8L7 7Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.8" />
          <circle cx="9" cy="16.5" r="1.5" fill="currentColor" />
          <circle cx="15" cy="16.5" r="1.5" fill="currentColor" />
        </svg>
      );
    case "6":
      return (
        <svg {...commonProps}>
          <path d="M12 19V8m0 0-3 3m3-3 3 3" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
          <path d="M6 19h12" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
        </svg>
      );
    case "7":
      return (
        <svg {...commonProps}>
          <path d="m6 14 8-8 4 4-8 8H6v-4Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.8" />
        </svg>
      );
    case "8":
      return (
        <svg {...commonProps}>
          <rect x="4" y="9" width="13" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
          <path d="M17 11h2l1 2v2h-3" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
          <circle cx="8" cy="16.5" r="1.5" fill="currentColor" />
          <circle cx="17" cy="16.5" r="1.5" fill="currentColor" />
        </svg>
      );
    case "9":
      return (
        <svg {...commonProps}>
          <path d="M8 6h8M7 9h10M9 12h6M10 15h4" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
        </svg>
      );
    default:
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="12" r="7" stroke="currentColor" strokeWidth="1.8" />
          <path d="M12 9v4m0 3h.01" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
        </svg>
      );
  }
}

function getCardToneClassName(groupCode?: string) {
  switch (groupCode) {
    case "1":
      return "bg-[#edeaf7]";
    case "2":
      return "bg-[#eaf4ee]";
    case "4":
      return "bg-[#e8f1f8]";
    case "5":
      return "bg-[#f7efe7]";
    case "6":
      return "bg-[#edf4e6]";
    case "7":
      return "bg-[#e8f2ef]";
    case "8":
      return "bg-[#e7f0f3]";
    case "9":
      return "bg-[#eef1f4]";
    default:
      return "bg-[#edf0f2]";
  }
}
