"use client";

import { useState } from "react";

type SalaryView = "annual" | "monthly" | "hourly";

type BlogGenderSalaryCardsProps = {
  occupationLabel: string;
  period: string;
  source: string;
  womenMonthlyMedian: number | string;
  menMonthlyMedian: number | string;
  monthlyHours?: number | string;
};

const salaryViews: { id: SalaryView; label: string }[] = [
  { id: "annual", label: "Årslønn" },
  { id: "monthly", label: "Månedslønn" },
  { id: "hourly", label: "Timelønn" },
];

export function BlogGenderSalaryCards({
  occupationLabel,
  period,
  source,
  womenMonthlyMedian,
  menMonthlyMedian,
  monthlyHours = 162.5,
}: BlogGenderSalaryCardsProps) {
  const [salaryView, setSalaryView] = useState<SalaryView>("monthly");
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const parsedWomenMonthlyMedian = parseSalaryNumber(womenMonthlyMedian);
  const parsedMenMonthlyMedian = parseSalaryNumber(menMonthlyMedian);
  const parsedMonthlyHours = parseSalaryNumber(monthlyHours) ?? 162.5;

  const womenValue =
    parsedWomenMonthlyMedian !== undefined
      ? calculateSalaryValue(parsedWomenMonthlyMedian, salaryView, parsedMonthlyHours)
      : undefined;
  const menValue =
    parsedMenMonthlyMedian !== undefined
      ? calculateSalaryValue(parsedMenMonthlyMedian, salaryView, parsedMonthlyHours)
      : undefined;
  return (
    <section className="my-10 rounded-[5px] border border-black/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(247,249,251,0.96))] p-5 shadow-[0_22px_70px_rgba(15,23,42,0.07)] sm:p-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="min-w-0">
          <h3 className="text-2xl font-semibold tracking-[-0.03em] text-slate-950 sm:text-3xl">
            Lønn {occupationLabel.toLowerCase()}
          </h3>
        </div>

        <div className="flex max-w-full items-center gap-2 overflow-x-auto xl:shrink-0">
          <div className="grid w-max grid-cols-3 rounded-[5px] bg-slate-100 p-1" aria-label="Velg lønnsvisning">
            {salaryViews.map((view) => (
              <button
                aria-pressed={salaryView === view.id}
                className={`h-9 w-[6.5rem] whitespace-nowrap rounded-[5px] px-3 text-xs font-semibold transition ${
                  salaryView === view.id
                    ? "bg-white text-slate-950 shadow-[0_6px_18px_rgba(15,23,42,0.08)]"
                    : "text-slate-600 hover:bg-white/70 hover:text-slate-950"
                }`}
                key={view.id}
                onClick={() => setSalaryView(view.id)}
                type="button"
              >
                {view.label}
              </button>
            ))}
          </div>
          <button
            aria-label="Vis forklaring av lønnsberegning"
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[5px] border border-black/8 bg-white text-sm font-semibold text-[var(--primary-strong)] shadow-[0_8px_22px_rgba(15,23,42,0.05)] transition hover:bg-slate-50"
            onClick={() => setIsInfoOpen(true)}
            type="button"
          >
            i
          </button>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        <GenderSalaryCard
          gender="Kvinner"
          value={womenValue}
        />
        <GenderSalaryCard
          gender="Menn"
          value={menValue}
        />
      </div>

      <div className="mt-4 flex flex-col gap-1 rounded-[5px] bg-slate-50 px-4 py-3 text-xs leading-5 text-slate-600 sm:flex-row sm:items-center sm:justify-between">
        <span>
          <strong className="font-semibold text-slate-800">Kilde:</strong> {source}
        </span>
        <span>Periode: {period}</span>
      </div>

      {isInfoOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 px-4"
          onClick={() => setIsInfoOpen(false)}
        >
          <div
            aria-modal="true"
            className="w-full max-w-md rounded-[5px] border border-black/8 bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.18)]"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold tracking-[-0.03em] text-slate-950">
                  Slik er tallene beregnet
                </h3>
              </div>
              <button
                aria-label="Lukk forklaring"
                className="inline-flex h-9 w-9 items-center justify-center rounded-[5px] border border-[var(--border)] text-lg text-slate-600 transition hover:bg-slate-50"
                onClick={() => setIsInfoOpen(false)}
                type="button"
              >
                ×
              </button>
            </div>

            <p className="mt-5 text-sm leading-7 text-slate-700">
              Tallene viser median månedslønn for kvinner og menn i SSBs yrkesgruppe for {occupationLabel.toLowerCase()}.
              Årslønn er beregnet som månedslønn ganger 12. Timelønn er beregnet ved å dele månedslønnen på{" "}
              {formatDecimal(parsedMonthlyHours)} timer per måned. Timelønn er derfor et estimat, ikke et eget SSB-tall.
            </p>
          </div>
        </div>
      ) : null}
    </section>
  );
}

type GenderSalaryCardProps = {
  gender: string;
  value?: number;
};

function GenderSalaryCard({ gender, value }: GenderSalaryCardProps) {
  const tone = gender === "Kvinner" ? "women" : "men";

  return (
    <article className="border-t border-black/8 px-1 py-5 first:border-t-0 md:border-l md:border-t-0 md:py-4 md:pl-6 md:first:border-l-0 md:first:pl-1">
      <div className="flex items-center gap-2 text-lg font-semibold text-slate-950">
        <MetricAvatar tone={tone} />
        <span>{gender}</span>
      </div>
      <div
        className={`mt-6 break-words font-extrabold text-slate-950 ${
          value !== undefined
            ? "text-6xl leading-none tracking-[-0.04em] sm:text-[4rem]"
            : "max-w-[13rem] text-3xl leading-tight tracking-[-0.02em] sm:text-4xl"
        }`}
      >
        {value !== undefined ? formatCurrency(value) : "Ikke tilgjengelig"}
      </div>
    </article>
  );
}

function MetricAvatar({ tone }: { tone: "women" | "men" }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-flex h-5 w-5 items-center justify-center text-sm font-semibold ${
        tone === "women" ? "text-pink-500" : "text-sky-600"
      }`}
    >
      {tone === "women" ? "♀" : "♂"}
    </span>
  );
}

function calculateSalaryValue(monthlyMedian: number, salaryView: SalaryView, monthlyHours: number) {
  if (salaryView === "annual") {
    return monthlyMedian * 12;
  }

  if (salaryView === "hourly") {
    return monthlyMedian / monthlyHours;
  }

  return monthlyMedian;
}

function formatCurrency(value: number) {
  return `${Math.round(value).toLocaleString("nb-NO")} kr`;
}

function parseSalaryNumber(value: number | string | undefined) {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : undefined;
  }

  if (typeof value !== "string") {
    return undefined;
  }

  const parsedValue = Number(value.replace(/\s/g, "").replace(",", "."));

  return Number.isFinite(parsedValue) ? parsedValue : undefined;
}

function formatDecimal(value: number) {
  return value.toLocaleString("nb-NO", {
    maximumFractionDigits: 1,
    minimumFractionDigits: Number.isInteger(value) ? 0 : 1,
  });
}
