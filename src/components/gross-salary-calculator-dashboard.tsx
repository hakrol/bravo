"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { CalculatorPageVisual } from "@/components/calculator-page-visual";

type MetricTone = "default" | "gross" | "net" | "accent";
type CalculationMode = "gross-to-net" | "net-to-gross";

const WEEKS_PER_YEAR = 52;
const DAY_HOURS = 7.5;

export function GrossSalaryCalculatorDashboard() {
  const [calculationMode, setCalculationMode] = useState<CalculationMode>("gross-to-net");
  const [annualSalaryInput, setAnnualSalaryInput] = useState("");
  const [taxRateInput, setTaxRateInput] = useState("30");
  const [weeklyHoursInput, setWeeklyHoursInput] = useState("37,5");
  const [holidayRateInput, setHolidayRateInput] = useState("12");

  const annualSalary = parsePositiveNumber(annualSalaryInput);
  const taxRate = clampPercent(parsePositiveNumber(taxRateInput));
  const weeklyHours = parsePositiveNumber(weeklyHoursInput);
  const holidayRate = clampPercent(parsePositiveNumber(holidayRateInput));
  const taxFactor = taxRate !== undefined ? 1 - taxRate / 100 : undefined;
  const annualGross =
    annualSalary !== undefined
      ? calculationMode === "gross-to-net"
        ? annualSalary
        : taxFactor !== undefined && taxFactor > 0
          ? annualSalary / taxFactor
          : undefined
      : undefined;
  const netAnnualSalary =
    annualSalary !== undefined
      ? calculationMode === "net-to-gross"
        ? annualSalary
        : taxFactor !== undefined
          ? annualSalary * taxFactor
          : undefined
      : undefined;
  const annualTax = annualGross !== undefined && netAnnualSalary !== undefined ? annualGross - netAnnualSalary : undefined;
  const monthlyGross = annualGross !== undefined ? annualGross / 12 : undefined;
  const monthlyNet = netAnnualSalary !== undefined ? netAnnualSalary / 12 : undefined;
  const monthlyTax = annualTax !== undefined ? annualTax / 12 : undefined;
  const weeklyGross = annualGross !== undefined ? annualGross / WEEKS_PER_YEAR : undefined;
  const weeklyNet = netAnnualSalary !== undefined ? netAnnualSalary / WEEKS_PER_YEAR : undefined;
  const hourlyGross =
    annualGross !== undefined && weeklyHours !== undefined && weeklyHours > 0
      ? annualGross / (weeklyHours * WEEKS_PER_YEAR)
      : undefined;
  const hourlyNet =
    netAnnualSalary !== undefined && weeklyHours !== undefined && weeklyHours > 0
      ? netAnnualSalary / (weeklyHours * WEEKS_PER_YEAR)
      : undefined;
  const dailyGross = hourlyGross !== undefined ? hourlyGross * DAY_HOURS : undefined;
  const dailyNet = hourlyNet !== undefined ? hourlyNet * DAY_HOURS : undefined;
  const holidayPay =
    annualGross !== undefined && holidayRate !== undefined ? annualGross * (holidayRate / 100) : undefined;
  const calculatingNet = calculationMode === "gross-to-net";
  const primaryAnnual = calculatingNet ? netAnnualSalary : annualGross;
  const primaryMonthly = calculatingNet ? monthlyNet : monthlyGross;
  const primaryWeekly = calculatingNet ? weeklyNet : weeklyGross;
  const primaryHourly = calculatingNet ? hourlyNet : hourlyGross;
  const primaryDaily = calculatingNet ? dailyNet : dailyGross;

  return (
    <section className="fade-up grid gap-6 lg:gap-8">
      <div className="relative overflow-hidden rounded-[5px] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(247,249,251,0.96))] px-6 py-7 shadow-[0_22px_70px_rgba(15,23,42,0.07)] sm:px-8 sm:py-8 lg:px-10">
        <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(217,139,43,0.28),transparent)]" />
        <div className="relative space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <CalculatorPageVisual variant="gross-net" />
            <div className="max-w-4xl space-y-3">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--primary-strong)]">
                Verktøy
              </p>
              <h1 className="max-w-3xl text-4xl font-semibold tracking-[-0.06em] text-slate-950 sm:text-5xl lg:text-6xl">
                Brutto- og nettolønn kalkulator
              </h1>
              <p className="max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                Velg om du vil beregne nettolønn fra bruttolønn, eller bruttolønn fra nettolønn.
                Kalkulatoren bruker en enkel estimert skattesats.
              </p>
            </div>
          </div>

          <div className="grid rounded-[5px] bg-slate-50 p-1 sm:grid-cols-2">
            <button
              className={`rounded-[5px] px-4 py-3 text-sm font-semibold transition ${
                calculationMode === "gross-to-net"
                  ? "bg-white text-[#d98b2b] shadow-[0_10px_28px_rgba(15,23,42,0.08)]"
                  : "text-slate-600 hover:text-slate-950"
              }`}
              type="button"
              onClick={() => setCalculationMode("gross-to-net")}
            >
              Brutto → Netto
            </button>
            <button
              className={`rounded-[5px] px-4 py-3 text-sm font-semibold transition ${
                calculationMode === "net-to-gross"
                  ? "bg-white text-[#d98b2b] shadow-[0_10px_28px_rgba(15,23,42,0.08)]"
                  : "text-slate-600 hover:text-slate-950"
              }`}
              type="button"
              onClick={() => setCalculationMode("net-to-gross")}
            >
              Netto → Brutto
            </button>
          </div>

          <section className="grid gap-3 border-t border-black/6 pt-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(170px,240px)_minmax(170px,240px)_minmax(170px,240px)]">
            <FieldRow
              info={
                calculationMode === "gross-to-net"
                  ? "Brutto årslønn er lønn før skatt og andre trekk."
                  : "Netto årslønn er det du sitter igjen med etter skatt og andre trekk gjennom året."
              }
              label={calculationMode === "gross-to-net" ? "Årlig bruttolønn" : "Netto årslønn"}
            >
              <NumericInput
                autoFocus
                onChange={setAnnualSalaryInput}
                placeholder={calculationMode === "gross-to-net" ? "For eksempel 650 000" : "For eksempel 455 000"}
                value={annualSalaryInput}
              />
            </FieldRow>
            <FieldRow
              info="Kalkulatoren bruker en enkel trekkprosent. Faktisk skatt kan avvike på grunn av skattekort, fradrag, tabelltrekk og andre forhold."
              label="Estimert skattesats"
            >
              <NumericInput onChange={setTaxRateInput} placeholder="30" suffix="%" value={taxRateInput} />
            </FieldRow>
            <FieldRow
              info="Bruk antall arbeidstimer per uke. Timelønn beregnes med 52 uker per år."
              label="Timer per uke"
            >
              <NumericInput onChange={setWeeklyHoursInput} placeholder="37,5" value={weeklyHoursInput} />
            </FieldRow>
            <FieldRow
              info="Brukes bare til å vise et enkelt estimat på feriepenger basert på beregnet bruttolønn."
              label="Feriepengesats"
            >
              <NumericInput onChange={setHolidayRateInput} placeholder="12" suffix="%" value={holidayRateInput} />
            </FieldRow>
          </section>
        </div>
      </div>

      <section className="grid gap-4 lg:grid-cols-[1.35fr_1fr_1fr]">
        <HeroMetricCard
          detail={
            calculatingNet
              ? "Estimert lønn etter skatt og andre trekk."
              : "Estimert lønn før skatt og andre trekk."
          }
          label={calculatingNet ? "Beregnet netto årslønn" : "Beregnet brutto årslønn"}
          prominent
          tone={calculatingNet ? "net" : "gross"}
          value={formatCurrency(primaryAnnual)}
        />
        <HeroMetricCard
          detail={calculatingNet ? "Beregnet nettolønn fordelt på 12 måneder." : "Beregnet bruttolønn fordelt på 12 måneder."}
          label={calculatingNet ? "Netto månedslønn" : "Brutto månedslønn"}
          tone={calculatingNet ? "net" : "gross"}
          value={formatCurrency(primaryMonthly)}
        />
        <HeroMetricCard
          detail="Estimert skatt basert på prosenten du har lagt inn."
          label="Årlig skattetrekk"
          tone="accent"
          value={formatCurrency(annualTax)}
        />
      </section>

      <section className="grid gap-5 xl:grid-cols-3">
        <MetricSection
          description={calculatingNet ? "Lønn etter estimert skatt og andre trekk." : "Lønn før skatt og andre trekk."}
          title={calculatingNet ? "Beregnet nettolønn" : "Beregnet bruttolønn"}
        >
          <MetricRow
            label={calculatingNet ? "Netto årslønn" : "Brutto årslønn"}
            tone={calculatingNet ? "net" : "gross"}
            value={formatCurrency(primaryAnnual)}
          />
          <MetricRow
            label={calculatingNet ? "Netto månedslønn" : "Brutto månedslønn"}
            value={formatCurrency(primaryMonthly)}
          />
          <MetricRow
            label={calculatingNet ? "Netto ukelønn" : "Brutto ukelønn"}
            value={formatCurrency(primaryWeekly)}
          />
          <MetricRow
            label={calculatingNet ? "Netto timelønn" : "Brutto timelønn"}
            tone="accent"
            value={formatCurrency(primaryHourly)}
          />
        </MetricSection>

        <MetricSection
          description={calculatingNet ? "Bruttolønnen du startet med og estimert trekk." : "Nettolønnen du startet med og estimert trekk."}
          title={calculatingNet ? "Utgangspunkt og trekk" : "Nettolønn og trekk"}
        >
          <MetricRow
            label={calculatingNet ? "Brutto årslønn" : "Netto årslønn"}
            tone={calculatingNet ? "gross" : "net"}
            value={formatCurrency(calculatingNet ? annualGross : netAnnualSalary)}
          />
          <MetricRow
            label={calculatingNet ? "Brutto månedslønn" : "Netto månedslønn"}
            tone={calculatingNet ? "gross" : "net"}
            value={formatCurrency(calculatingNet ? monthlyGross : monthlyNet)}
          />
          <MetricRow label="Estimert skattesats" value={taxRate !== undefined ? `${formatNumber(taxRate)} %` : "—"} />
          <MetricRow label="Estimert månedlig trekk" value={formatCurrency(monthlyTax)} />
        </MetricSection>

        <MetricSection
          description={calculatingNet ? "Ekstra omregninger basert på beregnet nettolønn." : "Ekstra omregninger basert på beregnet bruttolønn."}
          title="Arbeidstid og ferie"
        >
          <MetricRow label="Timer per uke" value={weeklyHours !== undefined ? `${formatNumber(weeklyHours)} timer` : "—"} />
          <MetricRow label={calculatingNet ? "Netto daglønn" : "Brutto daglønn"} value={formatCurrency(primaryDaily)} />
          <MetricRow label="Feriepengesats" value={holidayRate !== undefined ? `${formatNumber(holidayRate)} %` : "—"} />
          <MetricRow label="Estimert feriepenger" tone="accent" value={formatCurrency(holidayPay)} />
        </MetricSection>
      </section>
    </section>
  );
}

function FieldRow({
  label,
  info,
  children,
}: {
  label: string;
  info?: string;
  children: ReactNode;
}) {
  return (
    <div className="grid gap-2">
      <div className="flex items-center gap-2">
        <label className="text-sm font-semibold text-slate-950">{label}</label>
        {info ? <InfoTip text={info} /> : null}
      </div>
      {children}
    </div>
  );
}

function NumericInput({
  value,
  onChange,
  placeholder,
  suffix,
  autoFocus,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  suffix?: string;
  autoFocus?: boolean;
}) {
  return (
    <div className="relative">
      <input
        autoFocus={autoFocus}
        className={`${inputClassName} ${suffix ? "pr-11" : ""}`}
        inputMode="decimal"
        onChange={(event) => onChange(sanitizeNumericInput(event.target.value))}
        placeholder={placeholder}
        type="text"
        value={value}
      />
      {suffix ? (
        <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-sm font-semibold text-slate-400">
          {suffix}
        </span>
      ) : null}
    </div>
  );
}

function HeroMetricCard({
  label,
  value,
  detail,
  tone,
  prominent = false,
}: {
  label: string;
  value: string;
  detail: string;
  tone: MetricTone;
  prominent?: boolean;
}) {
  return (
    <article className={`rounded-[5px] p-5 shadow-[0_16px_44px_rgba(15,23,42,0.05)] ${getSurfaceClassName(tone)}`}>
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{label}</p>
      <p
        className={`mt-3 font-semibold tracking-[-0.05em] tabular-nums ${getValueClassName(tone)} ${
          prominent ? "text-4xl sm:text-5xl" : "text-3xl"
        }`}
      >
        {value}
      </p>
      <p className="mt-3 text-sm leading-6 text-slate-600">{detail}</p>
    </article>
  );
}

function MetricSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-[5px] bg-white p-5 shadow-[0_16px_44px_rgba(15,23,42,0.05)]">
      <div className="mb-5">
        <h2 className="text-2xl font-semibold tracking-[-0.04em] text-slate-950">{title}</h2>
        <p className="mt-1 text-sm leading-6 text-slate-600">{description}</p>
      </div>
      <div className="grid gap-3">{children}</div>
    </section>
  );
}

function MetricRow({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string;
  tone?: MetricTone;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-[5px] bg-slate-50 px-4 py-3">
      <span className="truncate text-sm text-slate-700">{label}</span>
      <span className={`shrink-0 text-sm font-semibold tabular-nums ${getValueClassName(tone)}`}>{value}</span>
    </div>
  );
}

function InfoTip({ text }: { text: string }) {
  return (
    <details className="group relative">
      <summary className="flex h-5 w-5 cursor-pointer list-none items-center justify-center rounded-full bg-slate-200 text-[11px] font-semibold text-slate-600 transition hover:bg-slate-300 hover:text-slate-950">
        i
      </summary>
      <div className="absolute left-1/2 top-[calc(100%+0.5rem)] z-20 w-64 -translate-x-1/2 rounded-[5px] bg-slate-950 px-3 py-2 text-xs leading-5 text-white shadow-[0_16px_40px_rgba(15,23,42,0.20)]">
        {text}
      </div>
    </details>
  );
}

const inputClassName =
  "h-11 w-full rounded-[5px] border border-black/8 bg-white px-4 text-base text-slate-950 outline-none transition-all duration-200 placeholder:text-slate-400 hover:border-black/14 focus:border-[rgba(20,83,45,0.32)] focus:ring-4 focus:ring-[rgba(20,83,45,0.10)]";

function sanitizeNumericInput(value: string) {
  return value.replace(/[^0-9,.\s-]/g, "").replace(/\./g, ",");
}

function parsePositiveNumber(value: string) {
  const normalized = value.replace(/\s+/g, "").replace(",", ".");

  if (!normalized) {
    return undefined;
  }

  const parsed = Number(normalized);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return undefined;
  }

  return parsed;
}

function clampPercent(value: number | undefined) {
  if (value === undefined) {
    return undefined;
  }

  return Math.min(Math.max(value, 0), 99.9);
}

function formatCurrency(value: number | undefined) {
  if (value === undefined || Number.isNaN(value)) {
    return "—";
  }

  return `${value.toLocaleString("nb-NO", {
    maximumFractionDigits: 0,
  })} kr`;
}

function formatNumber(value: number) {
  return value.toLocaleString("nb-NO", {
    minimumFractionDigits: value % 1 === 0 ? 0 : 1,
    maximumFractionDigits: 1,
  });
}

function getSurfaceClassName(tone: MetricTone) {
  if (tone === "gross") {
    return "bg-emerald-50";
  }

  if (tone === "net") {
    return "bg-sky-50";
  }

  if (tone === "accent") {
    return "bg-amber-50";
  }

  return "bg-white";
}

function getValueClassName(tone: MetricTone) {
  if (tone === "gross") {
    return "text-emerald-800";
  }

  if (tone === "net") {
    return "text-sky-900";
  }

  if (tone === "accent") {
    return "text-amber-800";
  }

  return "text-slate-950";
}
