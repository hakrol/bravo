"use client";

import { useMemo, useState, type ReactNode } from "react";
import { CalculatorPageVisual } from "@/components/calculator-page-visual";

const DEFAULT_LOAN_AMOUNT = "4 500 000";
const DEFAULT_INTEREST_RATE = "5,24";
const DEFAULT_TERM_YEARS = "30";
const PREVIEW_MONTHS = 12;

type LoanType = "annuity" | "serial";
type MetricTone = "default" | "payment" | "interest" | "principal" | "total";

type PaymentRow = {
  month: number;
  payment: number;
  interest: number;
  principal: number;
  remainingDebt: number;
};

type LoanPaymentResult = {
  firstPayment: PaymentRow;
  lastPayment: PaymentRow;
  averagePayment: number;
  totalInterest: number;
  totalPrincipal: number;
  totalCost: number;
  interestShare: number;
  previewRows: PaymentRow[];
  fiveYearPrincipal: number;
  fiveYearInterest: number;
};

export function LoanPaymentCalculatorDashboard() {
  const [loanType, setLoanType] = useState<LoanType>("annuity");
  const [loanAmountInput, setLoanAmountInput] = useState(DEFAULT_LOAN_AMOUNT);
  const [interestRateInput, setInterestRateInput] = useState(DEFAULT_INTEREST_RATE);
  const [termYearsInput, setTermYearsInput] = useState(DEFAULT_TERM_YEARS);

  const loanAmount = clampNumber(parsePositiveNumber(loanAmountInput) ?? 0, 0, 100000000);
  const interestRate = clampNumber(parsePositiveNumber(interestRateInput) ?? 0, 0, 25);
  const termYears = clampNumber(parsePositiveNumber(termYearsInput) ?? 1, 1, 40);
  const loanTypeLabel = loanType === "annuity" ? "Annuitetslån" : "Serielån";

  const result = useMemo(
    () =>
      calculateLoanPaymentResult({
        loanAmount,
        interestRate,
        termYears,
        loanType,
      }),
    [loanAmount, interestRate, termYears, loanType],
  );

  return (
    <section className="fade-up grid gap-6 lg:gap-8">
      <div className="relative overflow-hidden rounded-[5px] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(247,249,251,0.96))] px-6 py-7 shadow-[0_22px_70px_rgba(15,23,42,0.07)] sm:px-8 sm:py-8 lg:px-10">
        <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(217,139,43,0.28),transparent)]" />
        <div className="relative space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <CalculatorPageVisual variant="loan" />
            <div className="max-w-4xl space-y-3">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--primary-strong)]">
                Verktøy
              </p>
              <h1 className="max-w-3xl text-4xl font-semibold tracking-[-0.06em] text-slate-950 sm:text-5xl lg:text-6xl">
                Rente- og avdragskalkulator
              </h1>
              <p className="max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                Beregn renter, avdrag, terminbeløp og total kostnad for annuitetslån og serielån.
              </p>
            </div>
          </div>

          <section className="grid gap-3 border-t border-black/6 pt-4 lg:grid-cols-[minmax(0,1fr)_minmax(160px,220px)_minmax(160px,220px)_minmax(230px,280px)]">
            <FieldRow
              info="Dette er beløpet du låner. Kalkulatoren beregner nedbetaling for selve lånet, ikke boligpris eller egenkapital."
              label="Lånebeløp"
            >
              <NumericInput
                autoFocus
                onChange={setLoanAmountInput}
                placeholder="4 500 000"
                value={loanAmountInput}
              />
            </FieldRow>

            <FieldRow
              info="Nominell årlig rente. Kalkulatoren deler renten på 12 og beregner renter måned for måned."
              label="Rente"
            >
              <NumericInput
                onChange={setInterestRateInput}
                placeholder="5,24"
                suffix="%"
                value={interestRateInput}
              />
            </FieldRow>

            <FieldRow
              info="Hvor mange år lånet betales ned over. Lengre nedbetalingstid gir lavere terminbeløp, men høyere samlet rentekostnad."
              label="Nedbetalingstid"
            >
              <NumericInput
                onChange={setTermYearsInput}
                placeholder="30"
                suffix="år"
                value={termYearsInput}
              />
            </FieldRow>

            <FieldRow
              info="Annuitetslån har likt terminbeløp hver måned. Serielån har samme avdrag hver måned, mens rentene og terminbeløpet faller over tid."
              label="Lånetype"
            >
              <SegmentedControl onChange={setLoanType} value={loanType} />
            </FieldRow>
          </section>
        </div>
      </div>

      <section className="grid gap-4 lg:grid-cols-[1.35fr_1fr_1fr]">
        <HeroMetricCard
          detail={
            loanType === "annuity"
              ? "Fast terminbeløp gjennom hele nedbetalingstiden, før eventuelle gebyrer."
              : "Serielån starter høyere og faller etter hvert som restgjelden går ned."
          }
          label={loanType === "annuity" ? "Terminbeløp per måned" : "Første terminbeløp"}
          prominent
          tone="payment"
          value={formatCurrency(result.firstPayment.payment)}
        />
        <HeroMetricCard
          detail={`Renter første måned ved ${formatNumber(interestRate)} % nominell rente.`}
          label="Renter første måned"
          tone="interest"
          value={formatCurrency(result.firstPayment.interest)}
        />
        <HeroMetricCard
          detail="Delen av første betaling som faktisk reduserer lånet."
          label="Avdrag første måned"
          tone="principal"
          value={formatCurrency(result.firstPayment.principal)}
        />
      </section>

      <section className="grid gap-5 xl:grid-cols-3">
        <MetricSection
          description={`${loanTypeLabel} over ${formatNumber(termYears)} år med ${formatNumber(interestRate)} % rente.`}
          title="Kostnad"
        >
          <MetricRow label="Lånebeløp" tone="principal" value={formatCurrency(result.totalPrincipal)} />
          <MetricRow label="Totale renter" tone="interest" value={formatCurrency(result.totalInterest)} />
          <MetricRow label="Totalt å betale" tone="total" value={formatCurrency(result.totalCost)} />
        </MetricSection>

        <MetricSection
          description="Slik endrer terminbeløpet seg fra første til siste måned."
          title="Terminbeløp"
        >
          <MetricRow label="Første måned" tone="payment" value={formatCurrency(result.firstPayment.payment)} />
          <MetricRow label="Gjennomsnitt per måned" tone="payment" value={formatCurrency(result.averagePayment)} />
          <MetricRow label="Siste måned" tone="payment" value={formatCurrency(result.lastPayment.payment)} />
        </MetricSection>

        <MetricSection
          description="Første fem år viser hvor mye som går til renter og faktisk nedbetaling."
          title="Etter 5 år"
        >
          <MetricRow label="Nedbetalt avdrag" tone="principal" value={formatCurrency(result.fiveYearPrincipal)} />
          <MetricRow label="Betalt i renter" tone="interest" value={formatCurrency(result.fiveYearInterest)} />
          <MetricRow
            label="Restgjeld"
            value={formatCurrency(Math.max(loanAmount - result.fiveYearPrincipal, 0))}
          />
        </MetricSection>
      </section>

      <section className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <MetricSection
          description="Hvor stor del av den samlede betalingen som er renter."
          title="Renteandel"
        >
          <div className="grid gap-4">
            <div className="overflow-hidden rounded-[5px] bg-slate-100">
              <div
                className="h-4 rounded-[5px] bg-rose-300 transition-all duration-300"
                style={{ width: `${result.interestShare}%` }}
              />
            </div>
            <div className="grid gap-3">
              <MetricRow label="Renteandel" tone="interest" value={`${formatNumber(result.interestShare)} %`} />
              <MetricRow
                label="Avdragsandel"
                tone="principal"
                value={`${formatNumber(100 - result.interestShare)} %`}
              />
            </div>
          </div>
        </MetricSection>

        <section className="rounded-[5px] bg-white p-5 shadow-[0_16px_44px_rgba(15,23,42,0.05)]">
          <div>
            <h2 className="text-2xl font-semibold tracking-[-0.04em] text-slate-950">
              Første 12 terminer
            </h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Nedbetalingsplanen viser hvordan renter, avdrag og restgjeld utvikler seg måned for
              måned.
            </p>
          </div>

          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[620px] border-separate border-spacing-y-2 text-sm">
              <thead>
                <tr className="text-left text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                  <th className="px-3 py-2">Termin</th>
                  <th className="px-3 py-2 text-right">Beløp</th>
                  <th className="px-3 py-2 text-right">Renter</th>
                  <th className="px-3 py-2 text-right">Avdrag</th>
                  <th className="px-3 py-2 text-right">Restgjeld</th>
                </tr>
              </thead>
              <tbody>
                {result.previewRows.map((row) => (
                  <tr className="bg-slate-50" key={row.month}>
                    <td className="rounded-l-[5px] px-3 py-3 font-semibold text-slate-700">
                      {row.month}
                    </td>
                    <td className="px-3 py-3 text-right tabular-nums text-slate-950">
                      {formatCurrency(row.payment)}
                    </td>
                    <td className="px-3 py-3 text-right tabular-nums text-rose-700">
                      {formatCurrency(row.interest)}
                    </td>
                    <td className="px-3 py-3 text-right tabular-nums text-emerald-800">
                      {formatCurrency(row.principal)}
                    </td>
                    <td className="rounded-r-[5px] px-3 py-3 text-right tabular-nums text-slate-600">
                      {formatCurrency(row.remainingDebt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </section>
    </section>
  );
}

function calculateLoanPaymentResult({
  loanAmount,
  interestRate,
  termYears,
  loanType,
}: {
  loanAmount: number;
  interestRate: number;
  termYears: number;
  loanType: LoanType;
}): LoanPaymentResult {
  const months = Math.max(Math.round(termYears * 12), 1);
  const monthlyRate = interestRate / 100 / 12;
  const fixedAnnuityPayment = calculateAnnuityPayment(loanAmount, monthlyRate, months);
  const fixedSerialPrincipal = loanAmount / months;
  const rows: PaymentRow[] = [];
  let remainingDebt = loanAmount;
  let totalInterest = 0;
  let totalPrincipal = 0;

  for (let month = 1; month <= months; month += 1) {
    const interest = remainingDebt * monthlyRate;
    const principal =
      loanType === "annuity"
        ? Math.min(Math.max(fixedAnnuityPayment - interest, 0), remainingDebt)
        : Math.min(fixedSerialPrincipal, remainingDebt);
    const payment = principal + interest;
    remainingDebt = Math.max(remainingDebt - principal, 0);

    totalInterest += interest;
    totalPrincipal += principal;
    rows.push({
      month,
      payment,
      interest,
      principal,
      remainingDebt,
    });
  }

  const fiveYearRows = rows.slice(0, Math.min(60, rows.length));
  const fiveYearPrincipal = fiveYearRows.reduce((sum, row) => sum + row.principal, 0);
  const fiveYearInterest = fiveYearRows.reduce((sum, row) => sum + row.interest, 0);
  const totalCost = totalPrincipal + totalInterest;
  const firstPayment = rows[0] ?? createEmptyPaymentRow();
  const lastPayment = rows[rows.length - 1] ?? createEmptyPaymentRow();

  return {
    firstPayment,
    lastPayment,
    averagePayment: totalCost / months,
    totalInterest,
    totalPrincipal,
    totalCost,
    interestShare: totalCost > 0 ? (totalInterest / totalCost) * 100 : 0,
    previewRows: rows.slice(0, PREVIEW_MONTHS),
    fiveYearPrincipal,
    fiveYearInterest,
  };
}

function calculateAnnuityPayment(principal: number, monthlyRate: number, months: number) {
  if (principal <= 0 || months <= 0) {
    return 0;
  }

  if (monthlyRate <= 0) {
    return principal / months;
  }

  return (principal * monthlyRate) / (1 - (1 + monthlyRate) ** -months);
}

function createEmptyPaymentRow(): PaymentRow {
  return {
    month: 0,
    payment: 0,
    interest: 0,
    principal: 0,
    remainingDebt: 0,
  };
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
        onChange={(event) => onChange(formatInputValue(sanitizeNumericInput(event.target.value)))}
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

function SegmentedControl({
  value,
  onChange,
}: {
  value: LoanType;
  onChange: (value: LoanType) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-1 rounded-[5px] bg-slate-100 p-1">
      <LoanTypeButton active={value === "annuity"} label="Annuitet" onClick={() => onChange("annuity")} />
      <LoanTypeButton active={value === "serial"} label="Serie" onClick={() => onChange("serial")} />
    </div>
  );
}

function LoanTypeButton({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      aria-pressed={active}
      className={`h-10 rounded-[5px] px-3 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary-strong)] ${
        active
          ? "bg-white text-[#d98b2b] shadow-[0_10px_28px_rgba(15,23,42,0.08)]"
          : "text-slate-600 hover:text-slate-950"
      }`}
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
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

function formatInputValue(value: string) {
  const compact = value.replace(/\s+/g, "");

  if (!compact) {
    return "";
  }

  const [integerPart, decimalPart] = compact.split(",");
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, " ");

  if (decimalPart === undefined) {
    return formattedInteger;
  }

  return `${formattedInteger},${decimalPart.slice(0, 2)}`;
}

function parsePositiveNumber(value: string) {
  const normalized = value.replace(/\s+/g, "").replace(",", ".");

  if (!normalized) {
    return undefined;
  }

  const parsed = Number(normalized);

  if (!Number.isFinite(parsed) || parsed < 0) {
    return undefined;
  }

  return parsed;
}

function clampNumber(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
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
  if (tone === "payment") {
    return "bg-sky-50";
  }

  if (tone === "interest") {
    return "bg-rose-50";
  }

  if (tone === "principal") {
    return "bg-emerald-50";
  }

  if (tone === "total") {
    return "bg-amber-50";
  }

  return "bg-white";
}

function getValueClassName(tone: MetricTone) {
  if (tone === "payment") {
    return "text-sky-900";
  }

  if (tone === "interest") {
    return "text-rose-700";
  }

  if (tone === "principal") {
    return "text-emerald-800";
  }

  if (tone === "total") {
    return "text-amber-800";
  }

  return "text-slate-950";
}
