"use client";

import { useState } from "react";
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
    activeMode === "contracted" ? "Avtalt månedslønn" : "Median samlet månedslønn";

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

  if (embedded) {
    return (
      <div className="space-y-6">
        <SalaryModeToggle
          activeMode={activeMode}
          hasContractedSalary={hasContractedSalary}
          onChange={setSalaryMode}
        />

        <div className="flex flex-wrap gap-2 text-xs leading-6 text-slate-600">
          <span>{formatDecimal(HOURS_PER_WEEK)} t/uke i 100 % stilling</span>
          <span>{HOURS_PER_YEAR.toLocaleString("nb-NO")} t/år</span>
          <span>{POSITION_PERCENTAGE} % stilling</span>
          <span>{ESTIMATED_TAX_RATE} % estimert skatt</span>
          <span>{HOLIDAY_PAY_RATE} % feriepengesats</span>
          <span>{VACATION_WEEKS} uker ferie</span>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {shouldShowTotalEstimate && totalEstimate ? (
            <SalarySummaryCard
              description={`${capitalizeFirst(activeSalaryLabel)} for alle i yrket.`}
              estimate={totalEstimate}
              salaryRowLabel={activeSalaryRowLabel}
              title="Alle"
            />
          ) : null}
          {womenEstimate ? (
            <SalarySummaryCard
              description={`${capitalizeFirst(activeSalaryLabel)} for kvinner i yrket.`}
              estimate={womenEstimate}
              salaryRowLabel={activeSalaryRowLabel}
              title="Kvinner"
            />
          ) : null}
          {menEstimate ? (
            <SalarySummaryCard
              description={`${capitalizeFirst(activeSalaryLabel)} for menn i yrket.`}
              estimate={menEstimate}
              salaryRowLabel={activeSalaryRowLabel}
              title="Menn"
            />
          ) : null}
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {shouldShowTotalEstimate && totalEstimate ? (
            <HolidayPayCard
              estimate={totalEstimate}
              title="Feriepenger for alle"
            />
          ) : null}
          {womenEstimate ? (
            <HolidayPayCard
              estimate={womenEstimate}
              title="Feriepenger for kvinner"
            />
          ) : null}
          {menEstimate ? (
            <HolidayPayCard
              estimate={menEstimate}
              title="Feriepenger for menn"
            />
          ) : null}
        </div>
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

        <div className="grid gap-4 lg:grid-cols-2">
          {shouldShowTotalEstimate && totalEstimate ? (
            <SalarySummaryCard
              description={`${capitalizeFirst(activeSalaryLabel)} for alle i yrket.`}
              estimate={totalEstimate}
              salaryRowLabel={activeSalaryRowLabel}
              title="Alle"
            />
          ) : null}
          {womenEstimate ? (
            <SalarySummaryCard
              description={`${capitalizeFirst(activeSalaryLabel)} for kvinner i yrket.`}
              estimate={womenEstimate}
              salaryRowLabel={activeSalaryRowLabel}
              title="Kvinner"
            />
          ) : null}
          {menEstimate ? (
            <SalarySummaryCard
              description={`${capitalizeFirst(activeSalaryLabel)} for menn i yrket.`}
              estimate={menEstimate}
              salaryRowLabel={activeSalaryRowLabel}
              title="Menn"
            />
          ) : null}
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {shouldShowTotalEstimate && totalEstimate ? (
            <HolidayPayCard
              estimate={totalEstimate}
              title="Feriepenger for alle"
            />
          ) : null}
          {womenEstimate ? (
            <HolidayPayCard
              estimate={womenEstimate}
              title="Feriepenger for kvinner"
            />
          ) : null}
          {menEstimate ? (
            <HolidayPayCard
              estimate={menEstimate}
              title="Feriepenger for menn"
            />
          ) : null}
        </div>
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
    description: string;
    disabled?: boolean;
  }> = [
    {
      key: "total",
      label: "Samlet median månedslønn",
      description:
        "Samlet median månedslønn inkluderer avtalt månedslønn, bonus og uregelmessige tillegg. Overtid er ikke med.",
    },
    {
      key: "contracted",
      label: "Avtalt median månedslønn",
      description:
        "Avtalt median månedslønn er den faste lønnen som er avtalt for jobben, uten bonus, uregelmessige tillegg og overtid.",
      disabled: !hasContractedSalary,
    },
  ];

  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Velg lønnsmål for estimatet">
      {options.map((option) => {
        const isActive = option.key === activeMode;
        const wrapperClassName = `inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition ${
          option.disabled
            ? "border-slate-200 bg-slate-100 text-slate-400"
            : isActive
              ? "border-emerald-900 bg-emerald-900 text-white shadow-[0_10px_24px_rgba(6,78,59,0.18)]"
              : "border-slate-200 bg-white text-slate-700 hover:border-slate-950/30"
        }`;

        return (
          <span
            className={wrapperClassName}
            key={option.key}
          >
            <button
              className={option.disabled ? "cursor-not-allowed" : "cursor-pointer"}
              disabled={option.disabled}
              onClick={() => onChange(option.key)}
              type="button"
            >
              {option.label}
            </button>
            <MetricInfoButton
              description={option.description}
              label={option.label}
              variant="muted"
            />
          </span>
        );
      })}
    </div>
  );
}

type SalarySummaryCardProps = {
  title: string;
  description: string;
  estimate: SalaryEstimate;
  salaryRowLabel: string;
};

function SalarySummaryCard({ title, description, estimate, salaryRowLabel }: SalarySummaryCardProps) {
  return (
    <div className="rounded-[5px] border border-slate-200 bg-slate-50 px-4 py-4 sm:px-5 sm:py-5">
      <div className="space-y-4">
        <div className="space-y-1">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-slate-950">
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
  title: string;
  estimate: SalaryEstimate;
};

function HolidayPayCard({ title, estimate }: HolidayPayCardProps) {
  return (
    <SummaryCard
      accent="warm"
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
  title: string;
  sections: SummaryCardSection[];
  accent?: "default" | "warm";
  footnote?: string;
};

function SummaryCard({
  title,
  sections,
  accent = "default",
  footnote,
}: SummaryCardProps) {
  const accentClasses =
    accent === "warm"
      ? "border-amber-200 bg-amber-50"
      : "border-slate-200 bg-slate-50";

  return (
    <div className={`rounded-[5px] border px-4 py-4 sm:px-5 sm:py-5 ${accentClasses}`}>
      <div className="space-y-5">
        <p className="text-sm font-semibold text-slate-900">{title}</p>

        {sections.map((section, index) => (
          <div
            key={`${title}-${index}`}
            className="space-y-3 border-b border-black/10 pb-4 last:border-b-0 last:pb-0"
          >
            {section.title ? (
              <p className="text-base font-semibold text-slate-950">{section.title}</p>
            ) : null}
            {section.eyebrow ? (
              <p className="text-sm font-medium text-[#946200]">{section.eyebrow}</p>
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
                      "max-w-[45%] shrink-0 text-right font-semibold sm:max-w-none",
                      row.strong ? "text-base" : "text-sm",
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
    <div className="flex items-start justify-between gap-3 border-b border-black/8 pb-3 last:border-b-0 last:pb-0 sm:gap-4">
      <span className="min-w-0 text-sm text-slate-700">{label}</span>
      <span className={`${strong ? "text-base" : "text-sm"} max-w-[45%] shrink-0 text-right font-semibold sm:max-w-none ${toneClasses}`}>
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
