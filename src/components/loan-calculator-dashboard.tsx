"use client";

import { useMemo, useState, type ReactNode } from "react";

const MAX_DEBT_TO_INCOME = 5;
const MAX_LOAN_TO_VALUE = 0.9;
const STRESS_RATE_INCREASE = 3;
const MIN_STRESS_RATE = 7;
const DEFAULT_TERM_YEARS = 25;
const MONTHLY_LIVING_COST_PER_ADULT = 12000;
const MONTHLY_LIVING_COST_PER_CHILD = 6500;
const MONTHLY_FIXED_HOUSEHOLD_COST = 4000;
const SENSITIVITY_RATES = [4, 5, 6] as const;

type LimitKey = "income" | "serviceability" | "equity";
type MetricTone = "default" | "income" | "serviceability" | "equity" | "warning";

type LoanLimit = {
  key: LimitKey;
  label: string;
  value: number;
  detail: string;
};

type LoanResult = {
  actualLoan: number;
  bottleneck: LoanLimit;
  limits: LoanLimit[];
  stressRate: number;
  monthlyPayment: number;
  firstMonthInterest: number;
  firstMonthPrincipal: number;
  homePrice: number;
  equityEffect: number;
  rateDownEffect: number;
  rateUpEffect: number;
  requiredIncomeForTarget: number;
  requiredEquityForTarget: number;
  targetHomePrice: number;
  sensitivity: Array<{
    rate: number;
    serviceabilityLimit: number;
    monthlyPayment: number;
  }>;
};

export function LoanCalculatorDashboard() {
  const [annualIncomeInput, setAnnualIncomeInput] = useState("750 000");
  const [equityInput, setEquityInput] = useState("500 000");
  const [existingDebtInput, setExistingDebtInput] = useState("150 000");
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [interestRateInput, setInterestRateInput] = useState("5");
  const [termYearsInput, setTermYearsInput] = useState(String(DEFAULT_TERM_YEARS));
  const [adultsInput, setAdultsInput] = useState("1");
  const [childrenInput, setChildrenInput] = useState("0");
  const [targetLoanInput, setTargetLoanInput] = useState("3 000 000");

  const annualIncome = parsePositiveNumber(annualIncomeInput) ?? 0;
  const equity = parsePositiveNumber(equityInput) ?? 0;
  const existingDebt = parsePositiveNumber(existingDebtInput) ?? 0;
  const interestRate = clampNumber(parsePositiveNumber(interestRateInput) ?? 5, 0.1, 20);
  const termYears = clampNumber(parsePositiveNumber(termYearsInput) ?? DEFAULT_TERM_YEARS, 1, 40);
  const adults = clampNumber(parsePositiveNumber(adultsInput) ?? 1, 1, 6);
  const children = clampNumber(parsePositiveNumber(childrenInput) ?? 0, 0, 8);
  const targetLoan = parsePositiveNumber(targetLoanInput) ?? 0;

  const result = useMemo(
    () =>
      calculateLoanResult({
        annualIncome,
        equity,
        existingDebt,
        interestRate,
        termYears,
        adults,
        children,
        targetLoan,
      }),
    [annualIncome, equity, existingDebt, interestRate, termYears, adults, children, targetLoan],
  );

  return (
    <section className="fade-up grid gap-6 lg:gap-8">
      <div className="relative rounded-[5px] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(247,249,251,0.96))] px-6 py-7 shadow-[0_22px_70px_rgba(15,23,42,0.07)] sm:px-8 sm:py-8 lg:px-10">
        <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(20,83,45,0.22),transparent)]" />
        <div className="relative space-y-5">
          <div className="max-w-4xl space-y-3">
            <h1 className="max-w-3xl text-4xl font-semibold tracking-[-0.06em] text-slate-950 sm:text-5xl lg:text-6xl">
              Lånekalkulator
            </h1>
            <p className="max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              Se omtrent hvor mye du kan låne til bolig, og hvilken regel som faktisk begrenser
              låneevnen din.
            </p>
          </div>

          <section className="scroll-mt-8" id="lanekalkulator-kontrollpanel">
            <div className="grid gap-3">
              <PanelRow>
                <div className="grid gap-3 md:grid-cols-3">
                  <FieldRow
                    info="Samlet brutto årsinntekt for husstanden før skatt."
                    label="Årsinntekt"
                  >
                    <NumericInput
                      autoFocus
                      onChange={setAnnualIncomeInput}
                      placeholder="750 000"
                      value={annualIncomeInput}
                    />
                  </FieldRow>

                  <FieldRow
                    info="Penger du kan bruke som egenkapital ved kjøp. Kalkulatoren bruker 90 % belåningsgrad som hovedregel."
                    label="Egenkapital"
                  >
                    <NumericInput
                      onChange={setEquityInput}
                      placeholder="500 000"
                      value={equityInput}
                    />
                  </FieldRow>

                  <FieldRow
                    info="Studielån, billån, kredittkort og annen gjeld teller med i samlet gjeldsgrad."
                    label="Eksisterende gjeld"
                  >
                    <NumericInput
                      onChange={setExistingDebtInput}
                      placeholder="150 000"
                      value={existingDebtInput}
                    />
                  </FieldRow>
                </div>
              </PanelRow>

              <PanelRow>
                <div className="grid gap-3">
                  <button
                    aria-controls="lanekalkulator-avansert"
                    aria-expanded={advancedOpen}
                    className="inline-flex w-full items-center justify-between gap-4 rounded-[5px] bg-slate-50 px-4 py-3 text-left text-sm font-semibold text-slate-950 transition hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary-strong)]"
                    onClick={() => setAdvancedOpen((current) => !current)}
                    type="button"
                  >
                    <span>
                      {advancedOpen ? "Skjul avanserte valg" : "Vis avanserte valg"}
                    </span>
                    <span
                      aria-hidden="true"
                      className={`text-lg leading-none text-slate-400 transition ${advancedOpen ? "rotate-45" : ""}`}
                    >
                      +
                    </span>
                  </button>
                  <div
                    className={advancedOpen ? "mt-1 grid gap-3 md:grid-cols-2 lg:grid-cols-5" : "hidden"}
                    id="lanekalkulator-avansert"
                  >
                    <FieldRow
                      info="Nominell boliglånsrente før rentestress. Stresstesten bruker denne renten pluss 3 prosentpoeng, minst 7 %."
                      label="Rente"
                    >
                      <NumericInput
                        onChange={setInterestRateInput}
                        placeholder="5"
                        suffix="%"
                        value={interestRateInput}
                      />
                    </FieldRow>

                    <FieldRow
                      info="Lengre nedbetalingstid gir lavere terminbeløp og kan øke beregnet betjeningsevne. Kortere nedbetalingstid gir høyere månedskostnad."
                      label="Nedbetalingstid"
                    >
                      <NumericInput
                        onChange={setTermYearsInput}
                        placeholder="25"
                        suffix="år"
                        value={termYearsInput}
                      />
                    </FieldRow>

                    <FieldRow
                      info="Antall voksne brukes til å anslå normale levekostnader. Kalkulatoren legger inn et forenklet anslag på 12 000 kr per måned per voksen, pluss 4 000 kr i fast husholdningsbeløp."
                      label="Voksne"
                    >
                      <NumericInput
                        onChange={setAdultsInput}
                        placeholder="1"
                        value={adultsInput}
                      />
                    </FieldRow>

                    <FieldRow
                      info="Barn øker beregnet livsopphold i modellen. Kalkulatoren legger inn et forenklet anslag på 6 500 kr per måned per barn."
                      label="Barn"
                    >
                      <NumericInput
                        onChange={setChildrenInput}
                        placeholder="0"
                        value={childrenInput}
                      />
                    </FieldRow>

                    <FieldRow
                      info="Brukes i omvendt kalkulator for å vise omtrentlig inntekt og egenkapital som kreves."
                      label="Ønsket lån"
                    >
                      <NumericInput
                        onChange={setTargetLoanInput}
                        placeholder="3 000 000"
                        value={targetLoanInput}
                      />
                    </FieldRow>
                  </div>
                </div>
              </PanelRow>
            </div>
          </section>
        </div>
      </div>

      <section className="grid gap-4 lg:grid-cols-[1.35fr_1fr_1fr]">
        <HeroMetricCard
          detail={`Laveste av inntektsgrense, betjeningsevne og egenkapital. Flaskehals: ${result.bottleneck.label.toLowerCase()}.`}
          label="Du kan låne ca."
          prominent
          tone={getToneForLimit(result.bottleneck.key)}
          value={formatCurrency(result.actualLoan)}
        />
        <HeroMetricCard
          detail={`Estimert boligpris med ${formatCurrency(equity)} i egenkapital.`}
          label="Mulig boligpris"
          tone="equity"
          value={formatCurrency(result.homePrice)}
        />
        <HeroMetricCard
          detail={`Annuitetslån med ${formatNumber(interestRate)} % rente og ${formatNumber(termYears)} år.`}
          label="Terminbeløp"
          tone="serviceability"
          value={formatCurrency(result.monthlyPayment)}
        />
      </section>

      <section className="grid gap-5 xl:grid-cols-3">
        {result.limits.map((limit) => (
          <MetricSection
            description={limit.detail}
            key={limit.key}
            title={limit.label}
          >
            <MetricRow
              active={limit.key === result.bottleneck.key}
              label={limit.key === result.bottleneck.key ? "Flaskehals" : "Grense"}
              tone={getToneForLimit(limit.key)}
              value={formatCurrency(limit.value)}
            />
          </MetricSection>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <InsightCard
          detail={getBottleneckInsight(result.bottleneck.key, result)}
          label="Hva begrenser lånet?"
          primaryValue={result.bottleneck.label}
          secondaryLabel="Neste krone bør brukes på"
          secondaryValue={getNextAction(result.bottleneck.key)}
        />
        <InsightCard
          detail={`Med dagens flaskehals øker låneevnen med ca. ${formatCurrency(result.equityEffect)} hvis egenkapitalen øker med 100 000 kr.`}
          label="+100 000 kr egenkapital"
          primaryValue={formatCurrency(result.equityEffect)}
          secondaryLabel="Ny låneevne"
          secondaryValue={formatCurrency(result.actualLoan + result.equityEffect)}
        />
        <InsightCard
          detail={`Én prosentpoeng lavere rente øker betjeningsevnen med ca. ${formatCurrency(result.rateDownEffect)}. Én prosentpoeng høyere rente kutter den med ca. ${formatCurrency(result.rateUpEffect)}.`}
          label="Renteeffekt"
          primaryValue={`+${formatCurrency(result.rateDownEffect)}`}
          secondaryLabel="+1 prosentpoeng"
          secondaryValue={`-${formatCurrency(result.rateUpEffect)}`}
        />
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <MetricSection
          description={`Låneevne ved ulike renter. Stresstest bruker ${formatNumber(result.stressRate)} %. `}
          title="Rentesensitivitet"
        >
          {result.sensitivity.map((item) => (
            <MetricRow
              key={item.rate}
              label={item.rate === result.stressRate ? "Stresstest" : `${formatNumber(item.rate)} % rente`}
              tone={item.rate === result.stressRate ? "warning" : "serviceability"}
              value={formatCurrency(item.serviceabilityLimit)}
            />
          ))}
        </MetricSection>

        <MetricSection
          description="Første termin viser hvordan terminbeløpet fordeles mellom renter og avdrag."
          title="Månedlig kostnad"
        >
          <MetricRow
            label="Terminbeløp"
            tone="serviceability"
            value={formatCurrency(result.monthlyPayment)}
          />
          <MetricRow
            label="Renter første måned"
            tone="warning"
            value={formatCurrency(result.firstMonthInterest)}
          />
          <MetricRow
            label="Avdrag første måned"
            tone="income"
            value={formatCurrency(result.firstMonthPrincipal)}
          />
        </MetricSection>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <InsightCard
          detail={`For å låne ${formatCurrency(targetLoan)} trenger du omtrent ${formatCurrency(result.requiredIncomeForTarget)} i brutto årsinntekt, gitt valgt rente, familie og eksisterende gjeld.`}
          label="Hva må du tjene?"
          primaryValue={formatCurrency(result.requiredIncomeForTarget)}
          secondaryLabel="Ønsket lån"
          secondaryValue={formatCurrency(targetLoan)}
        />
        <InsightCard
          detail={`Med 90 % belåningsgrad krever ${formatCurrency(targetLoan)} i lån minst ${formatCurrency(result.requiredEquityForTarget)} i egenkapital og tilsvarer boligpris rundt ${formatCurrency(result.targetHomePrice)}.`}
          label="Egenkapital for ønsket lån"
          primaryValue={formatCurrency(result.requiredEquityForTarget)}
          secondaryLabel="Maks belåningsgrad"
          secondaryValue="90 %"
        />
      </section>

    </section>
  );
}

function calculateLoanResult({
  annualIncome,
  equity,
  existingDebt,
  interestRate,
  termYears,
  adults,
  children,
  targetLoan,
}: {
  annualIncome: number;
  equity: number;
  existingDebt: number;
  interestRate: number;
  termYears: number;
  adults: number;
  children: number;
  targetLoan: number;
}): LoanResult {
  const stressRate = Math.max(interestRate + STRESS_RATE_INCREASE, MIN_STRESS_RATE);
  const incomeLimit = Math.max(annualIncome * MAX_DEBT_TO_INCOME - existingDebt, 0);
  const equityLimit = Math.max((equity * MAX_LOAN_TO_VALUE) / (1 - MAX_LOAN_TO_VALUE), 0);
  const serviceabilityLimit = calculateServiceabilityLimit({
    annualIncome,
    existingDebt,
    stressRate,
    termYears,
    adults,
    children,
  });

  const limits: LoanLimit[] = [
    {
      key: "income",
      label: "Inntektsgrense",
      value: incomeLimit,
      detail: "Samlet gjeld kan normalt ikke overstige 5 ganger brutto årsinntekt.",
    },
    {
      key: "serviceability",
      label: "Betjeningsevne",
      value: serviceabilityLimit,
      detail: `Må tåle rentestress på ${formatNumber(stressRate)} % etter livsopphold og eksisterende gjeld.`,
    },
    {
      key: "equity",
      label: "Egenkapital",
      value: equityLimit,
      detail: "Boliglån kan normalt ikke overstige 90 % av forsvarlig boligverdi.",
    },
  ];

  const bottleneck = limits.reduce((lowest, limit) => (limit.value < lowest.value ? limit : lowest));
  const actualLoan = Math.max(bottleneck.value, 0);
  const monthlyPayment = calculateAnnuityPayment(actualLoan, interestRate, termYears);
  const firstMonthInterest = (actualLoan * interestRate) / 100 / 12;
  const firstMonthPrincipal = Math.max(monthlyPayment - firstMonthInterest, 0);
  const homePrice = actualLoan + equity;
  const equityEffect = Math.max(
    Math.min(
      calculateLoanWithOverrides({ annualIncome, equity: equity + 100000, existingDebt, interestRate, termYears, adults, children }) -
        actualLoan,
      900000,
    ),
    0,
  );
  const rateDownLoan = calculateLoanWithOverrides({
    annualIncome,
    equity,
    existingDebt,
    interestRate: Math.max(interestRate - 1, 0.1),
    termYears,
    adults,
    children,
  });
  const rateUpLoan = calculateLoanWithOverrides({
    annualIncome,
    equity,
    existingDebt,
    interestRate: interestRate + 1,
    termYears,
    adults,
    children,
  });

  const sensitivity = [...SENSITIVITY_RATES, stressRate]
    .filter((rate, index, values) => values.indexOf(rate) === index)
    .map((rate) => ({
      rate,
      serviceabilityLimit: calculateServiceabilityLimit({
        annualIncome,
        existingDebt,
        stressRate: rate,
        termYears,
        adults,
        children,
      }),
      monthlyPayment: calculateAnnuityPayment(actualLoan, rate, termYears),
    }));

  const requiredIncomeForTarget = calculateRequiredIncomeForTarget({
    targetLoan,
    existingDebt,
    stressRate,
    termYears,
    adults,
    children,
  });
  const targetHomePrice = targetLoan / MAX_LOAN_TO_VALUE;
  const requiredEquityForTarget = Math.max(targetHomePrice - targetLoan, 0);

  return {
    actualLoan,
    bottleneck,
    limits,
    stressRate,
    monthlyPayment,
    firstMonthInterest,
    firstMonthPrincipal,
    homePrice,
    equityEffect,
    rateDownEffect: Math.max(rateDownLoan - actualLoan, 0),
    rateUpEffect: Math.max(actualLoan - rateUpLoan, 0),
    requiredIncomeForTarget,
    requiredEquityForTarget,
    targetHomePrice,
    sensitivity,
  };
}

function calculateLoanWithOverrides(input: {
  annualIncome: number;
  equity: number;
  existingDebt: number;
  interestRate: number;
  termYears: number;
  adults: number;
  children: number;
}) {
  const stressRate = Math.max(input.interestRate + STRESS_RATE_INCREASE, MIN_STRESS_RATE);
  const incomeLimit = Math.max(input.annualIncome * MAX_DEBT_TO_INCOME - input.existingDebt, 0);
  const equityLimit = Math.max((input.equity * MAX_LOAN_TO_VALUE) / (1 - MAX_LOAN_TO_VALUE), 0);
  const serviceabilityLimit = calculateServiceabilityLimit({
    annualIncome: input.annualIncome,
    existingDebt: input.existingDebt,
    stressRate,
    termYears: input.termYears,
    adults: input.adults,
    children: input.children,
  });

  return Math.min(incomeLimit, equityLimit, serviceabilityLimit);
}

function calculateServiceabilityLimit({
  annualIncome,
  existingDebt,
  stressRate,
  termYears,
  adults,
  children,
}: {
  annualIncome: number;
  existingDebt: number;
  stressRate: number;
  termYears: number;
  adults: number;
  children: number;
}) {
  const monthlyNetIncome = estimateNetAnnualIncome(annualIncome) / 12;
  const livingCost = estimateMonthlyLivingCost(adults, children);
  const existingDebtPayment = calculateAnnuityPayment(existingDebt, stressRate, termYears);
  const availableForMortgage = Math.max(monthlyNetIncome - livingCost - existingDebtPayment, 0);
  const factor = calculateMonthlyAnnuityFactor(stressRate, termYears);

  if (factor <= 0) {
    return 0;
  }

  return availableForMortgage / factor;
}

function calculateRequiredIncomeForTarget({
  targetLoan,
  existingDebt,
  stressRate,
  termYears,
  adults,
  children,
}: {
  targetLoan: number;
  existingDebt: number;
  stressRate: number;
  termYears: number;
  adults: number;
  children: number;
}) {
  const incomeByDebtRatio = (targetLoan + existingDebt) / MAX_DEBT_TO_INCOME;
  const neededMonthly =
    estimateMonthlyLivingCost(adults, children) +
    calculateAnnuityPayment(existingDebt, stressRate, 5) +
    calculateAnnuityPayment(targetLoan, stressRate, termYears);

  let low = 0;
  let high = 5000000;

  for (let index = 0; index < 40; index += 1) {
    const middle = (low + high) / 2;
    const monthlyNet = estimateNetAnnualIncome(middle) / 12;

    if (monthlyNet >= neededMonthly) {
      high = middle;
    } else {
      low = middle;
    }
  }

  return Math.max(incomeByDebtRatio, high);
}

function calculateAnnuityPayment(principal: number, annualRate: number, years: number) {
  if (principal <= 0 || years <= 0) {
    return 0;
  }

  return principal * calculateMonthlyAnnuityFactor(annualRate, years);
}

function calculateMonthlyAnnuityFactor(annualRate: number, years: number) {
  const months = years * 12;
  const monthlyRate = annualRate / 100 / 12;

  if (monthlyRate <= 0) {
    return 1 / months;
  }

  return (monthlyRate * (1 + monthlyRate) ** months) / ((1 + monthlyRate) ** months - 1);
}

function estimateNetAnnualIncome(annualIncome: number) {
  if (annualIncome <= 0) {
    return 0;
  }

  const taxRate = annualIncome <= 500000 ? 0.25 : annualIncome <= 900000 ? 0.31 : 0.36;
  return annualIncome * (1 - taxRate);
}

function estimateMonthlyLivingCost(adults: number, children: number) {
  return (
    adults * MONTHLY_LIVING_COST_PER_ADULT +
    children * MONTHLY_LIVING_COST_PER_CHILD +
    MONTHLY_FIXED_HOUSEHOLD_COST
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
  info?: string;
  children: ReactNode;
};

function FieldRow({ label, info, children }: FieldRowProps) {
  return (
    <div className="grid gap-2">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <label className="text-sm font-semibold text-slate-950">{label}</label>
          {info ? <InfoTip text={info} /> : null}
        </div>
      </div>
      {children}
    </div>
  );
}

type NumericInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  suffix?: string;
  autoFocus?: boolean;
};

function NumericInput({ value, onChange, placeholder, suffix, autoFocus = false }: NumericInputProps) {
  return (
    <div className="relative">
      <input
        autoFocus={autoFocus}
        className={`${inputClassName} ${suffix ? "pr-12" : ""}`}
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

type HeroMetricCardProps = {
  label: string;
  value: string;
  detail: string;
  tone: MetricTone;
  prominent?: boolean;
};

function HeroMetricCard({ label, value, detail, tone, prominent = false }: HeroMetricCardProps) {
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
  active?: boolean;
};

function MetricRow({ label, value, tone = "default", active = false }: MetricRowProps) {
  return (
    <div
      className={`flex items-center justify-between gap-4 rounded-[5px] px-4 py-3 transition-all duration-300 ${
        active ? "bg-[rgba(20,83,45,0.08)] ring-1 ring-[rgba(20,83,45,0.18)]" : "bg-slate-50"
      }`}
    >
      <span className="truncate text-sm text-slate-700">{label}</span>
      <span className={`shrink-0 text-sm font-semibold tabular-nums ${getValueClassName(tone)}`}>
        {value}
      </span>
    </div>
  );
}

type InsightCardProps = {
  label: string;
  primaryValue: string;
  secondaryLabel: string;
  secondaryValue: string;
  detail: string;
};

function InsightCard({ label, primaryValue, secondaryLabel, secondaryValue, detail }: InsightCardProps) {
  return (
    <article className="rounded-[5px] bg-white p-5 shadow-[0_16px_44px_rgba(15,23,42,0.05)]">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{label}</p>
      <p className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-slate-950 tabular-nums">
        {primaryValue}
      </p>
      <p className="mt-3 text-sm leading-6 text-slate-600">{detail}</p>
      <div className="mt-4 flex items-center justify-between gap-4 rounded-[5px] bg-slate-50 px-4 py-3">
        <span className="min-w-0 text-sm text-slate-600">{secondaryLabel}</span>
        <span className="shrink-0 text-sm font-semibold text-slate-950 tabular-nums">
          {secondaryValue}
        </span>
      </div>
    </article>
  );
}

function InfoTip({ text }: { text: string }) {
  return (
    <span className="group relative inline-flex">
      <button
        aria-label={text}
        className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-200 text-[11px] font-semibold text-slate-600 transition hover:bg-slate-300 hover:text-slate-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary-strong)]"
        type="button"
      >
        i
      </button>
      <span className="pointer-events-none absolute left-0 top-[calc(100%+0.5rem)] z-20 w-[min(18rem,calc(100vw-2rem))] max-w-[18rem] whitespace-normal break-words rounded-[5px] bg-slate-950 px-3 py-2 text-xs leading-5 text-white opacity-0 shadow-[0_16px_40px_rgba(15,23,42,0.20)] transition group-focus-within:opacity-100 group-hover:opacity-100">
        {text}
      </span>
    </span>
  );
}

const inputClassName =
  "h-11 w-full rounded-[5px] border border-black/8 bg-white px-4 text-base text-slate-950 outline-none transition-all duration-200 placeholder:text-slate-400 hover:border-black/14 focus:border-[rgba(20,83,45,0.32)] focus:ring-4 focus:ring-[rgba(20,83,45,0.10)]";

function getBottleneckInsight(key: LimitKey, result: LoanResult) {
  if (key === "income") {
    return `Samlet gjeldsgrad stopper deg først. For å låne mer må inntekten opp eller eksisterende gjeld ned; ${formatCurrency(100000)} mindre gjeld øker grensen med samme beløp.`;
  }

  if (key === "serviceability") {
    return `Månedlig betalingsevne stopper deg først. Lavere rente, lengre nedbetalingstid eller lavere annen gjeld gir størst effekt.`;
  }

  return `Egenkapitalen stopper deg først. Med dagens regel kan ${formatCurrency(100000)} mer egenkapital øke maksimal boligpris med ca. ${formatCurrency(result.equityEffect + 100000)}.`;
}

function getNextAction(key: LimitKey) {
  if (key === "income") {
    return "lavere gjeld";
  }

  if (key === "serviceability") {
    return "lavere månedskostnad";
  }

  return "mer egenkapital";
}

function getToneForLimit(key: LimitKey): MetricTone {
  if (key === "income") {
    return "income";
  }

  if (key === "serviceability") {
    return "serviceability";
  }

  return "equity";
}

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

  return `${formattedInteger},${decimalPart}`;
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
  if (tone === "income") {
    return "bg-emerald-50";
  }

  if (tone === "serviceability") {
    return "bg-sky-50";
  }

  if (tone === "equity") {
    return "bg-amber-50";
  }

  if (tone === "warning") {
    return "bg-rose-50";
  }

  return "bg-white";
}

function getValueClassName(tone: MetricTone) {
  if (tone === "income") {
    return "text-emerald-800";
  }

  if (tone === "serviceability") {
    return "text-sky-900";
  }

  if (tone === "equity") {
    return "text-amber-800";
  }

  if (tone === "warning") {
    return "text-rose-700";
  }

  return "text-slate-950";
}
