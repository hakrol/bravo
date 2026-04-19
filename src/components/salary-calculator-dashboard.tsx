"use client";

import { type Dispatch, type ReactNode, type SetStateAction, useState } from "react";

const STANDARD_WEEKLY_HOUR_OPTIONS = ["35,5", "36", "37,5", "40"] as const;
const DAY_HOURS = 7.5;
const WEEKS_PER_YEAR = 52;

type SalarySource = "annual" | "monthly" | "hourly";
type MetricTone = "default" | "gross" | "net" | "tax" | "accent";

type SalaryInputs = {
  annual: string;
  monthly: string;
  hourly: string;
};

const INITIAL_SALARY_INPUTS: SalaryInputs = {
  annual: "",
  monthly: "",
  hourly: "",
};

export function SalaryCalculatorDashboard() {
  const [standardWeeklyHours, setStandardWeeklyHours] = useState("37,5");
  const [actualWeeklyHours, setActualWeeklyHours] = useState("37,5");
  const [employmentPercentInput, setEmploymentPercentInput] = useState("");
  const [salarySource, setSalarySource] = useState<SalarySource>("annual");
  const [salaryInputs, setSalaryInputs] = useState<SalaryInputs>(INITIAL_SALARY_INPUTS);
  const [taxRateInput, setTaxRateInput] = useState("30");
  const [holidayRateInput, setHolidayRateInput] = useState("12");
  const [vacationWeeksInput, setVacationWeeksInput] = useState("5");

  const standardHours = parsePositiveNumber(standardWeeklyHours);
  const actualHours = parsePositiveNumber(actualWeeklyHours);
  const taxRate = clampPercent(parsePositiveNumber(taxRateInput));
  const holidayRate = clampPercent(parsePositiveNumber(holidayRateInput));
  const vacationWeeks = parsePositiveNumber(vacationWeeksInput);

  const autoEmploymentPercent =
    standardHours !== undefined && actualHours !== undefined && standardHours > 0
      ? (actualHours / standardHours) * 100
      : undefined;
  const employmentPercent =
    employmentPercentInput.trim().length > 0
      ? clampEmploymentPercent(parsePositiveNumber(employmentPercentInput))
      : autoEmploymentPercent;
  const effectiveActualHours =
    actualHours ??
    (standardHours !== undefined && employmentPercent !== undefined
      ? (standardHours * employmentPercent) / 100
      : undefined);

  const sourceValue = parsePositiveNumber(salaryInputs[salarySource]);
  const annualSalaryAtFullTime = deriveAnnualSalaryAtFullTime({
    salarySource,
    sourceValue,
    standardHours,
  });

  const actualAnnualGross =
    annualSalaryAtFullTime !== undefined && employmentPercent !== undefined
      ? (annualSalaryAtFullTime * employmentPercent) / 100
      : undefined;
  const actualMonthlyGross =
    actualAnnualGross !== undefined ? actualAnnualGross / 12 : undefined;
  const actualHourlyGross =
    actualAnnualGross !== undefined &&
    effectiveActualHours !== undefined &&
    effectiveActualHours > 0
      ? actualAnnualGross / (effectiveActualHours * WEEKS_PER_YEAR)
      : undefined;
  const actualDailyGross =
    actualHourlyGross !== undefined ? actualHourlyGross * DAY_HOURS : undefined;

  const annualTax =
    actualAnnualGross !== undefined && taxRate !== undefined
      ? actualAnnualGross * (taxRate / 100)
      : undefined;
  const monthlyTax = annualTax !== undefined ? annualTax / 12 : undefined;

  const actualAnnualNet =
    actualAnnualGross !== undefined && annualTax !== undefined
      ? actualAnnualGross - annualTax
      : undefined;
  const actualMonthlyNet =
    actualMonthlyGross !== undefined && monthlyTax !== undefined
      ? actualMonthlyGross - monthlyTax
      : undefined;
  const actualHourlyNet =
    actualHourlyGross !== undefined && taxRate !== undefined
      ? actualHourlyGross * (1 - taxRate / 100)
      : undefined;
  const actualDailyNet =
    actualDailyGross !== undefined && taxRate !== undefined
      ? actualDailyGross * (1 - taxRate / 100)
      : undefined;

  const holidayDeduction =
    actualAnnualGross !== undefined && vacationWeeks !== undefined
      ? (actualAnnualGross / WEEKS_PER_YEAR) * vacationWeeks
      : undefined;
  const holidayPay =
    actualAnnualGross !== undefined && holidayRate !== undefined
      ? actualAnnualGross * (holidayRate / 100)
      : undefined;
  const adjustedAnnualGross =
    actualAnnualGross !== undefined && holidayDeduction !== undefined && holidayPay !== undefined
      ? actualAnnualGross - holidayDeduction + holidayPay
      : undefined;
  const juneGrossPayout =
    actualMonthlyGross !== undefined && holidayDeduction !== undefined && holidayPay !== undefined
      ? actualMonthlyGross - holidayDeduction + holidayPay
      : undefined;

  const monthlyDifferenceFromFullTime =
    annualSalaryAtFullTime !== undefined && actualMonthlyGross !== undefined
      ? annualSalaryAtFullTime / 12 - actualMonthlyGross
      : undefined;

  return (
    <section className="fade-up grid gap-6 lg:gap-8">
      <div className="relative overflow-hidden rounded-[5px] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(247,249,251,0.96))] px-6 py-7 shadow-[0_22px_70px_rgba(15,23,42,0.07)] sm:px-8 sm:py-8 lg:px-10">
        <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(20,83,45,0.22),transparent)]" />
        <div className="relative space-y-5">
          <div className="max-w-4xl space-y-3">
            <h1 className="max-w-3xl text-4xl font-semibold tracking-[-0.06em] text-slate-950 sm:text-5xl lg:text-6xl">
              Lønnskalkulator
            </h1>
            <p className="max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              Beregn lønn, skatt, timelønn, feriepenger og netto utbetaling med en enkel
              lønnskalkulator.
            </p>
          </div>

          <section
            className="scroll-mt-8"
            id="lonnskalkulator-kontrollpanel"
          >
            <div className="grid gap-3">
              <PanelRow>
                <div className="grid gap-3 md:grid-cols-3">
                  <FieldRow
                    label="Timer per uke i 100 %"
                  >
                    <select
                      autoFocus
                      className={inputClassName}
                      onChange={(event) => setStandardWeeklyHours(event.target.value)}
                      value={standardWeeklyHours}
                    >
                      {STANDARD_WEEKLY_HOUR_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option} timer
                        </option>
                      ))}
                    </select>
                  </FieldRow>

                  <FieldRow
                    info="Dette er antall timer du faktisk jobber i en vanlig uke. Bruk tallet som står i arbeidsavtalen eller det du normalt jobber."
                    label="Faktiske timer per uke"
                  >
                    <NumericInput
                      onChange={setActualWeeklyHours}
                      placeholder="For eksempel 30"
                      value={actualWeeklyHours}
                    />
                  </FieldRow>

                  <FieldRow
                    label="Stillingsprosent"
                  >
                    <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto]">
                      <NumericInput
                        onChange={setEmploymentPercentInput}
                        placeholder={
                          autoEmploymentPercent !== undefined
                            ? formatNumber(autoEmploymentPercent)
                            : "For eksempel 80"
                        }
                        value={employmentPercentInput}
                      />
                      <button
                        className="inline-flex h-12 items-center justify-center rounded-[5px] bg-slate-100 px-4 text-sm font-semibold text-slate-600 transition hover:bg-slate-200 hover:text-slate-950"
                        onClick={() => setEmploymentPercentInput("")}
                        type="button"
                      >
                        Bruk auto
                      </button>
                    </div>
                  </FieldRow>
                </div>
              </PanelRow>

              <PanelRow>
                <div className="grid gap-3 lg:grid-cols-3">
                  <SalaryInlineField
                    active={salarySource === "annual"}
                    label="Årslønn"
                    onChange={(value) =>
                      handleSalaryInputChange("annual", value, setSalaryInputs, setSalarySource)
                    }
                    onFocus={() => setSalarySource("annual")}
                    value={getSalaryInputValue(
                      "annual",
                      salarySource,
                      salaryInputs,
                      annualSalaryAtFullTime,
                      standardHours,
                    )}
                  />
                  <SalaryInlineField
                    active={salarySource === "monthly"}
                    label="Månedslønn"
                    onChange={(value) =>
                      handleSalaryInputChange("monthly", value, setSalaryInputs, setSalarySource)
                    }
                    onFocus={() => setSalarySource("monthly")}
                    value={getSalaryInputValue(
                      "monthly",
                      salarySource,
                      salaryInputs,
                      annualSalaryAtFullTime,
                      standardHours,
                    )}
                  />
                  <SalaryInlineField
                    active={salarySource === "hourly"}
                    label="Timelønn"
                    onChange={(value) =>
                      handleSalaryInputChange("hourly", value, setSalaryInputs, setSalarySource)
                    }
                    onFocus={() => setSalarySource("hourly")}
                    value={getSalaryInputValue(
                      "hourly",
                      salarySource,
                      salaryInputs,
                      annualSalaryAtFullTime,
                      standardHours,
                    )}
                  />
                </div>
              </PanelRow>

              <PanelRow>
                <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-[minmax(160px,220px)_minmax(160px,220px)_minmax(160px,220px)] lg:items-end">
                  <FieldRow
                    info="Dette er en enkel estimert skatteprosent. Kalkulatoren bruker ikke skattekort, fradrag eller trinnskatt."
                    label="Skattesats"
                  >
                    <NumericInput
                      onChange={setTaxRateInput}
                      placeholder="30"
                      suffix="%"
                      value={taxRateInput}
                    />
                  </FieldRow>

                  <FieldRow
                    info="Dette er prosenten som brukes til å beregne feriepenger. Vanlige satser er 10,2 % eller 12 %."
                    label="Feriepengesats"
                  >
                    <NumericInput
                      onChange={setHolidayRateInput}
                      placeholder="12"
                      suffix="%"
                      value={holidayRateInput}
                    />
                  </FieldRow>

                  <FieldRow
                    info="Dette er antall ferieuker som brukes til å beregne ferietrekk. Mange bruker 5 uker."
                    label="Ferieuker"
                  >
                    <NumericInput
                      onChange={setVacationWeeksInput}
                      placeholder="5"
                      value={vacationWeeksInput}
                    />
                  </FieldRow>
                </div>
              </PanelRow>
            </div>
          </section>
        </div>
      </div>

      <section className="grid gap-4 lg:grid-cols-[1.35fr_1fr_1fr]">
        <HeroMetricCard
          detail="Det viktigste tallet for hva som faktisk kommer inn på konto hver måned."
          label="Netto månedslønn"
          prominent
          tone="net"
          value={formatCurrency(actualMonthlyNet)}
        />
        <HeroMetricCard
          detail="Brutto månedslønn i faktisk stillingsprosent."
          label="Brutto månedslønn"
          tone="gross"
          value={formatCurrency(actualMonthlyGross)}
        />
        <HeroMetricCard
          detail="Estimert månedlig skatt med enkel prosentmodell."
          label="Månedlig skatt"
          tone="tax"
          value={formatCurrency(monthlyTax)}
        />
      </section>

      <section className="grid gap-5 xl:grid-cols-3">
        <MetricSection
          description="Lønn før skatt, basert på stillingsprosenten du faktisk jobber."
          title="Brutto"
        >
          <MetricRow
            label="Årslønn"
            tone="gross"
            value={formatCurrency(actualAnnualGross)}
          />
          <MetricRow
            label="Månedslønn"
            tone="gross"
            value={formatCurrency(actualMonthlyGross)}
          />
          <MetricRow
            info="Daglønn beregnes som timelønn ganger 7,5 timer."
            label="Daglønn"
            tone="gross"
            value={formatCurrency(actualDailyGross)}
          />
          <MetricRow
            label="Timelønn"
            tone="gross"
            value={formatCurrency(actualHourlyGross)}
          />
        </MetricSection>

        <MetricSection
          description="Trekket er et overslag basert på prosenten du har valgt."
          title="Skatt"
        >
          <MetricRow label="Årlig skatt" tone="tax" value={formatCurrency(annualTax)} />
          <MetricRow label="Månedlig skatt" tone="tax" value={formatCurrency(monthlyTax)} />
        </MetricSection>

        <MetricSection
          description="Estimert utbetaling etter den enkle skatteberegningen."
          title="Netto"
        >
          <MetricRow label="Netto årslønn" tone="net" value={formatCurrency(actualAnnualNet)} />
          <MetricRow
            label="Netto månedslønn"
            tone="net"
            value={formatCurrency(actualMonthlyNet)}
          />
          <MetricRow label="Netto daglønn" tone="net" value={formatCurrency(actualDailyNet)} />
          <MetricRow label="Netto timelønn" tone="net" value={formatCurrency(actualHourlyNet)} />
        </MetricSection>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <InsightCard
          detail="Viser hva lønnen tilsvarer dersom du jobbet full stilling på samme lønnsnivå."
          label="100 % stilling"
          primaryValue={formatCurrency(annualSalaryAtFullTime !== undefined ? annualSalaryAtFullTime / 12 : undefined)}
          secondaryLabel="Årslønn i 100 %"
          secondaryValue={formatCurrency(annualSalaryAtFullTime)}
        />
        <InsightCard
          detail="Forskjellen mellom full stilling og lønnen du faktisk beregner ut fra."
          label="Forskjell fra full stilling"
          primaryValue={formatCurrency(monthlyDifferenceFromFullTime)}
          secondaryLabel="Faktiske timer per uke"
          secondaryValue={
            effectiveActualHours !== undefined ? `${formatNumber(effectiveActualHours)} timer` : "—"
          }
        />
      </section>

      <section className="rounded-[5px] bg-white p-5 shadow-[0_16px_44px_rgba(15,23,42,0.05)]">
        <div>
          <h2 className="mt-1 text-2xl font-semibold tracking-[-0.04em] text-slate-950">
            Feriejustering
          </h2>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            Feriepenger, ferietrekk og estimert utbetaling i feriemåneden.
          </p>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            detail="Prosent av lønnsgrunnlaget ditt"
            info="Feriepenger beregnes her som valgt feriepengesats ganget med brutto årslønn i faktisk stillingsprosent."
            label="Feriepenger"
            tone="accent"
            value={formatCurrency(holidayPay)}
          />
          <MetricCard
            detail="Trekk basert på valgte ferieuker"
            info="Ferietrekket er et estimat basert på årslønn delt på 52 uker, ganget med antall ferieuker du har lagt inn."
            label="Ferietrekk"
            tone="tax"
            value={formatCurrency(holidayDeduction)}
          />
          <MetricCard
            detail="Årslønn etter feriejustering"
            info="Dette viser brutto årslønn justert med feriepenger minus ferietrekk."
            label="Justerte brutto"
            tone="gross"
            value={formatCurrency(adjustedAnnualGross)}
          />
          <MetricCard
            detail="Typisk brutto i feriemåneden"
            info="Dette er et forenklet estimat for feriemåneden: månedslønn minus ferietrekk pluss feriepenger."
            label="Utbetaling i juni"
            tone="net"
            value={formatCurrency(juneGrossPayout)}
          />
        </div>
      </section>
    </section>
  );
}

type PanelRowProps = {
  children: ReactNode;
};

function PanelRow({ children }: PanelRowProps) {
  return (
    <section className="border-b border-black/6 pb-4 last:border-b-0 last:pb-0">
      {children}
    </section>
  );
}

type FieldRowProps = {
  label: string;
  description?: string;
  hint?: string;
  info?: string;
  children: ReactNode;
};

function FieldRow({ label, description, hint, info, children }: FieldRowProps) {
  return (
    <div className="grid gap-2">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <label className="text-sm font-semibold text-slate-950">{label}</label>
          {info ? <InfoTip text={info} /> : null}
        </div>
        {hint ? (
          <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-slate-400">
            {hint}
          </span>
        ) : null}
      </div>
      {children}
      {description ? <p className="text-sm leading-6 text-slate-500">{description}</p> : null}
    </div>
  );
}

type NumericInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  suffix?: string;
  onFocus?: () => void;
  dimmed?: boolean;
};

function NumericInput({
  value,
  onChange,
  placeholder,
  suffix,
  onFocus,
  dimmed = false,
}: NumericInputProps) {
  return (
    <div className="relative">
      <input
        className={`${inputClassName} ${suffix ? "pr-11" : ""} ${dimmed ? "bg-slate-50 text-slate-500" : "bg-white text-slate-950"}`}
        inputMode="decimal"
        onChange={(event) => onChange(sanitizeNumericInput(event.target.value))}
        onFocus={onFocus}
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

type SalaryInlineFieldProps = {
  active: boolean;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onFocus: () => void;
};

function SalaryInlineField({
  active,
  label,
  value,
  onChange,
  onFocus,
}: SalaryInlineFieldProps) {
  return (
    <div className={`grid gap-2 transition-opacity duration-200 ${active ? "opacity-100" : "opacity-60"}`}>
      <label className="text-sm font-semibold text-slate-950">{label}</label>
      <NumericInput
        dimmed={!active}
        onChange={onChange}
        onFocus={onFocus}
        placeholder="Skriv inn lønn"
        value={value}
      />
    </div>
  );
}

type HeroMetricCardProps = {
  label: string;
  value: string;
  detail: string;
  tone: MetricTone;
  prominent?: boolean;
};

function HeroMetricCard({
  label,
  value,
  detail,
  tone,
  prominent = false,
}: HeroMetricCardProps) {
  return (
    <article
      className={`rounded-[5px] p-5 shadow-[0_16px_44px_rgba(15,23,42,0.05)] transition-all duration-300 ${getSurfaceClassName(tone)} ${
        prominent ? "lg:p-6" : ""
      }`}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{label}</p>
      <p
        className={`mt-3 font-semibold tracking-[-0.05em] tabular-nums transition-all duration-300 ${getValueClassName(tone)} ${
          prominent ? "text-4xl sm:text-5xl" : "text-3xl"
        }`}
      >
        {value}
      </p>
      <p className="mt-3 text-sm leading-6 text-slate-600">{detail}</p>
    </article>
  );
}

type MetricSectionProps = {
  title: string;
  description: string;
  children: ReactNode;
};

function MetricSection({ title, description, children }: MetricSectionProps) {
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

type MetricRowProps = {
  label: string;
  value: string;
  tone?: MetricTone;
  info?: string;
};

function MetricRow({ label, value, tone = "default", info }: MetricRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-[5px] bg-slate-50 px-4 py-3 transition-all duration-300">
      <div className="flex min-w-0 items-center gap-2">
        <span className="truncate text-sm text-slate-700">{label}</span>
        {info ? <InfoTip text={info} /> : null}
      </div>
      <span className={`shrink-0 text-sm font-semibold tabular-nums ${getValueClassName(tone)}`}>
        {value}
      </span>
    </div>
  );
}

type MetricCardProps = {
  label: string;
  value: string;
  detail: string;
  info?: string;
  tone?: MetricTone;
};

function MetricCard({ label, value, detail, info, tone = "default" }: MetricCardProps) {
  return (
    <article
      className={`rounded-[5px] p-4 shadow-[0_12px_30px_rgba(15,23,42,0.04)] transition-all duration-300 ${getSurfaceClassName(tone)}`}
    >
      <div className="flex items-center gap-2">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{label}</p>
        {info ? <InfoTip text={info} /> : null}
      </div>
      <p className={`mt-2 text-2xl font-semibold tracking-[-0.04em] tabular-nums ${getValueClassName(tone)}`}>
        {value}
      </p>
      <p className="mt-2 text-sm leading-6 text-slate-600">{detail}</p>
    </article>
  );
}

type InsightCardProps = {
  label: string;
  primaryValue: string;
  secondaryLabel: string;
  secondaryValue: string;
  detail: string;
};

function InsightCard({
  label,
  primaryValue,
  secondaryLabel,
  secondaryValue,
  detail,
}: InsightCardProps) {
  return (
    <article className="rounded-[5px] bg-white p-5 shadow-[0_16px_44px_rgba(15,23,42,0.05)]">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{label}</p>
      <p className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-slate-950 tabular-nums">
        {primaryValue}
      </p>
      <p className="mt-3 text-sm leading-6 text-slate-600">{detail}</p>
      <div className="mt-4 flex items-center justify-between rounded-[5px] bg-slate-50 px-4 py-3">
        <span className="text-sm text-slate-600">{secondaryLabel}</span>
        <span className="text-sm font-semibold text-slate-950 tabular-nums">{secondaryValue}</span>
      </div>
    </article>
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
  "h-11 w-full rounded-[5px] border border-black/8 px-4 text-base outline-none transition-all duration-200 placeholder:text-slate-400 hover:border-black/14 focus:border-[rgba(20,83,45,0.32)] focus:ring-4 focus:ring-[rgba(20,83,45,0.10)]";

function handleSalaryInputChange(
  field: SalarySource,
  value: string,
  setSalaryInputs: Dispatch<SetStateAction<SalaryInputs>>,
  setSalarySource: Dispatch<SetStateAction<SalarySource>>,
) {
  setSalarySource(field);
  setSalaryInputs((current) => ({
    ...current,
    [field]: sanitizeNumericInput(value),
  }));
}

function getSalaryInputValue(
  field: SalarySource,
  salarySource: SalarySource,
  salaryInputs: SalaryInputs,
  annualSalaryAtFullTime: number | undefined,
  standardHours: number | undefined,
) {
  if (field === salarySource) {
    return salaryInputs[field];
  }

  if (annualSalaryAtFullTime === undefined) {
    return "";
  }

  if (field === "annual") {
    return formatInputNumber(annualSalaryAtFullTime);
  }

  if (field === "monthly") {
    return formatInputNumber(annualSalaryAtFullTime / 12);
  }

  if (standardHours === undefined || standardHours <= 0) {
    return "";
  }

  return formatInputNumber(annualSalaryAtFullTime / (standardHours * WEEKS_PER_YEAR));
}

function deriveAnnualSalaryAtFullTime({
  salarySource,
  sourceValue,
  standardHours,
}: {
  salarySource: SalarySource;
  sourceValue: number | undefined;
  standardHours: number | undefined;
}) {
  if (sourceValue === undefined) {
    return undefined;
  }

  if (salarySource === "annual") {
    return sourceValue;
  }

  if (salarySource === "monthly") {
    return sourceValue * 12;
  }

  if (standardHours === undefined || standardHours <= 0) {
    return undefined;
  }

  return sourceValue * standardHours * WEEKS_PER_YEAR;
}

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

  return Math.min(Math.max(value, 0), 100);
}

function clampEmploymentPercent(value: number | undefined) {
  if (value === undefined) {
    return undefined;
  }

  return Math.min(Math.max(value, 0), 200);
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

function formatInputNumber(value: number) {
  return value.toLocaleString("nb-NO", {
    maximumFractionDigits: 0,
    useGrouping: false,
  });
}

function getSurfaceClassName(tone: MetricTone) {
  if (tone === "gross") {
    return "bg-emerald-50";
  }

  if (tone === "net") {
    return "bg-sky-50";
  }

  if (tone === "tax") {
    return "bg-rose-50";
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

  if (tone === "tax") {
    return "text-rose-700";
  }

  if (tone === "accent") {
    return "text-amber-800";
  }

  return "text-slate-950";
}
