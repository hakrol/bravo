"use client";

import { useId, useState } from "react";
import { MetricInfoButton } from "@/components/metric-info-button";
import { formatOccupationDisplayLabel } from "@/lib/occupation-detail-pages";

type OccupationSalaryEstimateProps = {
  occupationLabel: string;
  monthlySalary?: number;
  monthlySalaryWomen?: number;
  monthlySalaryMen?: number;
  contractedMonthlySalary?: number;
  contractedMonthlySalaryWomen?: number;
  contractedMonthlySalaryMen?: number;
  embedded?: boolean;
};

const HOURS_PER_WEEK = 37.5;
const HOURS_PER_YEAR = 1950;
const POSITION_PERCENTAGE = 100;
const ESTIMATED_TAX_RATE = 30;
const HOLIDAY_PAY_RATE = 12;
const VACATION_WEEKS = 5;
const WORK_DAYS_PER_YEAR = 260;
const VACATION_DAYS = VACATION_WEEKS * 5;

type SalaryEstimateMode = "total" | "contracted";

export function OccupationSalaryEstimate({
  occupationLabel,
  monthlySalary,
  monthlySalaryWomen,
  monthlySalaryMen,
  contractedMonthlySalary,
  contractedMonthlySalaryWomen,
  contractedMonthlySalaryMen,
  embedded = false,
}: OccupationSalaryEstimateProps) {
  const [salaryMode, setSalaryMode] = useState<SalaryEstimateMode>("total");
  const hasTotalSalary =
    monthlySalary !== undefined || monthlySalaryWomen !== undefined || monthlySalaryMen !== undefined;
  const hasContractedSalary =
    contractedMonthlySalary !== undefined ||
    contractedMonthlySalaryWomen !== undefined ||
    contractedMonthlySalaryMen !== undefined;
  const activeMode =
    (salaryMode === "contracted" && hasContractedSalary) || (!hasTotalSalary && hasContractedSalary)
      ? "contracted"
      : "total";
  const activeMonthlySalary =
    activeMode === "contracted" ? contractedMonthlySalary : monthlySalary;
  const activeMonthlySalaryWomen =
    activeMode === "contracted" ? contractedMonthlySalaryWomen : monthlySalaryWomen;
  const activeMonthlySalaryMen =
    activeMode === "contracted" ? contractedMonthlySalaryMen : monthlySalaryMen;
  const activeSalaryLabel =
    activeMode === "contracted" ? "avtalt månedslønn" : "samlet median månedslønn";
  const activeSalaryRowLabel =
    activeMode === "contracted" ? "Avtalt månedslønn" : "Samlet månedslønn";

  if (!hasTotalSalary && !hasContractedSalary) {
    return null;
  }

  const formattedOccupationTitle = formatOccupationDisplayLabel(occupationLabel).toLowerCase();
  const totalEstimate = activeMonthlySalary !== undefined ? buildEstimate(activeMonthlySalary) : undefined;
  const womenEstimate =
    activeMonthlySalaryWomen !== undefined ? buildEstimate(activeMonthlySalaryWomen) : undefined;
  const menEstimate = activeMonthlySalaryMen !== undefined ? buildEstimate(activeMonthlySalaryMen) : undefined;
  const shouldShowTotalEstimate =
    totalEstimate !== undefined && (womenEstimate === undefined || menEstimate === undefined);

  const estimateGroups = [
    { key: "neutral", title: "Alle", subject: "alle", estimate: shouldShowTotalEstimate ? totalEstimate : undefined },
    { key: "women", title: "Kvinner", subject: "kvinner", estimate: womenEstimate },
    { key: "men", title: "Menn", subject: "menn", estimate: menEstimate },
  ] as const;
  const estimateCards = (
    <div className="grid items-start gap-4 xl:grid-cols-2">
      {estimateGroups.map(({ key, title, subject, estimate }) => estimate ? (
        <div className="grid gap-4" key={key}>
          <SalarySummaryCard
            description={`${capitalizeFirst(activeSalaryLabel)} for ${subject} i yrket.`}
            estimate={estimate}
            salaryRowLabel={activeSalaryRowLabel}
            title={title}
            tone={key}
          />
          <HolidayPayCard estimate={estimate} title={`Feriepenger for ${subject}`} tone={key} />
        </div>
      ) : null)}
    </div>
  );

  if (embedded) {
    return (
      <div className="space-y-6">
        <SalaryModeToggle
          activeMode={activeMode}
          hasContractedSalary={hasContractedSalary}
          onChange={setSalaryMode}
        />

        <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs leading-6 text-slate-600">
          <span>{formatDecimal(HOURS_PER_WEEK)} t/uke i 100 % stilling</span>
          <span>{HOURS_PER_YEAR.toLocaleString("nb-NO")} t/år</span>
          <span>{POSITION_PERCENTAGE} % stilling</span>
          <span>{ESTIMATED_TAX_RATE} % estimert skatt</span>
          <span>{HOLIDAY_PAY_RATE} % feriepengesats</span>
          <span>{VACATION_WEEKS} uker ferie</span>
        </div>

        {estimateCards}
      </div>
    );
  }

  return (
    <section className="rounded-md border border-black/10 bg-white/75 px-6 py-6 shadow-[0_12px_40px_rgba(27,36,48,0.06)] sm:px-8">
      <div className="space-y-6">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--primary-strong)]">
            Lønnsestimat
          </p>
          <h2 className="text-2xl font-semibold tracking-[-0.03em] text-slate-950">
            Hva er lønnen til {formattedOccupationTitle}?
          </h2>
          <p className="max-w-3xl text-sm leading-7 text-slate-700">
            Vi har gjort et forenklet estimat basert på valgt lønnsmål, vanlig heltidsstilling,
            standard feriepengesats og et fast skatteanslag.
          </p>
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs leading-6 text-slate-600">
            <span>{formatDecimal(HOURS_PER_WEEK)} t/uke i 100 % stilling</span>
            <span>{HOURS_PER_YEAR.toLocaleString("nb-NO")} t/år</span>
            <span>{POSITION_PERCENTAGE} % stilling</span>
            <span>{ESTIMATED_TAX_RATE} % estimert skatt</span>
            <span>{HOLIDAY_PAY_RATE} % feriepengesats</span>
            <span>{VACATION_WEEKS} uker ferie</span>
          </div>
          <SalaryModeToggle
            activeMode={activeMode}
            hasContractedSalary={hasContractedSalary}
            onChange={setSalaryMode}
          />
        </div>

        {estimateCards}
      </div>
    </section>
  );
}

type SalaryEstimate = ReturnType<typeof buildEstimate>;

type SalaryModeToggleProps = {
  activeMode: SalaryEstimateMode;
  hasContractedSalary: boolean;
  onChange: (mode: SalaryEstimateMode) => void;
};

function SalaryModeToggle({ activeMode, hasContractedSalary, onChange }: SalaryModeToggleProps) {
  const options: Array<{
    key: SalaryEstimateMode;
    label: string;
    disabled?: boolean;
  }> = [
    {
      key: "total",
      label: "Samlet median månedslønn",
    },
    {
      key: "contracted",
      label: "Avtalt median månedslønn",
      disabled: !hasContractedSalary,
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Velg lønnsmål for estimatet">
        {options.map((option) => {
          const isActive = option.key === activeMode;
          const buttonClassName = `rounded-[5px] border px-2.5 py-1.5 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 ${
            option.disabled
              ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
              : isActive
                ? "cursor-pointer border-slate-900 bg-slate-900 text-white"
                : "cursor-pointer border-slate-300 bg-white text-slate-700 hover:border-slate-500 hover:text-slate-950"
          }`;

          return (
            <button
              key={option.key}
              aria-pressed={isActive}
              className={buttonClassName}
              disabled={option.disabled}
              onClick={() => onChange(option.key)}
              type="button"
            >
              {option.label}
            </button>
          );
        })}
      </div>
      <div className="space-y-1 text-sm leading-6 text-slate-600">
        <p>
          <span className="font-semibold text-slate-800">Samlet månedslønn:</span>{" "}
          Inkludert bonus og uregelmessige tillegg, uten overtid.
        </p>
        <p>
          <span className="font-semibold text-slate-800">Avtalt månedslønn:</span>{" "}
          Fast avtalt lønn, uten bonus, uregelmessige tillegg og overtid.
        </p>
      </div>
    </div>
  );
}

type SalarySummaryCardProps = {
  tone?: "women" | "men" | "neutral";
  title: string;
  description: string;
  estimate: SalaryEstimate;
  salaryRowLabel: string;
};

const estimateCardColors = {
  women: { card: "border-pink-200 bg-pink-50/50", heading: "border-pink-200 text-pink-900" },
  men: { card: "border-sky-200 bg-sky-50/50", heading: "border-sky-200 text-blue-900" },
  neutral: { card: "border-slate-200 bg-slate-50/50", heading: "border-slate-200 text-slate-900" },
};

function SalarySummaryCard({ title, description, estimate, salaryRowLabel, tone = "neutral" }: SalarySummaryCardProps) {
  const colors = estimateCardColors[tone];
  return (
    <div className={`overflow-hidden rounded-[6px] border px-4 py-4 sm:px-5 sm:py-5 ${colors.card}`}>
      <div className="space-y-4">
        <div className={`space-y-1 border-b pb-4 ${colors.heading}`}>
          <p className="flex items-center gap-3 text-sm font-bold uppercase tracking-[0.16em]">
            {tone === "women" ? (
              <span
                aria-hidden="true"
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-pink-50 text-2xl font-normal tracking-normal text-pink-600 shadow-[0_8px_20px_rgba(236,72,153,0.14)]"
              >
                ♀
              </span>
            ) : tone === "men" ? (
              <span
                aria-hidden="true"
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sky-50 text-2xl font-normal tracking-normal text-blue-600 shadow-[0_8px_20px_rgba(37,99,235,0.14)]"
              >
                ♂
              </span>
            ) : null}
            {title}
          </p>
          <p className="text-sm leading-6 text-slate-600">{description}</p>
        </div>

        <div className="space-y-3">
          <SummaryRow label={salaryRowLabel} value={formatCurrency(estimate.monthlySalary)} strong />
          <SummaryRow label="Årslønn" value={formatCurrency(estimate.annualSalary)} />
          <SummaryRow label="Timelønn" value={formatCurrency(estimate.hourlySalary)} />
          <SummaryRow label="Daglønn (7,5 t)" value={formatCurrency(estimate.dailySalary)} />
          <SummaryRow label="Skatt per måned" value={formatCurrency(estimate.monthlyTax)} />
          <SummaryRow
            label="Netto per måned"
            value={formatCurrency(estimate.netMonthlySalary)}
            tone="positive"
            strong
          />
        </div>
      </div>
    </div>
  );
}

type HolidayPayCardProps = {
  tone?: "women" | "men" | "neutral";
  title: string;
  estimate: SalaryEstimate;
};

function HolidayPayCard({ title, estimate, tone = "neutral" }: HolidayPayCardProps) {
  return (
    <SummaryCard
      tone={tone}
      title={title}
      sections={[
        {
          eyebrow: `${HOLIDAY_PAY_RATE.toLocaleString("nb-NO")} % feriepengesats | ${VACATION_WEEKS.toLocaleString("nb-NO")} uker`,
          rows: [
            { label: "Årslønn (brutto)", value: formatCurrency(estimate.annualSalary) },
            {
              label: "Feriepengegrunnlag",
              value: formatCurrency(estimate.holidayPayBasis),
              strong: true,
            },
            {
              label: "Ferietrekk",
              value: formatCurrency(estimate.holidayDeduction),
              tone: "negative",
            },
          ],
        },
        {
          rows: [
            {
              label: "Estimerte feriepenger",
              value: formatCurrency(estimate.estimatedHolidayPay),
              tone: "positive",
              strong: true,
            },
            {
              label: "Til utbetaling i juni",
              value: formatCurrency(estimate.junePayout),
              strong: true,
              description:
                "Utbetalingen i juni er her beregnet som vanlig månedslønn pluss estimerte feriepenger minus ferietrekk.",
            },
          ],
        },
      ]}
    />
  );
}

type SummaryCardSection = {
  title?: string;
  eyebrow?: string;
  rows: Array<{
    label: string;
    value: string;
    tone?: "default" | "positive" | "negative";
    strong?: boolean;
    description?: string;
  }>;
};

type SummaryCardProps = {
  tone?: "women" | "men" | "neutral";
  title: string;
  sections: SummaryCardSection[];
  footnote?: string;
};

function SummaryCard({
  tone = "neutral",
  title,
  sections,
  footnote,
}: SummaryCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const contentId = useId();
  const colors = estimateCardColors[tone];
  return (
    <div className={`overflow-hidden rounded-[6px] border px-4 py-4 sm:px-5 sm:py-5 ${colors.card}`}>
      <button
        aria-controls={contentId}
        aria-expanded={isExpanded}
        className={`flex min-h-11 w-full cursor-pointer items-center justify-between gap-3 text-left text-sm font-bold uppercase tracking-[0.16em] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 xl:hidden ${colors.heading}`}
        onClick={() => setIsExpanded((expanded) => !expanded)}
        type="button"
      >
        {title}
        <svg
          aria-hidden="true"
          className={`h-5 w-5 shrink-0 transition-transform ${isExpanded ? "rotate-180" : ""}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      <p className={`hidden border-b pb-4 text-sm font-bold uppercase tracking-[0.16em] xl:block ${colors.heading}`}>
        {title}
      </p>
      <div
        className={`${isExpanded ? "block" : "hidden"} mt-5 space-y-5 border-t pt-4 xl:block xl:border-t-0 xl:pt-0 ${colors.heading}`}
        id={contentId}
      >
        {sections.map((section, index) => (
          <div
            key={`${title}-${index}`}
            className="space-y-3 border-b border-slate-200 pb-4 last:border-b-0 last:pb-0"
          >
            {section.title ? (
              <p className="text-base font-semibold text-slate-950">{section.title}</p>
            ) : null}
            {section.eyebrow ? (
              <p className="text-sm leading-6 text-slate-600">{section.eyebrow}</p>
            ) : null}

            <div className="space-y-3">
              {section.rows.map((row) => (
                <div
                  key={row.label}
                  className="flex items-start justify-between gap-3 text-sm leading-6 sm:gap-4"
                >
                  <div className="flex min-w-0 items-start gap-2">
                    <span className="text-slate-700">{row.label}</span>
                    {row.description ? (
                      <MetricInfoButton description={row.description} label={row.label} />
                    ) : null}
                  </div>
                  <span
                    className={[
                      "max-w-[45%] shrink-0 text-right font-semibold tabular-nums sm:max-w-none",
                      row.strong ? "text-xl" : "text-lg",
                      row.tone === "positive"
                        ? "text-emerald-700"
                        : row.tone === "negative"
                          ? "text-red-700"
                          : "text-slate-950",
                    ].join(" ")}
                  >
                    {row.tone === "negative" ? "- " : ""}
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}

        {footnote ? <p className="text-xs leading-6 text-slate-700">{footnote}</p> : null}
      </div>
    </div>
  );
}

type SummaryRowProps = {
  label: string;
  value: string;
  tone?: "default" | "positive" | "negative";
  strong?: boolean;
};

function SummaryRow({ label, value, tone = "default", strong = false }: SummaryRowProps) {
  const toneClasses =
    tone === "positive"
      ? "text-emerald-700"
      : tone === "negative"
        ? "text-red-700"
        : "text-slate-950";

  return (
    <div className="flex items-start justify-between gap-3 border-b border-slate-200 pb-3 last:border-b-0 last:pb-0 sm:gap-4">
      <span className="min-w-0 text-sm text-slate-700">{label}</span>
      <span className={`${strong ? "text-xl" : "text-lg"} max-w-[45%] shrink-0 text-right font-semibold tabular-nums sm:max-w-none ${toneClasses}`}>
        {value}
      </span>
    </div>
  );
}

function buildEstimate(monthlySalary: number) {
  const annualSalary = monthlySalary * 12;
  const hourlySalary = annualSalary / HOURS_PER_YEAR;
  const dailySalary = annualSalary / WORK_DAYS_PER_YEAR;

  const annualTax = annualSalary * (ESTIMATED_TAX_RATE / 100);
  const monthlyTax = annualTax / 12;

  const netAnnualSalary = annualSalary - annualTax;
  const netMonthlySalary = monthlySalary - monthlyTax;
  const netDailySalary = netAnnualSalary / WORK_DAYS_PER_YEAR;
  const netHourlySalary = netAnnualSalary / HOURS_PER_YEAR;

  const holidayDeduction = dailySalary * VACATION_DAYS;
  const holidayPayBasis = annualSalary - holidayDeduction;
  const estimatedHolidayPay = holidayPayBasis * (HOLIDAY_PAY_RATE / 100);
  const junePayout = monthlySalary + estimatedHolidayPay - holidayDeduction;

  return {
    monthlySalary,
    annualSalary,
    hourlySalary,
    dailySalary,
    annualTax,
    monthlyTax,
    netAnnualSalary,
    netMonthlySalary,
    netDailySalary,
    netHourlySalary,
    holidayDeduction,
    holidayPayBasis,
    estimatedHolidayPay,
    junePayout,
  };
}

function formatCurrency(value: number) {
  return `${value.toLocaleString("nb-NO", {
    maximumFractionDigits: 0,
  })} kr`;
}

function capitalizeFirst(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function formatDecimal(value: number) {
  return value.toLocaleString("nb-NO", {
    minimumFractionDigits: value % 1 === 0 ? 0 : 1,
    maximumFractionDigits: 2,
  });
}
